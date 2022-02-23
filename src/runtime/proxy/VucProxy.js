import debounce from 'lodash-es/debounce';
import { createApp, markRaw, nextTick, resolveDirective, vShow, h } from 'vue';

import { castArray, isString, isFunction, isObject } from '@/helpers/lang';
import { compileToFunction } from '@/runtime/vue-template-compiler/compile.js';
import { getVucProxyHooks, getVucProxyCreateApp } from '@/core/config';
import { getAstId, callHook, astIdDirective } from './util';
import RenderNode from './RenderNode';

function createRender(vucAst) {
  return function () {
    if (vucAst.rootNode) {
      const context = vucAst.createRenderContext();
      context.dirsMap = {};
      callHook('onBeforeRender', context);

      vucAst.eachAllNode(function (node) {
        let vucProxyOption = node.getConfig('vucProxyOption');
        if (vucProxyOption && vucProxyOption.onBeforeRender) {
          vucProxyOption.onBeforeRender(node, context);
        }
      });

      let renderNode = new RenderNode(vucAst.rootNode, context);
      let template = renderNode.toTemplate(context);
      let render = compileToFunction(template);

      try {
        return render(this);
      } catch (e) {
        console.error(e);
        return h('div', {
          style: 'color:red',
        }, e.message);
      }
    }
  };
}

function createVucProxyErrorHandler(vucAst) {
  const fn = debounce(() => {
    nextTick().then(() => {
      vucAst.vucInstance.$forceUpdate();
      return nextTick();
    }).then(() => {
      Object.keys(vucAst.errorIdMaps).forEach(k => vucAst.errorIdMaps[k] = undefined);
    });
  });

  return function (err, vm, info) {
    let astId;
    while (vm && !astId) {
      astId = getAstId(vm);
      vm = vm.$parent;
    }
    console.error(err);
    if (astId) {
      if (!vucAst.errorIdMaps) {
        vucAst.errorIdMaps = markRaw({});
      }
      vucAst.errorIdMaps[astId] = err.message;
      fn();
    }
  };
}

function createProxyDir(vucAst) {
  const dirHookNames = ['created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeUnmount', 'unmounted'];
  const ProxyDir = {};
  dirHookNames.forEach(hookName => {
    ProxyDir[hookName] = function (el, binding, vnode) {
      let dirsMap = vucAst.renderContext.dirsMap;
      let oldValueMap = {};
      binding.oldValue?.forEach(dir => {
        oldValueMap[dir.name] = dir.value;
      });

      binding.value.forEach(dir => {
        let relDir = dirsMap[dir.name];
        if (relDir) {
          let bind = {
            dir: relDir,
            instance: binding.instance,
            modifiers: dir.modifiers,
            arg: dir.arg,
            oldValue: oldValueMap[dir.name],
            value: dir.value,
          };

          const callDirHook = (name) => {
            let hook = relDir[name];
            if (hook) {
              hook(el, bind, vnode);
            } else if (['mounted', 'updated'].includes(name)) {
              relDir(el, bind, vnode);
            }
          };

          if (hookName === 'beforeUpdate' && !oldValueMap.hasOwnProperty(dir.name)) {
            return callDirHook('created'), callDirHook('beforeMount');
          }

          if (hookName === 'updated' && !oldValueMap.hasOwnProperty(dir.name)) {
            return callDirHook('mounted');
          }

          callDirHook(hookName);
        }
      });
    };
  });

  return ProxyDir;
}

function createWatchProxy(vucAst) {
  let VueOption = vucAst.VueOption;
  let watchOptions = VueOption.watch;
  let unwatchs = ( vucAst.unwatchs = {} );

  return function () {
    //代理 watch
    for(const key in watchOptions) {
      let handler = watchOptions[key];
      let options = {};
      if (isString(handler)) {
        handler = this[handler];
      } else if (isObject(handler)) {
        options = handler;
        handler = handler.handler;
      } else if (isFunction(handler)) {
      }
      unwatchs[key] = this.$watch(key, handler, options);
    }
  };
}

function createSetElAstId(ast) {
  return function (vm) {
    let astId = getAstId(vm);
    if (astId) {
      let el = vm.$el;
      if (el.nodeType === 3) {
        if (!el.nextElementSibling?.dataset?.astId) {
          el = el.nextElementSibling;
        } else {
          el = null;
        }
      }
      if (el?.nodeType === 1) {
        el.setAttribute('data-ast-id', astId);
      }
    }
  };
}

function createPushVucInstance(vucAst) {
  let vucInstanceMap = ( vucAst.vucInstanceMap = markRaw({}) );
  vucAst.getVucInstancesById = (id) => vucInstanceMap[id];

  return function (vm) {
    let astId = getAstId(vm);
    if (astId) {
      let arr = vucInstanceMap[astId];
      if (!arr) {
        arr = vucInstanceMap[astId] = [];
      }
      arr.push(vm);
    }
  };
}

function createRemoveVucInstance(vucAst) {
  return function (vm) {
    let astId = getAstId(vm);
    if (astId) {
      let arr = vucAst.getVucInstancesById(astId);
      let i = -1;
      if (arr && ( i = arr.indexOf(vm) ) > -1) {
        arr.splice(i, 1);
      }
    }
  };
}

function generateVucProxy(vucAst, mixin) {
  let VueOption = vucAst.VueOption;

  const proxyWatch = createWatchProxy(vucAst);

  let VucProxy = Object.assign({}, VueOption, {
    name: 'VucProxy',
    render: createRender(vucAst),
    watch: {},
  });

  VucProxy.mixins = VucProxy.mixins || [];
  VucProxy.mixins.push({
    created() {
      this[Symbol.unscopables] = {};
      proxyWatch.call(this);
    },
    directives: {
      astProxy: createProxyDir(vucAst),
      astId: astIdDirective,
    },
  });

  if (mixin) {
    VucProxy.mixins.push(mixin);
  }

  return VucProxy;
}

function getCreateProxyApp() {
  let createProxyApp = getVucProxyCreateApp();
  if (createProxyApp == null) {
    return function (VucProxy) {
      return createApp(VucProxy);
    };
  }
  return createProxyApp;
}

function createVucPorxyApp(vucAst, mixin) {
  const VucProxy = generateVucProxy(vucAst, mixin);
  const createProxyApp = getCreateProxyApp();
  const vucPorxyApp = createProxyApp(VucProxy);

  const errorHandler = createVucProxyErrorHandler(vucAst);
  const setElAstId = createSetElAstId(vucAst);
  const pushVucInstance = createPushVucInstance(vucAst);
  const removeVucInstance = createRemoveVucInstance(vucAst);

  vucPorxyApp.config.errorHandler = errorHandler;
  vucPorxyApp.mixin({
    props: {
      astId: String,
    },
    mounted() {
      setElAstId(this);
      pushVucInstance(this);
    },
    unmounted() {
      removeVucInstance(this);
    },
  });

  callHook('onCreatedApp', vucPorxyApp);

  return vucPorxyApp;
}

export { createVucPorxyApp };

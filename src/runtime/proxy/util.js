import { getVucProxyHooks } from '@/core/config';
import { castArray } from '@/helpers/lang';

function callHook(hook, ...args) {
  let vucProxyHooks = getVucProxyHooks();
  if (vucProxyHooks && vucProxyHooks[hook]) {
    let result = {};
    let hooks = castArray(vucProxyHooks[hook]);
    hooks.forEach((h) => {
      Object.assign(result, h.call(this, ...args));
    });
    return result;
  }
}

function getAstId(vm) {
  const vnode = vm.$.vnode;
  return vnode.dirs?.find(dir => dir.dir.name === 'AstId')?.value;
}

const astIdDirective = {
  name: 'AstId',
};

export {
  callHook,
  getAstId,
  astIdDirective,
};

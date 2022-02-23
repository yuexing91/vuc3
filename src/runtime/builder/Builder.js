import { isString, isFunction } from '@/helpers/lang';

import vueLoader from './loaders/vueLoader';

const globalModules = {};

class Builder {
  build(file) {
    const modules = ( this.modules = {} );
    let result = vueLoader(this, file.content, file);

    result.modules.forEach((module) => {
      const m = this.createModuleFunction(module);
      if (m) {
        this.modules[file.getPath()] = m;
      } else if (typeof module == 'object') {
        this.modules[module.name] = this.createModuleFunction(module.module);
      }
    });

    let installedModules = ( this.installedModules = {} );

    function __vuc_require__(moduleId, reload) {
      if (installedModules[moduleId] && !reload) {
        return installedModules[moduleId].exports;
      }
      var module = ( installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {},
      } );
      let m = modules[moduleId] || getGlobalModules(moduleId);
      m.call(module.exports, module, module.exports, __vuc_require__);
      return module.exports;
    }

    this.entry = function () {
      return __vuc_require__(file.getPath());
    };
    this.require = this.entry.require = __vuc_require__;
    return {
      entry: this.entry,
      result,
    };
  }

  createModuleFunction(code) {
    if (isString(code)) {
      return new Function('module', '__vuc_exports__', '__vuc_require__', code);
    }
    if (isFunction(code)) {
      return code;
    }
  }

}


function installModule(name, module) {
  globalModules[name] = module;
}

function installDefaultModule(name, module) {
  if (globalModules[name]) {
    globalModules[name].default = module;
  } else {
    globalModules[name] = {
      default: module,
    };
  }
}

function getGlobalModules(name) {
  return globalModules[name] ? function (module, __vuc_exports__, __vuc_require__) {
    Object.assign(__vuc_exports__, globalModules[name]);
  } : null;
}

export {
  installModule,
  installDefaultModule,
};

export default Builder;

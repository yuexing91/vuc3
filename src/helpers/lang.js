import { isBooleanType, isNumberType } from './codeType';

function camelize(str) {
  if (!str) return str;
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function kebabCase(str) {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.substring(1).replace(/[A-Z]/g, function (c) {
    return c ? '-' + c.toLowerCase() : '';
  });
}

function formatComponentName(name) {
  return kebabCase(name);
}

function someHandlerIsFalse(handlers, ...args) {
  return handlers.some((handler) => {
    let result = handler;
    if (isFunction(handler)) {
      result = handler(...args);
    }
    return result === false;
  });
}

function createList(str, split) {
  return str.split(split || '|').map((line) => {
    const columns = line.trim().split(':');
    return {
      value: columns[0],
      label: columns[1] || columns[0],
    };
  });
}

function moveArrayItem(value, curIndex, targetIndex) {
  let item = value[curIndex];
  value.splice(curIndex, 1);
  if (curIndex < targetIndex) {
    targetIndex--;
  }
  value.splice(targetIndex, 0, item);
}

function parseComponentAndProps(str) {
  let sp1 = str.split('?');
  return {
    id: sp1[0],
    props: parseProps(sp1[1]),
  };
}

function parseProps(propsStr) {
  let props = {};
  if (propsStr) {
    propsStr.split('&').map((prop) => {
      let sp2 = prop.split('=');
      let [key, val] = sp2;

      if (key.startsWith('@')) {
        key = key.substring(1);
        val = createList(val);
      } else if (key.startsWith('#')) {
        key = key.substring(1);
        if (isNumberType(val)) {
          val = parseFloat(val);
        } else if (isBooleanType(val)) {
          val = val === 'true';
        }
      }
      props[key] = val;
    });
  }
  return props;
}

function parsePath(path) {
  let match;
  let parentPath;
  let arrayIndex;
  let isArray;
  let id;
  if (match = path.match(/(.*)\[(\d+)\]$/)) {
    parentPath = match[1];
    arrayIndex = +match[2];
    isArray = true;
  } else {
    let paths = path.split('.');
    id = paths.pop();
    parentPath = paths.join('.');
  }

  return {
    parentPath,
    arrayIndex,
    isArray,
    id,
  };
}

const makeMap = (str) => {
  const map = {};
  str.split(',').forEach((k) => ( map[k] = true ));
  return map;
};

const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isObject = (val) => val !== null && typeof val === 'object';
const castArray = (array) => ( isArray(array) ? array : [array] );

const jsKeywordMap = makeMap('abstract,arguments,boolean,break,byte,' +
    'case,catch,char,class*,const,' +
    'continue,debugger,default,delete,do,' +
    'double,else,enum*,eval,export*,' +
    'extends*,false,final,finally,float,' +
    'for,function,goto,if,implements,' +
    'import*,in,instanceof,int,interface,' +
    'let,long,native,new,null,' +
    'package,private,protected,public,return,' +
    'short,static,super*,switch,synchronized,' +
    'this,throw,throws,transient,true,' +
    'try,typeof,var,void,volatile,' +
    'while,with,yield');

const isIdentifier = (val) => !jsKeywordMap[val] && /^[$_a-z][$_a-z0-9]*$/i.test(val);

export {
  camelize,
  capitalize,
  kebabCase,
  makeMap,
  isArray,
  isFunction,
  isString,
  isObject,
  castArray,
  someHandlerIsFalse,
  parseComponentAndProps,
  isIdentifier,
  moveArrayItem,
  parseProps,
  parsePath,
  formatComponentName
};

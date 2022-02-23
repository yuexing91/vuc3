import { isString, isFunction, parseComponentAndProps, isObject } from '@/helpers/lang';

import { getEditorComponentConfig } from '@/core/valueEditors';
import { isBooleanType, isNumberType, isStringType } from '@/helpers/codeType';

function getPropsData(option, context) {
  if (option.props && isFunction(option.props)) {
    return option.props(context);
  }
  return option.props;
}

function parseEditorOptions(opts, context) {
  if (!opts) return null;
  let { id, props } = parseComponentAndProps(isString(opts) ? opts : opts.type);
  let option = { id };
  if (!isString(opts)) {
    Object.assign(option, opts);
  }
  if (isFunction(opts.props)) {
    option.props = function () {
      let p = opts.props.apply(null, arguments);
      return Object.assign(props, p);
    };
  } else if (isObject(opts.props)) {
    option.props = Object.assign(props, opts.props);
  } else {
    option.props = props;
  }

  let config = getEditorComponentConfig(option.id);
  if (config) {
    return Object.assign(
        {
          propsData: getPropsData(option, context),
          validateValue(value, type) {
            if (value === null || value === undefined) return false;
            type = type || getType(value);
            return ( config.dataType == 'any' || type == config.dataType ) && ( config.validate ? config.validate(value, this.propsData) : true );
          },
          name: config.name,
          dataType: config.dataType,
        },
        option,
    );
  }
}

function getType(code) {
  if (isStringType(code)) {
    return 'string';
  }
  if (isNumberType(code)) {
    return 'number';
  }
  if (isBooleanType(code)) {
    return 'boolean';
  }
  return 'object';
}

export {
  parseEditorOptions,
};

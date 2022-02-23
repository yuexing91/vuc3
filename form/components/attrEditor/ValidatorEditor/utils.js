export const types = {
  string: '文本',
  number: '数字',
  url: 'url',
  email: 'email',
  integer: '整数',
  float: '浮点数',
  array: '数组',
  enum: '枚举',
  boolean: '布尔',

  object: '对象',
  method: '函数',
  regexp: '正则',
  date: '日期',
  hex: '16进制',
};

const formatterMap = {
  type(r) {
    return types[r.type];
  },

  required(r) {
    return '必填';
  },

  range(r) {
    return `范围(${r.min}-${r.max})`;
  },
  len(r) {
    return `长度(${r.len})`;
  },
  pattern(r) {
    return '正则';
  },
};

function isNumber(num) {
  return typeof num == 'number';
}

const isEnableMap = {
  type(r) {
    return r.type ? true : false;
  },

  required(r) {
    return r.required ? true : false;
  },

  range(r) {
    return isNumber(r.min) || isNumber(r.max);
  },
  len(r) {
    return isNumber(r.len);
  },
  pattern(r) {
    return r.pattern ? true : false;
  },
};

export function parseEnable(rule) {
  for (let k in isEnableMap) {
    let f = isEnableMap[k];
    rule.state = rule.state || {};
    rule.state[k] = f(rule);
  }
  return rule;
}

export function parseSubRules(rule) {
  let subRules = [];
  for (let k in rule.state) {
    let state = rule.state[k];
    if (state) {
      subRules.push(formatterMap[k](rule));
    }
  }
  return subRules;
}

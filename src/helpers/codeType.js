const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/;
const fnInvokeRE = /\([^)]*?\);*$/;
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

function isNumberType(str) {
  return /^-?[0-9]+\.?[0-9]*$/.test(str);
}

function isBooleanType(str) {
  return str === 'true' || str === 'false';
}

function isArrayType(str) {
  return str.startsWith('[') && str.endsWith(']');
}

function isObjectType(str) {
  return str.startsWith('{') && str.endsWith('}');
}

function isStringType(str) {
  return ( str.startsWith('"') && str.endsWith('"') ) || ( str.startsWith('\'') && str.endsWith('\'') ) || ( str.startsWith('`') && str.endsWith('`') );
}

function isSimplePath(str) {
  return simplePathRE.test(str) && !isBooleanType(str);
}

function isFunctionType(str) {
  return fnExpRE.test(str);
}

export { isStringType, isNumberType, isBooleanType, isFunctionType, isSimplePath, isArrayType, isObjectType };

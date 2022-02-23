import { isFunction, isString, parseProps, castArray } from '@/helpers/lang';

function parseComponentProps(config, combo, propNames) {
  if (!config.items) return {};
  let items = config.items.filter(item => {
    let vucNode = combo.getNode(item.nodeKey);
    if (!vucNode) return false;

    if (item.excludeTags && castArray(item.excludeTags).some(tag => vucNode.eqTag(tag))) {
      return false;
    }

    if (item.show === false || ( isFunction(item.show) && item.show(vucNode) === false )) {
      return false;
    }

    return true;
  }).map(item => {
    let vucNode = combo.getNode(item.nodeKey);
    let props = {};

    propNames.forEach(pn => {
      props[pn] = item[pn];
    });

    props.vucNode = vucNode;

    return props;
  });

  return {
    items,
  };
}

export {
  parseComponentProps,
};

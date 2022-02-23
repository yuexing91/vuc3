export default {
  id: 'a-table-column',
  name: '表格列',
  eventTypes: [],
  type: ['table-column'],
  slots: [
    {
      slot: 'title',
      name: '列头',
    },
    {
      slot: 'default',
      name: '列内容',
      scope: '{ text, record }',
    },
  ],
  props: {
    title: {
      label: '列头',
      editors: 'string',
    },
    width: {
      label: '列宽',
      editors: 'string',
    },
  },

  parentLimit(parent) {
    return parent.tag === 'aTable';
  },

  childLimit() {
    return false;
  },

  vucProxyOption: {
    onRender({ node, attrMap, children }, context) {
      let titleSlot = node.findChild((child) => child.getSlotName() == 'title');
      if (!titleSlot) {
        let title = attrMap.title;
        attrMap.title = undefined;
        children.push({
          toTemplate() {
            return `<template #title>
            <span v-ast-id="{ id:'${node._astId}', el: 4 }">
              ${title}
            </span>
          </template>`;
          },
        });
      } else {
        let index = children.findIndex((child) => child.node === titleSlot);
        let [old] = children.splice(index, 1, {
          toTemplate(context) {
            return `<template #title>
            <span v-ast-id="{ id:'${node._astId}', el: 4 }">
              ${old.children.map((c) => c.toTemplate(context))}
            </span>
          </template>`;
          },
        });
      }
    },
  },
};

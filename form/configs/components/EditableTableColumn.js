export default {
  id: 'a-editable-table-column',
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
      scope: '{ text, index, record, editRecord }',
    },
  ],
  props: {
    title: {
      label: '标题',
      editors: 'string',
    },
    dataIndex: {
      label: '数据字段',
      editors: 'string',
    },
    valueType: {
      label: '类型',
      editors: 'radio-group?@items=actions:操作栏|:表单项',
    },
    width: {
      label: '列宽',
      editors: 'string',
    },
    fixed: {
      label: '固定',
      editors: 'radio-group?@items=:无|left:左边|right:右边',
    },
  },

  parentLimit(parent) {
    return parent.tag === 'aEditableTable';
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
        children.push(p(node, title));
      } else {
        let index = children.findIndex((child) => child.node === titleSlot);
        let old = children[index];
        let title = old.children.map((c) => c.toTemplate(context));
        children.splice(index, 1, p(node, title));
      }
    },
  },
};

function p(node, children) {
  return {
    toTemplate() {
      return `<template #title>
            <span v-ast-id="{ id:'${node._astId}', el: 4 }">
              ${children}
            </span>
          </template>`;
    },
  };
}

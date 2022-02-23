function getExpr(objName, attr) {
  if (attr.isVBind()) {
    return objName + `[${attr.attrValue}]`;
  }
  return objName + '.' + attr.attrValue;
}

export default {
  id: 'a-form-item',
  name: '表单项',
  eventTypes: [],
  type: ['container', 'form-item'],
  slots: [
    {
      slot: 'default',
      name: '内容',
      selector: '.ant-form-item-control-wrapper',
      rules: {
        type: /^(input|button|container)$/,
      },
    },
    {
      slot: 'label',
      name: '标签',
      selector: '.ant-form-item-label',
    },
  ],
  props: {
    name: {
      label: '字段名',
      editors: 'string',
      change(attr, old, node) {
        let form = node.closest('a-form');
        let input = node.findChild('.input');
        if (!input || !form) return;

        let formModel = form.getAttrValue(':model');
        if (!formModel) return;

        let [vModelConfig] = input.getConfig('vModel', []);
        if (!vModelConfig) return;

        let vModel = 'v-model';
        if (vModelConfig) {
          vModel += ':' + vModelConfig;
        }

        let expr = '';
        let propName = attr && attr.attrValue;
        if (propName) {
          expr = getExpr(formModel, attr);
        }

        input.setAttrValue(vModel, expr);
      },
    },
    label: {
      label: '标签文本',
      editors: 'string',
    },
    labelAlign: {
      label: '标签对齐方式',
      editors: 'radio-group?@items=left:左|right:右',
    },
    labelCol: {
      label: '标签布局',
      editors: 'col',
    },
    wrapperCol: {
      label: '控件布局',
      editors: 'col',
    },
    rules: {
      label: '验证规则',
      editors: 'validator',
    },
    help: {
      label: '提示信息',
      editors: 'string',
    },
    extra: {
      label: '额外提示信息',
      editors: 'string',
    },
    colon: {
      label: '标签冒号',
      editors: 'boolean?defaultValue=true',
    },
    required: {
      label: '是否必填',
      editors: 'boolean',
    },
  },
};

<template>
  <div class="ds-qcbox">
    <a-input-group compact>
    <a-select
        v-model:value="item.field"
        :options="item.fields"
        style="width: 130px;">
    </a-select>
      <a-select
          v-if="item.extrs"
          v-model:value="item.extr"
          :options="item.extrs"
          style="width: 80px;">
      </a-select>
    <a-select v-model:value="item.operation"
               :options="operations"
               style="width: 90px;">
    </a-select>
    <a-input v-model:value="item.value" style="width: 100px;"></a-input>
    </a-input-group>

  </div>
</template>

<script>
  import _ from 'lodash';

  const map = {
    MM: 'month',
    SS: 'month',
    YY: 'year',
  };
  const formats = {
    YY: 'yyyy年',
    SS: 'yyyy年第M季度',
    MM: 'yyyy年MM月',
  };
  const valueFormats = {
    YY: 'yyyy',
    SS: 'yyyyMM',
    MM: 'yyyyMM',
  };

  const operations = [
    { label: '请选择', value: '' },
    { label: '等于', value: '==' },
    { label: '不等于', value: '!=' },
    { label: '小于', value: 'lt' },
    { label: '小于等于', value: 'lt-eq' },
    { label: '大于', value: 'gt' },
    { label: '大于等于', value: 'gt-eq' },
    { label: '区间', value: 'between', between: true },

    { label: '列表', value: 'in', list: true },
    { label: '不在列表', value: 'not-in', list: true },

    { label: '为空', value: 'is-null', notValue: true },
    { label: '非空', value: 'not-null', notValue: true },

    { label: '包含', value: 'like' },
    { label: '不包含', value: 'not-like' },

    { label: '前缀', value: 'start-like' },
    { label: '非前缀', value: 'not-start-like' },
    { label: '前缀列表', value: 'start-like-list', list: true },

    { label: '后缀', value: 'end-like' },
    { label: '非后缀', value: 'not-end-like' },
    { label: '后缀列表', value: 'end-like-list', list: true },
  ];


  export default {
    props: {
      item: {
        type: Object,
        required: true,
        validator(item) {
          if (!_.has(item, 'value')) {
            return false;
          }
          return true;
        },
      },
    },
    data() {
      return {
        isShowListEditor: false,
        textListValue: [],
      };
    },

    computed: {

      componentValue: {
        get() {
          if (Array.isArray(this.item.value) && _.get(this.valueComponent, 'notSupportArrayValue')) {
            return this.item.value.join(',');
          }
          return this.item.value;
        },
        set(v) {
          this.item.value = v;
        },
      },

      curField() {
        if (this.fields) {
          return _.find(this.fields, { field: this.item.field });
        }
        return this.item;
      },

      operations() {
        return operations;
      },

      valueComponent() {
        let curField = this.curField;
        let op = this.curOperation;
        let list = op && op.list;

        if (op && op.notValue) {
          return;
        }

        if (curField) {
          let conditionProps = curField.conditionProps;

          if (curField.items) {
            return {
              component: 'ds-select',
              props: {
                items: curField.items,
                multiple: op && op.list,
                ...conditionProps,
              },
            };
          }

          if (!list) {
            if (curField.type == 'number') {
              return {
                component: 'ds-number',
                props: {
                  ...conditionProps,
                  range: op && op.between,
                },
              };
            }

            if (curField.type == 'date') {
              let props = {
                ...conditionProps,
              };

              let range = op && op.between;
              let periodType = conditionProps.periodType;

              if (range) {
                if (['YY', 'SS', 'MM'].includes(periodType)) {
                  props.type = 'monthrange';
                } else {
                  props.type = 'daterange';
                }
              } else {
                props.type = map[periodType];
              }

              if (!props.format) {
                props.format = formats[periodType] || 'yyyy-MM-dd';
              }

              if (!props.valueFormat) {
                props.valueFormat = valueFormats[periodType] || 'yyyy-MM-dd';
              }

              return {
                component: 'el-date-picker',
                props: props,
                key: props.type,
              };
            }
          }

        }

        return {
          component: 'el-input',
          notSupportArrayValue: true,
          props: {
            readonly: list,
          },
          list,
        };

      },

      curOperation() {
        return _.find(this.operations, { value: this.item.operation });
      },

    },

    watch: {

      operations() {
        if (!this.curOperation) this.item.operation = '';
      },

      curOperation() {
        if (this.curOperation) {
          if (this.curOperation.list || this.curOperation.between) {
            this.item.value = _.isUndefined(this.item.value) ? [] : _.castArray(this.item.value);
          } else if (Array.isArray(this.item.value)) {
            this.item.value = this.item.value[0];
          }
        }
      },

      curField(field, oldField) {
        if (_.get(field, 'type') !== _.get(oldField, 'type')) {
          this.item.value = undefined;
        }
      },

    },

    methods: {
      showTextareaList() {
        this.isShowListEditor = true;
        this.textListValue = _.isUndefined(this.item.value) ? [] : _.castArray(this.item.value);
      },

      saveTextareaList() {
        this.isShowListEditor = false;
        this.item.value = this.textListValue;
      },

    },

  };
</script>

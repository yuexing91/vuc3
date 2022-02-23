<template>
  <div>
    <code-list :data="items"
               :columns="columns"
               :mode="mode"
               v-model:value="val"
               @add-item="doEdit"
               @click-item="doEdit"
               @delete-item="doDel"
               row-key="path" :defaultExpandedRowKeys="defaultExpandedRowKeys"></code-list>
    <Modal title="编辑" v-model:visible="editState" width="800px" @ok="doSave" :mask-closable="false" destroyOnClose>
      <DataForm :vucAst="vucAst" :vucData="curData"></DataForm>
    </Modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import last from 'lodash-es/last';
import toPath from 'lodash-es/toPath';

import { CodeList } from '@/ui';
import modelValue from '@/mixins/modelValue';

import DataForm from './DataForm';
import { getFormExtras } from './dataExtra';
import designerMixins from '../designerMixins.js';

let typeNameMap = {
  string: '字符串',
  number: '数字',
  boolean: '布尔',
  array: '数组',
  object: '对象',
  expr: '表达式',
};

export default {
  components: {
    DataForm,
    CodeList,
    Modal,
  },

  props: {
    mode: String,
  },

  mixins: [designerMixins, modelValue()],

  data() {
    return {
      curData: null,
      editState: false,
      items: [],
      columns: [
        {
          dataIndex: 'id',
          title: '标识符',
          formatter(text, record) {
            return text + ( record.name ? ` (${ record.name })` : '' );
          },
        },
        {
          dataIndex: 'type',
          title: '类型',
          width: 60,
          formatter(text) {
            return typeNameMap[text];
          },
        },
      ],
    };
  },

  watch: {
    vucAst: {
      immediate: true,
      handler(vucAst) {
        this.items = vucAst.datas;
      },
    },
  },

  computed: {
    defaultExpandedRowKeys() {
      let keys = [];
      toPath(this.value).forEach(t => {
        let l = last(keys);
        if (l === undefined) {
          keys.push(t);
        } else if (/^\d+$/.test(t)) {
          keys.push(l + `[${ t }]`);
        } else {
          keys.push(l + '.' + t);
        }
      });
      keys.pop();
      return keys;
    },
  },

  methods: {
    doEdit(data) {
      this.editData = {};
      if (data) {
        this.editData = {
          id: data.id,
          name: data.name,
          path: data.path,
          code: data.code,
        };
      }
      this.curData = Object.assign({}, this.editData);
      this.editState = true;
    },

    doSave() {
      if (!this.curData.id) return;
      this.vucAst.saveData(this.curData, this.editData.id);
      getFormExtras().forEach(extra => {
        if (extra.onSave) {
          extra.onSave(this.curData, this.editData, this.vucAst);
        }
      });
      this.editState = false;
    },

    doDel(data) {
      this.vucAst.delData(data.path);
    },
  },

};

</script>

<template>
  <Modal title="选择变量" :visible="showModal" :bodyStyle="{ padding : '0 5px' }" width="400px" @ok="save"
         @cancel="cancel"
         :afterClose="afterClose"
         :maskClosable="false">

<!--    <Tabs :tabBarStyle="{ margin: 0 }">
      <TabPane tab="变量" key="data">-->
        <DataPanel v-model:value="val" mode="input"></DataPanel>
<!--      </TabPane>
      <TabPane tab="计算属性" key="computed">
        <ComputedPanel></ComputedPanel>
      </TabPane>
      <TabPane tab="方法" key="methods">
        <MethodPanel></MethodPanel>
      </TabPane>
    </Tabs>-->

  </Modal>
</template>

<script>
import { Modal, Tabs, TabPane } from 'ant-design-vue';

import DataPanel from '@/modes/data/DataPanel';
import ComputedPanel from '@/modes/computed/ComputedPanel';
import MethodPanel from '@/modes/methods/MethodPanel';

import modelValue from '@/mixins/modelValue';

export default {
  emits: ['update:value', 'update:visible'],
  mixins: [modelValue({ mode: 'watch', emitUpdate: false })],
  components: {
    DataPanel, ComputedPanel, MethodPanel, Modal, Tabs, TabPane,
  },
  props: {
    vucAst: Object,
    visible: Boolean,
  },
  data() {
    return {
      showModal: this.visible,
    };
  },
  watch: {
    visible(visible) {
      this.showModal = visible;
    },
  },
  computed: {
    treeData() {
      return this.vucAst.datas;
    },
    requests() {
      return this.vucAst.requests;
    },
  },
  methods: {
    afterClose() {
      this.$emit('update:visible', false);
    },
    cancel() {
      this.showModal = false;
    },
    save() {
      this.showModal = false;
      this.emitUpdate();
    },
  },
};
</script>

<style lang="less">
.vuc-var-tree {
  font: 14px / normal Consolas, "Courier New", monospace !important;

  li {
    padding: 1px !important;
  }
}
</style>

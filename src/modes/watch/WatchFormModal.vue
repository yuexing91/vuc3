<template>
  <Button @click="openWatchForm">编辑</Button>
  <Modal title="监听" v-model:visible="visible" width="800px" @ok="save" destroyOnClose>
    <WatchForm :vuc-ast="vucAst" :data="watchData" idReadOnly></WatchForm>
  </Modal>
</template>
<script>
import { Modal, Button, message } from 'ant-design-vue';
import WatchForm from './WatchForm';

export default {
  components: {
    Modal, Button, WatchForm,
  },
  props: {
    data: Object,
    vucAst: Object,
  },
  data() {
    return {
      visible: false,
      watchData: { id: undefined, params: [] },
    };
  },
  methods: {
    openWatchForm() {
      let watchId = this.data.path || this.data.id;
      if (!watchId) {
        message.error('请先填写正确标识');
        return;
      }

      let watchData = this.vucAst.watchs.find(watch => watch.id === watchId);
      if (watchData) {
        this.watchData = Object.assign({}, watchData);
      } else {
        this.watchData.id = watchId;
      }
      this.visible = true;
    },
    save() {
      this.data.watchData = this.watchData;
      this.visible = false;
    },
  },
};
</script>

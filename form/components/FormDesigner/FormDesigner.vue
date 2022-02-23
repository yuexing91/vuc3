<template lang="html">
  <ConfigProvider :locale="zhCN">
    <SampleDesigner style="height: 100%;"
                    :editorOptions="editorOptions"
                    :explorerComponents="formComponents"
                    :vue-content="vueContent">

      <template #right="{ vucAst, selectNode }">
        <SampleNodePanel title="组件选项" :vucAst="vucAst" :selectNode="selectNode"></SampleNodePanel>
        <SampleOptionPanel title="页面选项"></SampleOptionPanel>
      </template>
    </SampleDesigner>
  </ConfigProvider>
</template>

<script type="text/ecmascript-6">
import { ConfigProvider } from 'ant-design-vue';
import '../../style/ant-designer.less';

import { message } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

import { SampleNodePanel, SampleOptionPanel, SampleDesigner } from '@';
import { vueContent } from './template';
import ExplorerComponents from './explorerComponents';

export default {
  components: { SampleNodePanel, SampleOptionPanel, SampleDesigner, ConfigProvider },
  data() {
    return {
      zhCN,
      editorOptions: {
        wrapperStyle: {
          padding: '15px',
          background: '#f7f7f7',
        },
        beforeSelectNode(node) {
          return !node.isText();
        },
      },
      vueContent: vueContent,
      formComponents: ExplorerComponents,
    };
  },
};
</script>
<style lang="less">
.vuc-panel-view {
  .vuc-code-table {
    margin: -12px;
  }

  .ant-card-head {
    background: #edf6ff;
  }

  .ant-card-bordered {
    border-width: 0 0 1px 0;
  }
}
</style>

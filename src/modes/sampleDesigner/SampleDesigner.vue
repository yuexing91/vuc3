<script type="jsx">

import { Button, message, Modal, Space } from 'ant-design-vue';
import { createVucAst } from '@/runtime';
import { Designer, Editor } from '@/core';
import ExplorerView from '../explorer';
import SfcEditor from '../sfcEditor';

import SampleNodePanel from './SampleNodePanel';
import SampleOptionPanel from './SampleOptionPanel';

export default {
  components: {
    Designer,
    Editor,
    ExplorerView,
    SfcEditor,
    SampleNodePanel,
    SampleOptionPanel,
  },
  props: {
    editorOptions: Object,
    vueContent: String,
    explorerComponents: Array,
  },
  data() {
    return {
      vucAst: null,
      selectNode: null,
      configNode: null,
      showSfcEditor: false,
      sfcCode: null,
    };
  },
  watch: {
    vueContent: {
      handler(vueContent) {
        this.vucAst = createVucAst(vueContent);
      },
      immediate: true,
    },
  },
  methods: {
    changeCurrentNode(vucNode) {
      this.selectNode = vucNode;
    },
    editSfcCode() {
      let content = this.vucAst.getContent();
      this.showSfcEditor = true;
      this.sfcCode = content;
    },
    saveSfcCode() {
      this.vucAst = createVucAst(this.sfcCode);
      this.showSfcEditor = false;
    },
    importVue() {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = function () {
        let reader = new FileReader();
        reader.onload = () => {
          this.vucAst = createVucAst(reader.result);
          message.success('导入成功');
        };
        reader.readAsText(this.files[0]);
      };
      input.click();
    },

    repeatNode() {
      message.success('导入成功');
      let editor = this.$refs.editor;
      if (editor.currentNode) {
        editor.repeatNode(editor.currentNode);
      }
    },

    delSelect() {
      let editor = this.$refs.editor;
      if (editor.currentNode) {
        editor.removeNode(editor.currentNode);
      }
    },

    moveToBefore() {
      let editor = this.$refs.editor;
      if (editor.currentNode) {
        editor.moveToBefore(editor.currentNode);
      }
    },

    moveToAfter() {
      let editor = this.$refs.editor;
      if (editor.currentNode) {
        editor.moveToAfter(editor.currentNode);
      }
    },

    selectParent() {
      let editor = this.$refs.editor;
      let p = editor.currentNode?.getParentNode();
      if (p) {
        editor.selectVucNode(p);
      }
    },

    forceUpdateVuc() {
      this.$refs.editor.forceUpdateVuc();
    },

    reloadVuc(){
      this.$refs.editor.reloadVuc();
    }

  },
  render() {

    let slots = {
      left: () => {
        if (this.$slots.left) {
          return this.$slots.left({ vucAst: this.vucAst, selectNode: this.selectNode });
        }
        return <ExplorerView title="组件" components={ this.explorerComponents }/>;
      },
      right: () => {
        if (this.$slots.right) {
          return this.$slots.right({ vucAst: this.vucAst, selectNode: this.selectNode });
        }
        return [
          <SampleNodePanel title="组件选项" vucAst={ this.vucAst } selectNode={ this.selectNode }></SampleNodePanel>,
          <SampleOptionPanel title="页面选项"></SampleOptionPanel>,
        ];
      },
    };

    let btns = [
      {
        text: '导入',
        handler: this.importVue,
      },
      {
        text: '前移',
        handler: this.moveToBefore,
      },
      {
        text: '后移',
        handler: this.moveToAfter,
      },
      {
        text: '重复',
        handler: this.repeatNode,
      },
      {
        text: '删除',
        handler: this.delSelect,
      },
      {
        text: '选中父组件',
        handler: this.selectParent,
      },
      {
        text: '编辑源码',
        handler: this.editSfcCode,
      },
      {
        text: '刷新',
        handler: this.forceUpdateVuc,
      },
      /*{
        text: '重载',
        handler: this.reloadVuc,
      },*/
    ];

    let toolbar = btns.map(btn => <Button type="text" onClick={ btn.handler }>{ btn.text }</Button>);

    if (this.$slots.toolbar) {
      toolbar = this.$slots.toolbar({ vucAst: this.vucAst, selectNode: this.selectNode });
    }

    return <div class="vuc-sample-designer">
      <div class="vuc-sample-designer-toolbar">
        <Space>
          { toolbar }
        </Space>
      </div>

      <Designer ref="designer" style="height: calc(100% - 37px)" v-slots={ slots }>
        <Editor ref="editor" onSelectNode={ this.changeCurrentNode } vucAst={ this.vucAst }
                options={ this.editorOptions }/>
      </Designer>

      <Modal v-model={ [this.showSfcEditor, 'visible'] } title="源代码" width="100%" onOk={ this.saveSfcCode }>
        <SfcEditor v-model={ [this.sfcCode, 'value'] } height="600px"></SfcEditor>
      </Modal>
    </div>;
  },
};
</script>

<style lang="less">
.vuc-sample-designer {
  &-toolbar {
    border-bottom: 1px solid #dcdee2;
    padding: 2px 0;
  }

  &-combo-drowdown {
    position: absolute;
    right: 10px;
    top: 9px;
    z-index: 1;
  }
}
</style>

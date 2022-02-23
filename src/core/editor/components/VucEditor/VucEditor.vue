<template>
  <div class="vuc-editor" tabIndex="9999">
    <div class="vuc-editor-content">
      <div class="vuc-ceditor">
        <div class="vuc-ceditor-panle vuc-ceditor-panle-top" v-if="showRuler">
          <div class="vuc-ceditor-empty"/>
          <VucEditorRuler :style="{ marginLeft: -scrollLeft + 'px' }" :size="200" :scale="10" direction="row"/>
        </div>

        <div class="vuc-ceditor-panle vuc-ceditor-panle-bottom">
          <VucEditorRuler
              v-if="showRuler"
              :style="{ marginTop: -scrollTop + 'px' }"
              :size="200"
              :scale="10"
              direction="column"
          />
          <div class="vuc-ceditor-cpanle">
            <div class="vuc-app-wrapper" @scroll="scroll" :style="options.wrapperStyle"></div>
          </div>
          <VucEditorNodeSelectedLayer ref="selectedLayer"/>
          <VucEditorNodeHoverLayer ref="hoverLayer"/>
          <VucEditorNodeTools ref="nodeTools"/>
        </div>
      </div>

      <template v-if="showStructure">
        <div
            class="vuc-panle-resize-handler"
            @mousedown.stop.prevent="resizeRight"
            :style="{ right: rightPanleWidth + 'px' }"
        ></div>
        <structure-editor style="flex-shrink: 0" :style="{ width: rightPanleWidth + 'px' }"></structure-editor>
      </template>
    </div>

    <VucEditorNodeNav/>

    <teleport to="body">
      <context-menu
          ref="ctxmenu"
          class="vuc-editor-menu"
          v-model:show="menuState"
          :items="contenxtMenuItems"
          :style="contextMenuStyle"
          @click-item="handleMenu"
      />
    </teleport>
  </div>
</template>

<script>
import { getVucEditorHook } from '@/core/config';
import { ContextMenu } from '@/ui';

import eventsMixin from './events';
import keymapMixin from './keymap';

import VucEditorRuler from './VucEditorRuler.vue';
import VucEditorNodeNav from './VucEditorNodeNav.vue';
import VucEditorNodeSelectedLayer from './VucEditorNodeSelectedLayer.vue';
import VucEditorNodeHoverLayer from './VucEditorNodeHoverLayer.vue';
import VucEditorNodeTools from './VucEditorNodeTools.vue';
import StructureEditor from '../StructureEditor';

import { createMenus } from '../../contextMenus';

import vucNodeApi from './vucNodeApi';

export default {
  emits: ['select-node'],

  inject: ['$designer'],

  components: {
    VucEditorRuler,
    VucEditorNodeNav,
    VucEditorNodeTools,
    VucEditorNodeSelectedLayer,
    VucEditorNodeHoverLayer,
    StructureEditor,
    ContextMenu,
  },

  mixins: [eventsMixin, keymapMixin, vucNodeApi],

  props: {
    vucAst: Object,
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      scrollLeft: 0,
      scrollTop: 0,
      menuState: false,
      contextMenuStyle: {},
      currentNode: null,
      hoverVucNode: null,
      rightPanleWidth: 300,
      rootNode: null,
      contenxtMenuItems: [],
    };
  },

  computed: {
    showRuler() {
      return this.options.showRuler === undefined ? true : this.options.showRuler;
    },

    showStructure() {
      return this.options.showStructure;
    },
  },

  created() {
    this.$designer.editor = this;
  },

  mounted() {
    this.loadVuc();
  },

  watch: {
    vucAst(vucAst, oldVucAst) {
      oldVucAst?.unmount();
      this.loadVuc();
    },

    currentNode(node) {
      this.$emit('select-node', node);
    },

    rootNode: {
      handler(rootNode) {
        getVucEditorHook('onNodeTreeChange').forEach((fn) => {
          fn(rootNode);
        });
      },
      deep: true,
    },
  },

  methods: {
    scroll() {
      this.scrollTop = this.$el.querySelector('.vuc-app-wrapper').scrollTop;
      this.scrollLeft = this.$el.querySelector('.vuc-app-wrapper').scrollLeft;
    },

    selectVucNode(vucNode, el) {
      this.currentNode = vucNode;
      this.currentSelectElement = el;
    },

    clearSelected() {
      this.currentNode = null;
    },

    showMenu(event) {
      let top = event.pageY;
      let left = event.pageX;
      this.menuState = true;
      this.contextMenuStyle = {
        top: top + 'px',
        left: left + 'px',
      };

      this.contenxtMenuItems = createMenus(this);

//      this.$nextTick(() => {
//        let { bottom, right } = this.$refs.ctxmenu.$el.getBoundingClientRect();
//        let t1, t2;
//        if (( t1 = bottom - rect.bottom ) > 0) {
//          this.contextMenuStyle.top = top - t1 + 'px';
//        }
//        if (( t2 = right - rect.right ) > 0) {
//          this.contextMenuStyle.left = left - t2 + 'px';
//        }
//      });
    },

    handleMenu(item) {
      let node = this.currentNode;
      item.handler(node, this);
    },

    getVucNode(astId) {
      return this.vucAst.getVucNodeByAstId(astId);
    },

    getVucNodeElement(vucNode) {
      return document.querySelector(`[data-ast-id="${ vucNode._astId }"]`);
    },

    resizeRight(e) {
      let x = e.pageX;

      let rightPanleWidth = this.rightPanleWidth;

      let move = (e) => {
        let w = rightPanleWidth - ( e.pageX - x );
        if (w > 1000) w = 1000;
        if (w < 200) w = 200;

        this.rightPanleWidth = w;
      };

      let up = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    },

    updateLayerPos() {
      this.$nextTick(() => {
        this.$refs.selectedLayer.updatePos();
        this.$refs.hoverLayer.updatePos();
        this.$refs.nodeTools.updatePos();
      });
    },

    reloadVuc() {
      if (this.vucAst) {
        this.vucAst.unmount()
        this.loadVuc();
      }
    },

    loadVuc() {
      if (this.vucAst) {
        this.vucAst.createVucProxyApp();
        this.rootNode = this.vucAst.rootNode;
        this.mountVuc();
      }
    },

    mountVuc() {
      let el = this.$el.querySelector('.vuc-app-wrapper');
      this.vucAst.mount(el);
    },

    forceUpdateVuc() {
      this.vucAst.forceUpdate();
    },

  },
};
</script>

<style>
.vuc-app-wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>

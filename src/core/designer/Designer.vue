<template>
  <div class="vuc-designer vuc-flex-column">
    <div class="vuc-panles vuc-flex-mainitem vuc-flex">
      <designer-views class="vuc-flex-column" :style="leftViewStyle" name="left" />

      <div style="width: 100px" class="vuc-flex-mainitem">
        <slot></slot>
      </div>

      <designer-views class="vuc-flex-column" :style="rightViewStyle" name="right" />
    </div>

    <div
      class="vuc-panle-resize-handler"
      @mousedown.stop.prevent="resizeRight"
      :style="{ right: rightViewWidth + 'px' }"
    />
  </div>
</template>

<script type="text/ecmascript-6">

import DesignerViews from './DesignerViews';
import VucEditor from '../editor';

export default {
  name: 'VucDesigner',

  components: {
    DesignerViews,
    VucEditor,
  },

  provide() {
    return {
      $designer: this,
    };
  },

  computed: {
    leftViewStyle() {
      return {
        width: '250px',
        borderRightWidth: '1px',
      };
    },
    rightViewStyle() {
      return {
        width: this.rightViewWidth + 'px',
        borderLeftWidth: '1px',
      };
    },
  },

  data() {
    return {
      rightViewWidth: 300,
    };
  },

  methods: {
    resizeRight(e) {
      const x = e.pageX;

      const rightViewWidth = this.rightViewWidth;

      const move = (e) => {
        let w = rightViewWidth - ( e.pageX - x );
        if (w > 1000) w = 1000;
        if (w < 300) w = 300;

        this.rightViewWidth = w;
      };

      const up = (e) => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    },
  },
};

</script>

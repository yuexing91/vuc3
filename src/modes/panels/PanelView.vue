<template>
  <div class="vuc-panel-view">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="less">
.vuc-panel-view {
  height: 100%;
  overflow: auto;
  position: relative;
}
</style>

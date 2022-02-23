<template>
  <div class="vuc-item">
    <div class="vuc-item-header">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="vuc-item-body">
      <slot></slot>
    </div>
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
.vuc-item {
  &-header {
    line-height: 34px;
  }

  &-body {
  }

  padding-bottom: 8px;
}
</style>

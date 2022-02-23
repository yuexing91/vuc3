<template>
  <Card :hoverable="false" size="small">
    <template #title>
      <MenuUnfoldOutlined/>
      {{ title }}
    </template>
    <template #extra>
      <slot name="extra"></slot>
    </template>
    <slot></slot>
  </Card>
</template>

<script>
import { Card } from 'ant-design-vue';
import MenuUnfoldOutlined from '@ant-design/icons-vue/MenuUnfoldOutlined';

export default {
  name: 'VucCard',
  components: {
    MenuUnfoldOutlined, Card,
  },
  props: {
    title: String,
  },
};
</script>

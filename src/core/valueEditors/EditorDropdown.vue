<template>
  <Dropdown :trigger="['click']">
        <span v-bind="$attrs">
          {{ title }}
          <DownOutlined/>
        </span>
    <template #overlay>
      <Menu>
        <MenuItem
            v-for="editor in editors"
            @click="selectEditor(editor)"
            :class="{ 'item-selected': editorId == editor.id }"
            :key="editor.id"
        >
          {{ editor.name }}
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>

<script>
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';

export default {
  name: 'EditorDropdown',
  emits: ['update:editorId'],
  components: {
    DownOutlined,Dropdown, Menu, MenuItem
  },
  props: {
    editors: Array,
    editorId: String,
    title: String,
  },
  methods: {
    selectEditor(editor) {
      this.$emit('update:editorId', editor.id);
    },
  },
};
</script>


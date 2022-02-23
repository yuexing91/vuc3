<template>
  <Dropdown trigger="click">
    <span class="vuc-combo-drowdown" v-bind="$attrs">更多选项 <DownOutlined/></span>
    <template #overlay>
      <Menu>
        <MenuItem
            v-for="item in nodeList"
            :class="{ 'item-selected': value == item.node }"
            @click="selectNode(item.node)"
            :key="item.key"
        >
          {{ item.name || item.key }}
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>

<script>
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';

export default {
  inheritAttrs: false,
  name: 'ComboDrowdown',
  emits: ['update:value'],
  props: {
    combo: Object,
    value: Object,
  },
  components: {
    DownOutlined, Dropdown, Menu, MenuItem,
  },
  computed: {
    nodeList() {
      let list = [
        {
          key: '_combo',
          node: null,
          name: '组合选项',
        },
      ];
      for(let key in this.combo.nodeMap) {
        let node = this.combo.nodeMap[key];
        list.push({
          key,
          node,
          name: node.getConfig('name'),
        });
      }
      return list;
    },
  },
  methods: {
    selectNode(node) {
      this.$emit('update:value', node);
    },
  },
};
</script>

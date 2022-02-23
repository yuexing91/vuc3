<template>
  <div class="vucant-iconeditor">
    <Input v-model:value="val" v-readonly @click="openModal" allowClear>
      <template #addonBefore>
        <component :is="val" v-if="val"></component>
        <span v-else>无</span>
      </template>
    </Input>

    <Modal title="图标选择" v-model:visible="showModal" width="80%" @ok="saveData" :mask-closable="false">
      <Radio-group v-model:value="style">
        <Radio-button value="line">线框风格</Radio-button>
        <Radio-button value="fill">实底风格</Radio-button>
        <Radio-button value="two">双色风格</Radio-button>
      </Radio-group>

      <Input-search v-model:value="searchValue" class="vucant-icon-search" @search="onSearch"/>

      <div style="height: calc(100vh - 400px); overflow: auto">
        <div v-for="type in types" :key="type.value">
          <h3 style="margin: 1.6em 0px 0.6em">{{ type.label }}</h3>
          <ul class="vucant-iconlist">
            <li
                v-for="item in getIcons(type.value)"
                @click="selectIcon(item)"
                :class="item === icon ? 'vucant-icon-selected' : ''"
            >
              <component :is="item" style="font-size: 60px"></component>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { RadioGroup, RadioButton, Input, InputNumber, InputSearch } from 'ant-design-vue';
import { ICONS, camelize } from './icons';

export default {
  emits: ['update:value'],

  props: {
    value: String,
  },

  directives: {
    readonly(el) {
      el.querySelector('input').addEventListener('focus', function () {
        this.blur();
      });
    },
  },

  data() {
    return {
      val: '',
      icon: '',
      showModal: false,
      style: 'line',
      types: [
        {
          label: '方向性图标',
          value: 'direction',
        },
        {
          label: '提示建议性图标',
          value: 'tips',
        },
        {
          label: '编辑类图标',
          value: 'edit',
        },
        {
          label: '数据类图标',
          value: 'data',
        },
        {
          label: '网站通用图标',
          value: 'web',
        },
      ],
      filterValue: '',
      searchValue: '',
    };
  },

  watch: {
    value: {
      handler() {
        this.val = this.icon = camelize(this.value);
      },
      immediate: true,
    },
    val() {
      this.$emit('update:value', this.val);
    },
  },

  methods: {
    openModal() {
      this.showModal = true;
    },

    getIcons(type) {
      return ICONS[this.style][type].filter(
          (icon) => icon.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1,
      );
    },

    onSearch() {
      this.filterValue = this.searchValue;
    },

    selectIcon(icon) {
      this.icon = icon;
    },

    saveData() {
      this.val = this.icon;
      this.showModal = false;
    },
  },
};
</script>

<style lang="less">
.vucant-iconlist {
  margin: 10px 0;
  overflow: hidden;
  direction: ltr;
  list-style: none;
  padding: 0;

  li.vucant-icon-selected {
    color: #fff;
    background-color: #1890ff;
  }

  li {
    position: relative;
    float: left;
    width: 16.6666%;
    height: 100px;
    margin: 3px 0;
    padding: 10px 0 0;
    overflow: hidden;
    color: #555;
    text-align: center;
    list-style: none;
    background-color: inherit;
    border-radius: 4px;
    cursor: pointer;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;

    &:hover {
      color: #fff;
      background-color: #1890ff;
      opacity: 0.8;
    }

    span {
      display: block;
      font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      white-space: nowrap;
      text-align: center;
      transform: scale(0.83);
    }
  }
}

.vucant-icon-search {
  width: 200px;
  margin-left: 30px;
}
</style>

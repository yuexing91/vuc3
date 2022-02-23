<template>
  <Table
      :data-source="data"
      :row-key="rowKey"
      :rowClassName="rowClassName"
      :pagination="false"
      :transformCellText="transformCellText"
      :customRow="customRow"
      :defaultExpandedRowKeys="defaultExpandedRowKeys"
      size="small"
      class="vuc-code-table"
  >
    <TableColumn v-for="col in columns" v-bind="col" ellipsis/>
    <TableColumn width="55px" align="center">
      <template #title>
        <PlusOutlined #icon @click="addItem"/>
      </template>
      <template #default="{ record }">
        <EditOutlined @click.stop="clickItem(record)"/>
        <DeleteOutlined @click.stop="delItem(record)"/>
      </template>
    </TableColumn>
  </Table>
</template>

<script>
import { Table, TableColumn } from 'ant-design-vue';
import { reactive, ref, toRefs, watch } from 'vue';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';

export default {
  components: {
    PlusOutlined, DeleteOutlined, EditOutlined, Table, TableColumn,
  },
  emits: ['click-item', 'delete-item', 'add-item', 'update:value'],
  props: {
    columns: {
      type: Array,
      default() {
        return [
          {
            dataIndex: 'id',
            title: '标识符',
            code: true,
            width: 150,
          },
          {
            dataIndex: 'name',
            title: '名称',
          },
        ];
      },
    },
    data: Array,
    rowKey: {
      type: String,
      default: 'id',
    },
    mode: String,
    value: String,
    defaultExpandedRowKeys: Array,
  },

  setup(props, context) {
    const { value, mode, rowKey } = toRefs(props);

    if (mode.value != 'input') {
      return {
        customRow: null,
        expandedRowKeys: null,
      };
    }

    const selectKey = ref(null);

    const customRow = (record) => {
      return {
        onClick: () => {
          selectRow(record[rowKey.value]);
        },
      };
    };

    const selectRow = (key) => {
      if (key === selectKey.value) {
        selectKey.value = null;
      } else {
        selectKey.value = key;
      }
      context.emit('update:value', selectKey.value);
    };

    watch(value, (val) => {
      selectKey.value = val;
    }, { immediate: true });

    const rowClassName = (record, index) => {
      let clss = [];
      if (index % 2 === 1) clss.push('vuc-table-row-striped');
      if (record[rowKey.value] === selectKey.value) clss.push('vuc-table-row-selected');

      return clss;
    };

    return {
      selectKey,
      customRow,
      rowClassName,
    };
  },

  methods: {
    addItem() {
      this.$emit('add-item');
    },
    clickItem(item) {
      this.$emit('click-item', item);
    },
    delItem(item) {
      this.$emit('delete-item', item);
    },
    transformCellText({ text, column, record }) {
      if (column.formatter) {
        return column.formatter(text, record);
      }
      return text;
    },
  },
};
</script>

<style lang="less">
.vuc-code-table {
  font: 14px / normal Consolas, "Courier New";

  .ant-table-body {
    overflow: auto !important;
  }

  .ant-table-placeholder {
    padding: 9px;

    .ant-empty-normal {
      margin: 0;

      .ant-empty-image {
        display: none;
      }
    }
  }

  table {
    border: none !important;
  }

  .ant-table-row {
    .anticon {
      display: none;
      margin-right: 3px;
    }
  }

  .ant-table-row:hover {
    .anticon {
      display: inline-block !important;
    }
  }
}
</style>

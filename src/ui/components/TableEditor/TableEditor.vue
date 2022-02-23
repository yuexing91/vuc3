<script lang="jsx">
import { message, Table, TableColumn, Space, Button, Input, InputNumber, Checkbox } from 'ant-design-vue';
import { toRefs } from 'vue';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import ExpandAltOutlined from '@ant-design/icons-vue/ExpandAltOutlined';

import CodeEditor from '../CodeEditor';

import { moveArrayItem } from '@/helpers/lang';

export default {
  components: { CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CloseOutlined, ExpandAltOutlined },
  emits: ['change', 'update:value'],
  props: {
    isTreeData: Boolean,
    bordered: Boolean,
    block: Boolean,
    rowKey: String,
    columns: Array,
    size: String,
    value: Array,
    buttonText: {
      type: String,
      default: '添加',
    },
  },
  data() {
    return {
      selectedRowKeys: [],
      curEditRecord: null,
      editData: {},
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val == null) {
          this.$emit('update:value', toRefs([]));
        }
      },
    },
  },
  methods: {
    addItem(parent) {
      if (this.curEditRecord !== null && this.saveItem(this.curEditRecord) === false) {
        return;
      }
      let templateRecord = {};
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(templateRecord);
      } else {
        this.value.push(templateRecord);
      }
      this.changeEditItem(templateRecord);
      this.isAddNew = true;
    },

    changeEditItem(record) {
      this.curEditRecord = record;
      this.editData = Object.assign({}, record);
      this.isAddNew = false;
    },

    saveItem(record) {
      let msgArray = [];

      this.columns.forEach(col => {
        let msg;
        if (col.validate && ( msg = col.validate(this.editData[col.field]) )) {
          msgArray.push(msg);
        }
      });

      let key = this.editData[this.rowKey];
      if (this.eachAllRows(item => item !== this.curEditRecord && item[this.rowKey] === key)) {
        msgArray.push('主键不能重复');
      }

      if (msgArray.length) {
        msgArray.forEach(msg => message.error(msg));
        return false;
      }

      Object.assign(record, this.editData);

//      this.value.splice(index, 1, this.editData);
      this.$emit('change');
      this.curEditRecord = null;
    },

    cancelItem() {
      if (this.isAddNew) {
        this.deleteEditItem(this.curEditRecord);
      }
      this.curEditRecord = null;
    },

    deleteEditItem(record) {
      let { parent, index } = this.findRecord(record);
      parent.children.splice(index, 1);
      this.$emit('change');
    },

    eachAllRows(itee) {
      let fn = (array) => {
        return array.some(item => {
          if (itee(item)) return true;
          return fn(item.children || []);
        });
      };
      return fn(this.value);
    },

    findRecord(record) {
      let fn = (parent) => {
        for(let index = 0; index < parent.children.length; index++) {
          let r = parent.children[index];
          if (r == record) {
            return { parent, index, paths: [parent] };
          }
          if (r.children) {
            let v = fn(r);
            if (v) {
              v.paths.push(r);
              return v;
            }
          }
        }
      };
      return fn({
        children: this.value,
      });
    },

    getColumns() {
      return this.columns.map((column, colIndex) => {
        let slots = {
          default: (arg) => {
            let { text, record } = arg;
            let editor = column.editor;
            if (typeof editor == 'function') {
              editor = editor.call(this, this.editData);
            }

            if (record === this.curEditRecord) {
              let valueName = 'value';

              let inputComp = <Input/>;
              let value = this.editData[column.field];

              if (editor == 'select') {
                inputComp = <Select/>;
              }

              if (editor == 'number') {
                inputComp = <InputNumber/>;
                value = parseFloat(value);
                value = isNaN(value) ? 0 : value;
              }

              if (editor == 'expr') {
                inputComp = <CodeEditor inline={ true }/>;
                value = value + '';
              }

              if (editor == 'boolean') {
                inputComp = <Checkbox/>;
                valueName = 'checked';
                value = !!value;
              }

              if (typeof editor == 'object') {
                inputComp = editor;
              }

              this.editData[column.field] = value;

              let vModel = {
                [valueName]: this.editData[column.field],
                [`onUpdate:${ valueName }`]: ($event) => this.editData[column.field] = $event,
              };

              let style = '';
              if (this.isTreeData && colIndex === 0) {
                style = 'width:auto';
              }

              return <inputComp { ...column.editorProps } { ...vModel } style={ style }/>;
            } else {
              let v = text;
              if (column.formatter) {
                v = column.formatter(text);
              }

              if (editor == 'select') {
                let item = column.editorProps?.options.find(item => item.value == text);
                if (item) v = item.label;
              } else if (editor == 'boolean') {
                v = text ? '是' : '否';
              }

              return v;
            }
          },
        };

        return <TableColumn title={ column.title }
                            width={ column.width }
                            dataIndex={ column.field }
                            ellipsis
                            key={ column.field }
                            v-slots={ slots }/>;
      });
    },

    getActionColumn() {
      let actionSlot = {
        default: ({ record }) => {
          if (record === this.curEditRecord) {
            return <Space>
              <CheckOutlined onClick={ () => this.saveItem(record) }></CheckOutlined>
              <CloseOutlined onClick={ () => this.cancelItem(record) }></CloseOutlined>
            </Space>;
          }
          return <Space>
            { this.isTreeData ? <PlusOutlined onClick={ () => this.addItem(record) }></PlusOutlined> : null }
            <EditOutlined onClick={ () => this.changeEditItem(record) }></EditOutlined>
            <DeleteOutlined onClick={ () => this.deleteEditItem(record) }></DeleteOutlined>
          </Space>;
        },
      };

      return <TableColumn title="操作" align="center" width={ this.isTreeData ? 70 : 50 } v-slots={ actionSlot }/>;
    },


  },
  render() {
    let gap = 10;
    let curDropRecord = null;
    let cursor = null;

    let canDrop = (record) => {
      if (curDropRecord === null || curDropRecord === record) return;
      let recordPath = this.findRecord(record);
      if (recordPath.paths.includes(curDropRecord)) return;
      return recordPath;
    };

    let getPos = (ev) => {
      let rect = ev.currentTarget.getBoundingClientRect();
      if (this.isTreeData && ev.offsetY > gap && ( ev.offsetY < rect.height - gap )) {
        return 0;
      }
      return ev.offsetY > rect.height / 2 ? 1 : -1;
    };

    let customRow = (record) => {
      return {
        draggable: 'true',
        onDragstart: () => {
          cursor = document.createElement('div');
          cursor.className = 'vuc-table-editor-drop-cursor';

          const dragover = () => {
            cursor.style.display = 'none';
          };

          const drop = () => {
            curDropRecord = null;
            document.body.removeChild(cursor);
            window.removeEventListener('dragover', dragover);
            window.removeEventListener('drop', drop);
          };

          window.addEventListener('dragover', dragover);
          window.addEventListener('drop', drop);

          curDropRecord = record;
          document.body.appendChild(cursor);
        },
        onDragover: (ev) => {
          if (canDrop(record)) {
            let pos = getPos(ev);
            let rect = ev.currentTarget.getBoundingClientRect();

            Object.assign(cursor.style, {
              display: 'block',
              height: pos === 0 ? ( rect.height + 'px' ) : '1px',
              width: rect.width + 'px',
              left: rect.left + 'px',
              top: ( pos == 1 ? rect.bottom : rect.top ) + 'px',
            });

            ev.preventDefault();
            ev.stopPropagation();
          }
        },
        onDrop: (ev) => {
          let recordInfo = canDrop(record);
          if (recordInfo) {
            this.deleteEditItem(curDropRecord);
            let pos = getPos(ev);
            if (pos == 0) {
              record.children = record.children || [];
              record.children.push(curDropRecord);
            } else {
              let { parent } = recordInfo;
              let index = parent.children.indexOf(record);
              parent.children.splice(pos == 1 ? index + 1 : index, 0, curDropRecord);
            }
            this.$emit('change');
          }
          ev.preventDefault();
        },
        onClick: () => {
          this.selectedRowKeys = record[this.rowKey];
        },
      };
    };

    const rowClassName = (record, index) => {
      let clss = [];
      if (record[this.rowKey] === this.selectedRowKeys) clss.push('vuc-table-row-selected');

      return clss;
    };

//    let dropSlots = {
//      default: ({ index }) => {
//        return <DragOutlined class="vuc-table-editor-drop"/>;
//      },
//    };
//
//    let dropColumn = <TableColumn width={ 30 } v-slots={ dropSlots }/>;

    let columns = [
//      dropColumn,
      ...this.getColumns(),
      this.getActionColumn(),
    ];

    let scroll = undefined;

    if (this.value.length > 8) {
      scroll = { y: 300 };
    }

    return <div class="vuc-table-editor">
      <Table bordered={ this.bordered }
             dataSource={ this.value }
             size={ this.size }
             pagination={ false }
             rowClassName={ rowClassName }
             scroll={ scroll }
             rowKey={ this.rowKey }
             customRow={ customRow }>
        { columns }
      </Table>
      <Button type="dashed" block={ this.block } onClick={ () => this.addItem() } size={ this.size }
              style="margin-top: 8px"
              v-slots={ { icon: () => <PlusOutlined/> } }>
        { this.buttonText }
      </Button>
    </div>;
  },
};

</script>
<style lang="less">
.vuc-table-editor {
  font: 14px / normal Consolas, "Courier New";

  &-drop {
    cursor: move !important;
  }

  &-drop-cursor {
    position: absolute;
    height: 1px;
    background-color: #1890ff;
    display: none;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.5;
  }

  .ant-table-row {
    td {
      text-overflow: clip;
    }
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

}
</style>

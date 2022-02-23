import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import cloneDeep from 'lodash-es/cloneDeep';
import pick from 'lodash-es/pick';
import uuid from 'uuid';

const tableProps = {
  loading: Boolean,
  rowKey: String,
  dataSource: {
    type: Array,
    default() {
      return [];
    },
  },
  pagination: {
    type: [Object, Boolean],
    default() {
      return false;
    },
  },
  size: {
    type: String,
    default: 'middle',
  },
};

export default {
  name: 'AEditableTable',
  emits: ['change', 'save', 'delete', 'add'],
  props: {
    ...tableProps,
    bordered: Boolean,
    beforeDeleteRecord: Function,
    beforeSaveRecord: Function,
    editRecordMode: {
      type: [String, Function],
      default: 'copy',
    },
    recordCreator: {
      type: Object,
      default() {
        return {
          idStrategy: 'index',
          newRecordType: 'dataSource',
          record: undefined,
        };
      },
    },
    creatorButtonText: {
      type: String,
      default: '新增',
    },
    scrollX: {
      type: Number,
    },
  },
  data() {
    return {
      editableMap: {},
      tableDataSource: this.dataSource,
      tempRecordMap: {},
    };
  },

  created() {
    if (this.recordCreator.newRecordType !== 'dataSource') {
      this.tableDataSource = [].concat(this.dataSource);
    }
  },

  methods: {
    updateDataSource() {
      if (this.recordCreator.newRecordType !== 'dataSource') {
        let nDataSource = this.tableDataSource.filter((r) => !this.tempRecordMap[r[this.rowKey]]);
        this.dataSource.splice(0, this.dataSource.length, ...nDataSource);
      }
    },

    getRecord(id) {
      let index = this.tableDataSource.findIndex((row) => row[this.rowKey] === id);
      let record = this.tableDataSource[index];
      return {
        index,
        record,
      };
    },

    startEditable(id) {
      let { record } = this.getRecord(id);
      if (typeof this.editRecordMode === 'function') {
        this.editableMap[id] = this.editRecordMode(record);
      } else if (this.editRecordMode === 'deep') {
        this.editableMap[id] = cloneDeep(record);
      } else {
        this.editableMap[id] = Object.assign({}, record);
      }
    },

    async saveRecord(id) {
      let { index, record } = this.getRecord(id);
      let newRecord = this.editableMap[id];
      if (this.beforeSaveRecord && this.beforeSaveRecord({ newRecord, index, record }) === false) {
        return;
      }

      try {
        await this.$refs.form.validate(this.dataIndexs.map(t => {
          return [id, t];
        }));

        this.tableDataSource.splice(index, 1, newRecord);
        delete this.editableMap[id];
        if (this.tempRecordMap[id]) {
          delete this.tempRecordMap[id];
          this.updateDataSource();
          this.$emit('add', record);
        } else {
          this.$emit('save', record);
        }
        this.$emit('change', record);

      } catch (e) {
        console.log(e);
      }
    },

    deleteRecord(id) {
      let { index, record } = this.getRecord(id);
      if (this.beforeDeleteRecord && this.beforeDeleteRecord({ index, record }) === false) {
        return;
      }

      this.tableDataSource.splice(index, 1);
      delete this.editableMap[id];

      if (this.tempRecordMap[id]) {
        delete this.tempRecordMap[id];
      } else {
        this.updateDataSource();
        this.$emit('delete', record);
        this.$emit('change', record);
      }
    },

    cancelEditable(id) {
      delete this.editableMap[id];
      if (this.tempRecordMap[id]) {
        let { index } = this.getRecord(id);
        this.tableDataSource.splice(index, 1);
        delete this.tempRecordMap[id];
      }
    },

    addRecord() {
      let newRecord;
      let { idStrategy, newRecordType, record } = this.recordCreator;
      if (typeof record === 'function') {
        newRecord = record();
      } else {
        newRecord = {};
        if (idStrategy === 'index') {
          newRecord[this.rowKey] = this.tableDataSource.length + 1;
        } else if (idStrategy === 'uuid') {
          newRecord[this.rowKey] = uuid();
        }
      }

      let id = newRecord[this.rowKey];
      this.tableDataSource.push(newRecord);
      this.startEditable(id);

      if (newRecordType !== 'dataSource') {
        this.tempRecordMap[id] = true;
      } else {
        this.$emit('add', newRecord);
        this.$emit('change', newRecord);
      }
      this.updateDataSource();
    },

    renderRowActions({ record }) {
      let id = record[this.rowKey];
      let actions = {
        edit: () => this.startEditable(id),
        del: () => this.deleteRecord(id),
        cancel: () => this.cancelEditable(id),
        save: () => this.saveRecord(id),
      };

      let doms = this.editableMap[id] ? (
          <>
            <a onClick={ actions.save }>保存</a> <a onClick={ actions.cancel }>取消</a>
          </>
      ) : (
          <>
            <a onClick={ actions.edit }>编辑</a>
            <a-popconfirm title="删除此行？" onConfirm={ actions.del }>
              <a> 删除</a>
            </a-popconfirm>
          </>
      );
      return doms;
    },

    renderColumns() {
      let px = 0;
      let dataIndexs = [];
      let columns = this.$slots.default().map((c) => {
        let slots = {
          title: c.children?.title,
        };
        let defaultSlot = c.children?.default;
        let textSlot = c.children?.text;
        let { valueType, width, dataIndex, rules } = c.props;

        dataIndexs.push(dataIndex);

        if (typeof width === 'number') {
          px += width;
        } else if (typeof width === 'string') {
          let m = width.match(/(\d+(\.?\d+)?)(.*)$/);
          if (m) {
            if (m[3] == 'px') {
              px += parseFloat(m[1]);
            }
          }
        }

        if (defaultSlot || valueType || textSlot) {
          slots.default = (args) => {
            let { record } = args;
            let id = record[this.rowKey];
            let editRecord = this.editableMap[id];
            args.editRecord = editRecord;
            if (valueType === 'actions') {
              return this.renderRowActions(args);
            }
            if (editRecord && defaultSlot) {
              let key = [id, dataIndex];
              return (
                  <a-form-item className="row-form-item" name={ key } rules={ rules }
                               style="margin: -5px 0;">
                    { defaultSlot.call(this, args) }
                  </a-form-item>
              );
            }

            if (textSlot) {
              return textSlot.call(this, args);
            }

            return args.text;
          };
        }
        return <a-table-column { ...c.props } v-slots={ slots }></a-table-column>;
      });

      this.dataIndexs = dataIndexs;

      return {
        px,
        columns,
      };
    },

    renderRecordCreatorButton() {
      if (!this.creatorButtonText) return;
      return (
          <a-button
              block
              type="dashed"
              style="margin:10px 0"
              onClick={ this.addRecord }
              v-slots={ { icon: () => <PlusOutlined/> } }
          >
            { this.creatorButtonText }
          </a-button>
      );
    },
  },

  render() {
    let { columns, px } = this.renderColumns();

    let $tableProps = pick(this.$props, Object.keys(tableProps));
    $tableProps.dataSource = this.tableDataSource;

    let scroll = {};
    if (this.scrollX == -1) {
      scroll.x = px;
    } else if (this.scrollX) {
      scroll.x = this.scrollX;
    }

    return (
        <a-card bordered={ this.bordered } bodyStyle={ { padding: 0 } } class="ant-editable-table">
          <a-form ref="form" model={ this.editableMap }>
            <a-table { ...$tableProps } scroll={ scroll }>
              { columns }
            </a-table>
          </a-form>
          { this.renderRecordCreatorButton() }
        </a-card>
    );
  },
};

<!--<template>
  <a-tree :tree-data="treeData">
    <template #title="{ key: treeKey, title,dataRef }">
      <template v-if="dataRef.type=='hideComponent'">
        <span>{{ title }}</span>
        <a-select v-model:value="dataRef.value" size="small">
          <a-select-option value="文本框1">文本框1</a-select-option>
          <a-select-option value="文本框2">文本框2</a-select-option>
          <a-select-option value="表格1">表格1</a-select-option>
        </a-select>
      </template>
      <template v-else-if="dataRef.type=='dataSource'">
        <span>过滤数据源</span>
        <a-select v-model:value="dataRef.value" size="small">
          <a-select-option value="文本框1">文本框1</a-select-option>
          <a-select-option value="文本框2">文本框2</a-select-option>
          <a-select-option value="表格1">表格1</a-select-option>
        </a-select>
      </template>
      <template v-else-if="dataRef.type=='dataSourceFilter'">
        <a-input-group compact>
          <a-select v-model:value="dataRef.field" size="small">
            <a-select-option value="姓名">姓名</a-select-option>
            <a-select-option value="性别">性别</a-select-option>
          </a-select>
          <a-select v-model:value="dataRef.oper" size="small">
            <a-select-option value="=">=</a-select-option>
            <a-select-option value="!=">!=</a-select-option>
          </a-select>
          <a-input v-model:value="dataRef.value" size="small"></a-input>
        </a-input-group>
      </template>
      <span v-else>{{ title }}</span>

    </template>
  </a-tree>
  <CodeEditor v-model:value="code"></CodeEditor>
</template>-->

<script lang="jsx">
import debounce from 'lodash-es/debounce';
import { CodeEditor } from '@/ui';
import { parseCode, getComponent } from './config.jsx';
import { formatCode } from '@/helpers/esprimaHelper';

export default {
  components: {
    CodeEditor,
  },
  data() {
    return {
      treeData: [],
      code: `
if(getComponent('文本框').getValue()==1){
  openUrl('http://www.baidu.com?id=' + a);
  hideComponent('文本框1');
  getDataSource('表格1').filter('姓名','=','张三');
}


`,

      actions: [
        {
          title: '申明变量',
        },
        {
          title: '判断',
          children: [
            {
              title: '如果',
            },
            {
              title: '否则-如果',
            },
            {
              title: '否则',
            },
          ],
        },
        {
          title: '打开窗口',
          data() {
            return {
              url: ``,
              component: 'openUrl',
              toCode() {
                return `openUrl(${ this.url });`;
              },
            };
          },
        },
        {
          title: '隐藏组件',
          data() {
            return {
              value: '',
              component: 'hideComponent',
              toCode() {
                return `hideComponent('${ this.value }');`;
              },
            };
          },
        },
        {
          title: '数据源',
          children: [
            {
              title: '过滤',
            },
          ],
        },
      ],

    };
  },

  watch: {
    code: {
      immediate: true,
      handler: debounce(function (code) {
        this.treeData = parseCode(code);
      }, 1000),
    },
    treeData: {
      deep: true,
      handler(treeData) {
        if (treeData) {
          let code = treeData.map(node => node.toCode()).join('\n');
          try {
            let c1 = formatCode(code);
            let c2 = formatCode(this.code);
            if (c1 !== c2) {
              this.code = c1;
            }
          } catch (e) {

          }

        }
      },
    },
  },

  methods: {
    selectNode(keys, { selected, node }) {
      this.curNode = selected ? node : null;
      return;
    },
    addAction(n) {
      if (this.curNode) {
        this.curNode.children.push(n.data());
      } else {
        this.treeData.push(n.data());
      }
    },
  },

  render() {
    let treeSlot = {
      title({ title, dataRef }) {
        if (dataRef.component) {
          return getComponent(dataRef.component)(dataRef);
        }
        return title;
      },
    };

    let leftSlot = {
      title: ({ title, dataRef }) => {
        return <span onDblclick={ () => this.addAction(dataRef) }>{ title }</span>;
      },
    };


    return <div style="background:#f1f1f1;padding:12px;height:100%;">
      <a-card title="代码" style="margin-bottom:12px;">
        <CodeEditor v-model={ [this.code, 'value'] }/>
      </a-card>

      <a-row gutter={ [10] }>
        <a-col span={ 4 }>
          <a-card title="行为">
            <a-tree defaultExpandAll
                    v-slots={ leftSlot }
                    tree-data={ this.actions }></a-tree>
          </a-card>
        </a-col>
        <a-col span={ 20 }>
          <a-card title="语法树">
            <a-tree defaultExpandAll onSelect={ this.selectNode } tree-data={ this.treeData } v-slots={ treeSlot }/>
          </a-card>
        </a-col>
      </a-row>
    </div>;
  },

};
</script>

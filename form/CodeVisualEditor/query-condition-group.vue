<template>
  <div class="ds-qcgroup">

    <div class="ds-qcgroup__logic">
      <span class="ds-qcgroup__logic--text">{{ logicText(conditionGroup.logic) }}</span>
    </div>

    <div class="ds-qcgroup__item" v-for="(item,index) in conditionGroup.children" ref="items" :data-index="index"
         :key="index">
      <query-condition-group v-if="item.children" :conditionGroup="item"></query-condition-group>
      <span class="ds-qcgroup__box" v-else>
        <query-condition :item="item"></query-condition>
        <i class="ds-qcgroup__box-close el-icon-circle-close"></i>
      </span>
    </div>

  </div>
</template>

<script>
  import QueryCondition from './query-condition';

  export default {
    name: 'query-condition-group',
    components: {
      QueryCondition,
    },
    props: {
      conditionGroup: Object,
      parent: Object,
    },

    data() {
      return {};
    },

    computed: {
      children() {
        return this.conditionGroup.children;
      },
    },

    methods: {
      changeLogic() {
        this.conditionGroup.logic = this.conditionGroup.logic === 'AND' ? 'OR' : 'AND';
      },
      logicText(logic) {
        return logic === 'AND' ? '且' : '或';
      },
      removeItem(item) {
        let childIndex = this.children.indexOf(item);
        this.children.splice(childIndex, 1);
      },
    },

  };
</script>

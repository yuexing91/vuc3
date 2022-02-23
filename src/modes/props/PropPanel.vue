<template>
  <div>
    <PropItem v-for="item in items"
              :key="item.name + item.vucNode._astId"
              :config="item.prop"
              :name="item.name"
              :vucNode="item.vucNode"/>
  </div>
</template>

<script>
import PropItem from './PropItem.vue';

export default {
  props: {
    items: Array,
  },
  components: {
    PropItem,
  },
};
</script>

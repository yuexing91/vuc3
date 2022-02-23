<template>
  <div>
    <template v-for="event in evnetConfigs" :key="(event.vucNode || vucNode)._astId + event.id">
      <quick-event-item
          :id="event.id"
          :name="event.name"
          :vucNode="event.vucNode || vucNode"
      />
    </template>
  </div>
</template>
<script>
import QuickEventItem from './QuickEventItem';

export default {
  props: {
    items: Array,
    vucNode: Object,
  },
  components: {
    QuickEventItem,
  },
  data() {
    return {
      evnetConfigs: this.items,
    };
  },
  watch: {
    vucNode: {
      immediate: true,
      handler: 'updateEventConfigs',
    },
    items() {
      this.evnetConfigs = this.items;
    },
  },
  methods: {
    updateEventConfigs(vucNode) {
      if (!vucNode) return;
      let eventTypes = vucNode.getConfig('eventTypes');
      this.evnetConfigs = eventTypes ? eventTypes.filter((e) => e.quick) : [];
    },
  },
};
</script>

<template>
  <panel-view title="组件选项">
    <template v-if="combo">
      <combo-drowdown class="vuc-sample-designer-combo-drowdown" :combo="combo" v-model:value="configNode"/>
      <SampleCard v-if="!configNode" title="组合选项">
        <combo-panel :vucNode="selectNode"/>
      </SampleCard>
    </template>

    <template v-if="configNode">
      <SampleCard title="选项">
        <text-panel :vucNode="configNode"/>
        <props-panel :vucNode="configNode"/>
        <quick-event-panel :vucNode="configNode"/>
        <quick-style-panel :vucNode="configNode"/>
      </SampleCard>

      <SampleCard title="事件">
        <event-panel :vucNode="configNode"/>
      </SampleCard>

      <SampleCard title="样式">
        <style-panel :vucNode="configNode"/>
      </SampleCard>

      <SampleCard title="指令">
        <directive-panel :vucNode="configNode"/>
      </SampleCard>
    </template>
  </panel-view>
</template>

<script>
import SampleCard from './SampleCard';
import TextPanel from '../text';
import PanelView from '../panels';
import { PropsPanel } from '../props';
import DirectivePanel from '../directive';
import { EventPanel, QuickEventPanel } from '../events';
import { StylePanel, QuickStylePanel } from '../styles';
import { ComboPanel, ComboDrowdown } from '../combo';

export default {
  name: 'SampleNodePanel',
  components: {
    SampleCard,
    PanelView,
    PropsPanel,
    StylePanel,
    EventPanel,
    DirectivePanel,
    TextPanel,
    ComboPanel,
    ComboDrowdown,
    QuickEventPanel,
    QuickStylePanel,
  },
  props: {
    vucAst: Object,
    selectNode: Object,
  },
  data() {
    return {
      configNode: null,
      combo: null,
    };
  },
  watch: {
    selectNode: {
      immediate: true,
      handler(selectNode) {
        this.combo = this.vucAst.maybeCombo(selectNode);
        this.configNode = this.combo ? null : selectNode;
      },
    },
  },
};
</script>


<template>
  <panel-view :title="title">
    <SampleCard title="data">
      <data-panel/>
    </SampleCard>
    <SampleCard title="computed">
      <computed-panel/>
    </SampleCard>
    <SampleCard title="methods">
      <method-panel/>
    </SampleCard>
    <SampleCard title="watch">
      <watch-panel/>
    </SampleCard>
  </panel-view>
</template>

<script>
import SampleCard from './SampleCard';
import DataPanel from '../data';
import ComputedPanel from '../computed';
import MethodPanel from '../methods';
import WatchPanel from '../watch';
import PanelView from '../panels';

export default {
  name: 'SampleOptionPanel',
  props: {
    title: String,
  },
  components: {
    SampleCard,
    DataPanel,
    ComputedPanel,
    MethodPanel,
    WatchPanel,
    PanelView,
  },
};
</script>

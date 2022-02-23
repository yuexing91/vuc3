import { createItems } from '../utils';

export default {
  id: 'a-row',
  name: '栅格行',
  eventTypes: [],
  type: ['row'],
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
  ],
  props: {
    gutter: {
      label: '间距',
      editors: 'number',
      help: '栅格间距，单位 px，左右平分',
    },
    align: {
      label: '垂直对齐',
      editors: 'select?@items=:default|top|middle|bottom',
    },
    justify: {
      label: '水平排列',
      editors: 'select?:default|start|end|center|space-around|space-between',
    },
  },
  childLimit(childTag){
    return childTag === 'a-col';
  }

};

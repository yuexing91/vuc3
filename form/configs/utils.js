export function createItems(str, split) {
  return str.split(split || ',').map((line) => {
    const columns = line.trim().split(':');
    return {
      value: columns[0],
      label: columns[1] || columns[0],
    };
  });
}

export function getSizeEditor() {
  return {
    name: '选项',
    type: 'radio-group',
    props: {
      items: [
        {
          value: 'large',
          label: '大',
        },
        {
          value: 'default',
          label: '中',
        },
        {
          value: 'small',
          label: '小',
        },
      ],
    },
  };
}

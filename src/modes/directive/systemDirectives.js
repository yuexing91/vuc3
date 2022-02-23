let modelSchema = {
  name: 'model',
  describe: '双向绑定',
  props: [
    {
      name: 'value',
      describe: '源数据',
      required: true,
    },
  ],
};

const schemas = [
  {
    name: 'show',
    describe: '可见性',
    props: [
      {
        name: 'value',
        describe: '条件',
        required: true,
      },
    ],
  },
  {
    name: 'if',
    describe: '条件渲染',
    props: [
      {
        name: 'value',
        describe: '条件',
        required: true,
      },
    ],
  },
  {
    name: 'for',
    describe: '基于源数据多次渲染',
    props: [
      {
        name: 'source',
        describe: '源数据数组',
        required: true,
      },
      {
        name: 'value',
        describe: '别名',
        required: true,
      },
      {
        name: 'index',
        describe: '索引',
      },
      {
        name: 'key',
        describe: 'key',
      },
    ],
  },
  {
    name: 'text',
    describe: '插入文本',
    props: [
      {
        name: 'value',
        describe: '文本',
        required: true,
      },
    ],
  },
  {
    name: 'html',
    describe: '插入html',
    props: [
      {
        name: 'value',
        describe: 'HTML',
        required: true,
      },
    ],
  },
//  {
//    name: 'else',
//    describe: '条件渲染',
//  },
//  {
//    name: 'else-if',
//    describe: '条件渲染',
//    props: [
//      {
//        name: 'value',
//        describe: '条件',
//        required: true,
//      },
//    ],
//  },
];

function parseDir(directive) {
  if (!directive) return {};
  let { name, attrValue } = directive;
  if (name === 'for') {
    return parseForExpression(attrValue);
  }
  return { value: attrValue };
}

function modelArgEq(n1, n2) {
  return n1 === n2 || ( !n1 && n2 === 'modelValue' ) || ( n1 === 'modelValue' && !n2 );
}

export function createSimpleObj(dir) {
  let { value, index, source } = dir.data;

  let name = `v-${ dir.name }`;

  if (name === 'v-for') {
    value = `(${ value }${ index && ` , ${ index }` }) in ${ source }`;
  }

  if (dir.arg) {
    name += ':' + dir.arg;
  }

  return {
    name,
    value,
  };
}

export function getDirectives(models, props) {
  let dirs =
      models &&
      models.map((model) => {
        let prop = props.find((dir) => dir.name == 'model' && modelArgEq(dir.getArgContent(), model));
        return Object.assign(
            {
              arg: model,
              enable: prop != null,
              data: parseDir(prop),
            },
            modelSchema,
        );
      });
  dirs = dirs || [];

  return dirs.concat(
      schemas.map((schema) => {
        let prop = props.find((dir) => dir.name == schema.name);
        return Object.assign({ enable: prop != null, data: parseDir(prop) }, schema);
      }),
  );
}

const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
const stripParensRE = /^\(|\)$/g;

function parseForExpression(exp) {
  const inMatch = exp.match(forAliasRE);
  if (!inMatch) return;
  const [, LHS, RHS] = inMatch;
  const result = {
    source: RHS.trim(),
    value: undefined,
    key: undefined,
    index: undefined,
  };
  let valueContent = LHS.trim().replace(stripParensRE, '').trim();
  const iteratorMatch = valueContent.match(forIteratorRE);
  if (iteratorMatch) {
    valueContent = valueContent.replace(forIteratorRE, '').trim();
    const keyContent = iteratorMatch[1].trim();
    if (keyContent) {
      result.key = keyContent;
    }
    if (iteratorMatch[2]) {
      const indexContent = iteratorMatch[2].trim();
      if (indexContent) {
        result.index = indexContent;
      }
    }
  }
  if (valueContent) {
    result.value = valueContent;
  }
  return result;
}

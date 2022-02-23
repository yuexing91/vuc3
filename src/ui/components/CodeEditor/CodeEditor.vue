<template>
  <div class="vuc-codeeditor" :class="{ 'vuc-codeeditor-inline': inline, 'vuc-codeeditor-small': sm }"/>
</template>
<script>

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/fold/foldgutter.css';

import CodeMirror from 'codemirror';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/mode/javascript/javascript';
import debounce from 'lodash-es/debounce';

import { castArray } from '@/helpers/lang';

const hints = [
  {
    id: 'Math',
    desc: '基本数学运算的方法',
    children: [
      {
        id: 'abs',
        desc: '返回参数num的绝对值',
        type: 'method',
        args: [
          {
            id: 'num',
          },
        ],
      },
      {
        id: 'min',
        desc: '返回参数array的最小值',
        type: 'method',
        args: [
          {
            id: 'array',
            req: true,
          },
        ],
      },
    ],
  },
  {
    id: 'String',
  },
];

export default {
  emits: ['update:value', 'change', 'blur'],
  props: {
    value: String,
    hints: Array,
    width: [String, Number],
    height: {
      type: [String, Number],
      default: 300,
    },
    inline: Boolean,
    sm: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: this.value,
    };
  },

  watch: {
    value: {
      handler() {
        if (this.value !== this.code) {
          this.code = this.value;
          this.$nextTick(() => {
            this._setValue = true;
            this.codeMirror.setValue(this.code || '');
            this.codeMirror.display.lastWrapHeight = 0;
          });
        }
      },
      immediate: true,
    },
    code() {
      if (this.code !== this.value) {
        this.$emit('update:value', this.code);
      }
    },
  },
  mounted() {
    const opts = this.inline
        ? {
          lineNumbers: false,
          lineWrapping: true,
          viewportMargin: Infinity,
        }
        : {
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          foldGutter: true,
        };

    this.codeMirror = CodeMirror(
        this.$el,
        Object.assign(
            {
              value: this.value || '',
              lineNumbers: true,
              mode: 'javascript',
              indentWithTabs: false,
              autoCloseBrackets: true,
              autoRefresh: true,
              extraKeys: {
                'Alt-/': (cm) => {
                  cm.showHint({
                    editor: this,
                  });
                },
                'Tab': function (cm) {
                  if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                  } else {
                    let spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                    cm.replaceSelection(spaces);
                  }
                },
                'F11': function (cm) {
                  cm.setOption('fullScreen', !cm.getOption('fullScreen'));
                },
              },
            },
            opts,
        ),
    );

    this.codeMirror.setSize(this.width, this.inline ? null : this.height);

    this.codeMirror.on(
        'change',
        debounce(() => {
          if (this._setValue) {
            this._setValue = false;
          } else {
            this.code = this.codeMirror.getValue();
            this.$emit('change', this.code);
          }
        }, 100),
    );

    let focusValue = '';
    this.codeMirror.on('focus', () => {
      focusValue = this.code;
    });

    this.codeMirror.on('blur', () => {
      if (focusValue !== this.code) {
        this.$emit('change', this.code);
      }
      this.$emit('blur');
    });

    this.codeMirror.on('beforeChange', (cm, obj) => {
      if (obj.origin === '+input') {
        if (this.inline) {
          //阻止Enter事件
          if (obj.text.length === 2 && obj.text.join('') === '') {
            obj.cancel();
            cm.getInputField().blur();
          }
        }
      }
    });
  },
  methods: {
    _getHint(token, context) {
      context = castArray(context);
      let ctx;
      let props = this.hints;
      while (( ctx = context.pop() )) {
        const prop = props.find((p) => p.id === ctx.string);
        if (prop == null) return;
        props = prop.children;
      }

      return props.filter((p) => p.id.startsWith(token.string));
    },

    getHint(token, context) {
      return {
        list: this._getHint(token, context).map((p) => {
          if (p.type === 'method') {
            return {
              text: `${ p.id }()`,
              render(el) {
                el.innerHTML = `<span class="e-code-hintcode">${ p.id }(${ p.args
                    .map((a) => ( a.req ? a.id : `[${ a.id }]` ))
                    .join(',') })</span><span class="e-code-hintdesc">${ p.desc || '' }</span>`;
              },
            };
          }

          return {
            text: `${ p.id }`,
            render(el) {
              el.innerHTML = `<span class="e-code-hintcode">${ p.id }</span> <span class="e-code-hintdesc">${
                  p.desc || ''
              }</span>`;
            },
          };
        }),
      };
    },

    refresh() {
      this.codeMirror.refresh();
    },
  },
};
</script>
<style lang="less">
.vuc-codeeditor {
  border: 1px solid #dcdee2;

  .CodeMirror-fullscreen {
    z-index: 999999;
  }
}

.vuc-codeeditor-inline {
  border-radius: 3px;
  line-height: 1.4;
  padding: 2px 3px;
  height: 32px;
  max-height: 32px;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  overflow: auto;
}

.vuc-codeeditor-small {
  font-size: 12px;
  padding: 1px 3px;

  .CodeMirror-sizer {
    min-height: 20px !important;
  }

  .CodeMirror-lines {
    padding: 1px 0 !important;
  }

  &.vuc-codeeditor-inline {
    height: 24px;
  }
}

.vuc-codeeditor .CodeMirror {
  height: auto;
  font: 14px / normal Consolas, "Courier New", monospace !important;
}

.vuc-codeeditor,
.CodeMirror-hints {
  font-size: 14px;

  .cm-variable {
    /*color: #05a;*/
  }
}

.CodeMirror-hints {
  font-family: inherit;
  min-width: 200px;
}

.CodeMirror-hints .vuc-code-hintcode {
  line-height: 20px;
}

.vuc-code-hintdesc {
  color: #9ea7b4;
  font-size: 12px;
  float: right;
  display: inline-block;
  height: 20px;
  line-height: 20px;
}

.CodeMirror-hint-active .vuc-code-hintdesc {
  color: #ccc;
}
</style>

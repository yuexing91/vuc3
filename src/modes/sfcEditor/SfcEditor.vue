<template>
  <div class="vuc-codeeditor"/>
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
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/handlebars/handlebars';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
import debounce from 'lodash-es/debounce';

export default {
  emits: ['update:value', 'change'],
  props: {
    value: String,
    width: [String, Number],
    height: {
      type: [String, Number],
      default: 300,
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
        if (this.value != this.code) {
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
      if (this.code != this.value) {
        this.$emit('update:value', this.code);
      }
    },
  },
  mounted() {
    const opts = {
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      foldGutter: true,
      foldOptions: {
        widget: '...',
      },
    };

    this.codeMirror = CodeMirror(
        this.$el,
        Object.assign(
            {
              value: this.value || '',
              lineNumbers: true,
              mode: 'vue',
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

    this.codeMirror.setSize(this.width,this.height);

    this.codeMirror.on(
        'change',
        debounce(() => {
          if (this._setValue) {
            this._setValue = false;
          } else {
            this.code = this.codeMirror.getValue();
          }
        }, 300),
    );

    let focusValue = '';
    this.codeMirror.on('focus', () => {
      focusValue = this.code;
    });

    this.codeMirror.on('blur', () => {
      if (focusValue !== this.code) {
        this.$emit('change', this.code);
      }
    });
  },
  methods: {},
};
</script>
<style lang="less">
</style>

export default function (
    {
      valueName = 'value',
      valName = 'val',
      type = String,
      mode = 'computed',
      emitUpdate = true,
    } = {},
) {

  let mixin = {
    emits: [`update:${ valueName }`],
    props: {
      [valueName]: type,
    },
  };

  if (mode == 'computed') {
    mixin.computed = {
      [valName]: {
        get() {
          return this[valueName];
        },
        set(val) {
          this.$emit(`update:${ valueName }`, val);
        },
      },
    };
  } else {
    mixin.data = function () {
      return {
        [valName]: null,
      };
    };

    mixin.watch = {
      [valueName]: {
        immediate: true,
        handler() {
          this[valName] = this[valueName];
        },
      },
      [valName]() {
        if (emitUpdate) {
          this.emitUpdate();
        }
      },
    };

    mixin.methods = {
      emitUpdate() {
        this.$emit(`update:${ valueName }`, this[valName]);
      },
    };

  }

  return mixin;
}

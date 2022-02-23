<script type="text/jsx">
export default {
  name: 'AEditableTableColumn',
  props: {
    dataIndex: String,
    align: String,
    colSpan: Number,
    title: String,
    width: [String, Number],
    valueType: String,
    fixed: [Boolean, String],
    rules: [Array, Object],
  },
};
</script>

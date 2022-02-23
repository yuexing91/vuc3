const EDITOR_COMPONENTS = {};

function registerValueEditor(id, Editor) {
  EDITOR_COMPONENTS[id] = Editor;
}

function getAllEditorComponents() {
  return Object.values(EDITOR_COMPONENTS);
}

function getEditorComponent(id) {
  return EDITOR_COMPONENTS[id]?.Editor;
}

function getEditorComponentConfig(id) {
  return EDITOR_COMPONENTS[id];
}

const requireEditors = require.context(
    // 其组件目录的相对路径
    './editors',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+Editor\.(vue)$/,
);

requireEditors.keys().forEach((fileName) => {
  // 获取组件配置
  const EditorsConfig = requireEditors(fileName);
  const Editor = EditorsConfig.default;
  registerValueEditor(Editor.editorConfig.id, {
    ...Editor.editorConfig,
    Editor,
  });
});

export {
  getAllEditorComponents,
  getEditorComponent,
  getEditorComponentConfig,
  registerValueEditor,
};

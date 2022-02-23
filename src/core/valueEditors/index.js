import Configurator from '@/config';
import ValueEditor from './ValueEditor';
import { getEditorComponent, getEditorComponentConfig, registerValueEditor } from './config';

Configurator.registerConfig({ registerValueEditor });

export {
  ValueEditor,
  getEditorComponent,
  getEditorComponentConfig,
};



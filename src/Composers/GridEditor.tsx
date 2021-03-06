import {
  FieldDefaultDescriptor,
  FieldEditor,
  FIELD_TYPE,
} from "./Field/FieldComposer";
import {
  ValueFormatterDefaultDescriptor,
  ValueFormatterEditor,
  VALUE_FORMATTER_TYPE,
} from "./ValueFormatter/ValueFormatterComposer";

import "./GridEditor.css";
import {
  HeaderNameDefaultDescriptor,
  HeaderNameEditor,
  HEADER_NAME_TYPE,
} from "./Header";
import {
  SortableDefaultDescriptor,
  SortableEditor,
  SORTABLE_TYPE,
} from "./Sortable";
import {
  CellStylerDefaultDescriptor,
  CellStylerEditor,
  CELL_STYLER_TYPE,
} from "./CellStyler/CellStylerComposer";

export interface GenericFieldComposer {
  type: GRID_EDITOR_MAP_TYPE_KEY;
  param?: any;
}

export type GenericColDescriptor = GenericFieldComposer[];

export const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: {
    defaultDescriptor: FieldDefaultDescriptor,
    editor: FieldEditor,
  },
  [VALUE_FORMATTER_TYPE]: {
    defaultDescriptor: ValueFormatterDefaultDescriptor,
    editor: ValueFormatterEditor,
  },
  [CELL_STYLER_TYPE]: {
    defaultDescriptor: CellStylerDefaultDescriptor,
    editor: CellStylerEditor,
  },
  [HEADER_NAME_TYPE]: {
    defaultDescriptor: HeaderNameDefaultDescriptor,
    editor: HeaderNameEditor,
  },
  [SORTABLE_TYPE]: {
    defaultDescriptor: SortableDefaultDescriptor,
    editor: SortableEditor,
  },
};
export type GRID_EDITOR_MAP_TYPE_KEY = keyof typeof GRID_EDITOR_MAP;

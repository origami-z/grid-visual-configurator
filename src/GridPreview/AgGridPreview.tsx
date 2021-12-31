import { ValueFormatterFunc, CellStyle } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { CSSProperties } from "react";
import {
  DIVIDE_BY_THOUSAND_TYPE,
  FieldComposerParam,
  FIELD_TYPE,
  FixedDecimalPlacesParam,
  FIXED_DECIMAL_PLACES_TYPE,
  GenericColDescriptor,
  HeaderNameComposerParam,
  HEADER_NAME_TYPE,
  SuffixByParam,
  SUFFIX_BY_TYPE,
  ValueFormatterComposerParam,
  VALUE_FORMATTER_TYPE,
  SortableComposerParam,
  SORTABLE_TYPE,
  TextColorParam,
  BOLD_FONT_TYPE,
  TEXT_COLOR_TYPE,
  CellStylerComposerParam,
  CELL_STYLER_TYPE,
} from "../Composers";

const FieldComposer = <T extends {}>(input: T, param: FieldComposerParam) => ({
  ...input,
  field: param.field,
});

const fixedDecimalPlacesConverter =
  (param: FixedDecimalPlacesParam) => (input: string) =>
    Number.parseFloat(input).toFixed(param.dp);
const divideByThousandConverter = () => (input: string) =>
  Number.parseFloat(input) / 1e3;
const suffixByConverter = (param: SuffixByParam) => (input: string) =>
  input.toString() + param.suffix;
const FORMATTER_EDITOR_MAP = {
  [DIVIDE_BY_THOUSAND_TYPE]: {
    converter: divideByThousandConverter,
  },
  [FIXED_DECIMAL_PLACES_TYPE]: {
    converter: fixedDecimalPlacesConverter,
  },
  [SUFFIX_BY_TYPE]: {
    converter: suffixByConverter,
  },
};
const ValueFormatterComposer = <T extends {}>(
  input: T,
  { formatterDescriptors }: ValueFormatterComposerParam
): T & { valueFormatter: ValueFormatterFunc } => {
  const descriptorToFormatter = (input: any) => {
    let outputValue = input;
    for (let i = 0; i < formatterDescriptors.length; i++) {
      const ftType = formatterDescriptors[i].type;
      const formatterFn = FORMATTER_EDITOR_MAP[ftType].converter(
        formatterDescriptors[i].param
      );
      outputValue = formatterFn(outputValue);
    }
    return outputValue;
  };
  return {
    ...input,
    valueFormatter: (valueFormatterParam) => {
      return descriptorToFormatter(valueFormatterParam.value);
    },
  };
};

const boldFontConverter = (): CSSProperties => ({ fontWeight: "bold" });
const textColorConverter = (param: TextColorParam): CSSProperties => ({
  color: param.color,
});

const CELL_STYLER_MAP = {
  [BOLD_FONT_TYPE]: {
    converter: boldFontConverter,
  },
  [TEXT_COLOR_TYPE]: {
    converter: textColorConverter,
  },
};

const CellStylerComposer = <T extends {}>(
  input: T,
  { stylerDescriptors }: CellStylerComposerParam
): T & { cellStyle: CellStyle } => {
  const descriptorToCellStyler = () => {
    let outputValue = {};
    for (let i = 0; i < stylerDescriptors.length; i++) {
      const stylerType = stylerDescriptors[i].type;
      const cssStyle = CELL_STYLER_MAP[stylerType].converter(
        stylerDescriptors[i].param
      );
      outputValue = {
        ...outputValue,
        ...cssStyle,
      };
    }
    return outputValue;
  };
  return {
    ...input,
    cellStyle: descriptorToCellStyler(),
  };
};

const HeaderNameComposer = <T extends {}>(
  input: T,
  param: HeaderNameComposerParam
) => ({
  ...input,
  headerName: param.headerName,
});

const SortableComposer = <T extends {}>(
  input: T,
  param: SortableComposerParam
) => ({
  ...input,
  sortable: param.sortable,
});

const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: {
    composer: FieldComposer,
  },
  [VALUE_FORMATTER_TYPE]: {
    composer: ValueFormatterComposer,
  },
  [CELL_STYLER_TYPE]: {
    composer: CellStylerComposer,
  },
  [HEADER_NAME_TYPE]: {
    composer: HeaderNameComposer,
  },
  [SORTABLE_TYPE]: {
    composer: SortableComposer,
  },
};

export const AgGridPreview = (props: {
  rowData?: any[] | null;
  colDescriptors?: GenericColDescriptor[];
}) => {
  // compute colDef when value in editors change
  const colDefFromColDescriptors = props.colDescriptors?.map(
    (colDescriptor, index) => {
      return colDescriptor.reduce((result, currentComposer) => {
        const editorType =
          GRID_EDITOR_MAP[currentComposer.type as keyof typeof GRID_EDITOR_MAP];

        if (editorType) {
          return editorType.composer(result, currentComposer.param);
        } else {
          console.warn(
            "AG Grid unimplemented composer type",
            currentComposer.type
          );
          return result;
        }
      }, {});
    }
  );

  return (
    <div className="ag-theme-alpine" style={{ flex: 1 }}>
      <AgGridReact
        columnDefs={colDefFromColDescriptors}
        rowData={props.rowData}
        reactUi
      />
    </div>
  );
};

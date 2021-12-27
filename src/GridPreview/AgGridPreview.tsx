import { ValueFormatterFunc } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import {
  DIVIDE_BY_THOUSAND_TYPE,
  FieldComposerParam,
  FIELD_TYPE,
  FixedDecimalPlacesParam,
  FIXED_DECIMAL_PLACES_TYPE,
  GenericColDescriptor,
  SuffixByParam,
  SUFFIX_BY_TYPE,
  ValueFormatterComposerParam,
  VALUE_FORMATTER_TYPE,
} from "../Composers";

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
const FieldComposer = <T extends {}>(input: T, param: FieldComposerParam) => ({
  ...input,
  field: param.field,
});

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

const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: {
    composer: FieldComposer,
  },
  [VALUE_FORMATTER_TYPE]: {
    composer: ValueFormatterComposer,
  },
};

export const AgGridPreview = (props: {
  rowData?: any[] | null;
  colDescriptors?: GenericColDescriptor[];
}) => {
  // compute colDef when value in editors change
  const colDefFromColDescriptors = props.colDescriptors?.map(
    (colDescriptor, index) => {
      let result: any = {};
      colDescriptor.map((composer) => {
        result = GRID_EDITOR_MAP[composer.type].composer(
          result,
          composer.param
        );
      });
      return result;
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

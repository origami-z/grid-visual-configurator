import { Table } from "antd";
import {
  FieldComposerParam,
  FIELD_TYPE,
  GenericColDescriptor,
  ValueFormatterComposerParam,
  VALUE_FORMATTER_TYPE,
} from "../Composers/GridEditor";
import {
  DIVIDE_BY_THOUSAND_TYPE,
  FixedDecimalPlacesParam,
  FIXED_DECIMAL_PLACES_TYPE,
  SuffixByParam,
  SUFFIX_BY_TYPE,
} from "../Composers/Formatters";

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
  // Default title to field, Use header title composer to override
  title: param.field,
  key: param.field,
  dataIndex: param.field,
});

const ValueFormatterComposer = <T extends {}>(
  input: T,
  { formatterDescriptors }: ValueFormatterComposerParam
) => {
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
    render: (data: any) => {
      return descriptorToFormatter(data);
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

export const AntdTablePreview = (props: {
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
    <div style={{ flex: 1 }}>
      <Table
        columns={colDefFromColDescriptors}
        dataSource={props.rowData || []}
      />
    </div>
  );
};

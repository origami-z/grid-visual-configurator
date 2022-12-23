import { Table } from "antd";
import {
  DIVIDE_BY_THOUSAND_TYPE,
  FieldComposerParam,
  FIELD_TYPE,
  FixedDecimalPlacesParam,
  FIXED_DECIMAL_PLACES_TYPE,
  GenericColDescriptor,
  HeaderNameComposerParam,
  HEADER_NAME_TYPE,
  SortableComposerParam,
  SORTABLE_TYPE,
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
  // Default title to field, Use header title composer to override
  title: param.field,
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

const HeaderNameComposer = <T extends {}>(
  input: T,
  param: HeaderNameComposerParam
) => ({
  ...input,
  title: param.headerName,
});

const SortableComposer = <T extends {}>(
  input: T,
  param: SortableComposerParam
) => {
  return {
    ...input,
    sorter: param.sortable
      ? (a: any, b: any) =>
          a[(input as any).dataIndex] - b[(input as any).dataIndex]
      : undefined,
  };
};

const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: {
    composer: FieldComposer,
  },
  [VALUE_FORMATTER_TYPE]: {
    composer: ValueFormatterComposer,
  },
  [HEADER_NAME_TYPE]: {
    composer: HeaderNameComposer,
  },
  [SORTABLE_TYPE]: {
    composer: SortableComposer,
  },
};

export const AntdTablePreview = (props: {
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
            "Antd unimplemented composer type",
            currentComposer.type
          );
          return result;
        }
      }, {});
    }
  );

  return (
    <div style={{ flex: 1 }}>
      <Table
        columns={colDefFromColDescriptors}
        dataSource={(props.rowData || []).map((d, i) => ({ ...d, key: i }))}
      />
    </div>
  );
};

import { ValueFormatterFunc } from "ag-grid-community";

export const FIELD_TYPE = 'Grid.Field' as const;

export const FieldComposer = <T extends {}>(input: T, field: string) => ({
  ...input,
  field,
});

export const VALUE_FORMATTER_TYPE = 'Grid.ValueFormatter' as const;
export const ValueFormatterComposer = <T extends {}>(input: T, formatter: (value: any) => any): T & { valueFormatter: ValueFormatterFunc } => ({
  ...input,
  valueFormatter: param => {
    return formatter(param.value)
  },
});

export const GRID_COMPOSER_MAP = {
  [FIELD_TYPE]: FieldComposer,
  [VALUE_FORMATTER_TYPE]: ValueFormatterComposer
};


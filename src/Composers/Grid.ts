import { ValueFormatterFunc } from "ag-grid-community";

export const FIELD_TYPE = 'Grid.Field' as const;

export const FieldComposer = <T extends {}>(input: T, field: string) => ({
  ...input,
  field,
});

export const ValueFormatterComposer = <T extends {}>(input: T, formatters: ((value: any) => any)[]): T & { valueFormatter: ValueFormatterFunc } => ({
  ...input,
  valueFormatter: param => {
    let outputValue = param.value;
    for (let i = 0; i < formatters.length; i++) {
      const formatter = formatters[i];
      outputValue = formatter(outputValue)
    }
    return outputValue
  },
});

export const GRID_COMPOSER_MAP = {
  [FIELD_TYPE]: FieldComposer,
};

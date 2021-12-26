import { useEffect, useState } from "react";
import { FIELD_TYPE, VALUE_FORMATTER_TYPE } from "./Grid";

export const DefaultFieldComposer = {
  type: FIELD_TYPE,
  field: "",
};
export const FieldEditor = (props: {
  field?: string;
  onFieldChange?: (newField: string) => void;
}) => {
  return (
    <div>
      <label>
        Field
        <input
          value={props.field}
          onChange={(e) => props.onFieldChange?.(e.currentTarget.value)}
        />
      </label>
    </div>
  );
};

export const DefaultValueFormatterComposer = {
  type: VALUE_FORMATTER_TYPE,
  formatter: (x: any) => x,
};
export const ValueFormatterEditor = (props: {
  formatter?: (value: any) => any;
  onFormatterChange?: (newFormatter: (value: any) => any) => void;
}) => {
  const [formatterArray, setFormatterArray] = useState<((value: any) => any)[]>(
    []
  );

  useEffect(() => {
    const newFormatter = (input: any) => {
      let outputValue = input;
      for (let i = 0; i < formatterArray.length; i++) {
        const ft = formatterArray[i];
        outputValue = ft(outputValue);
      }
      return outputValue;
    };
    props.onFormatterChange?.(newFormatter);
  }, [formatterArray]);

  return <div>Value editor</div>;
};

export const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: FieldEditor,
  [VALUE_FORMATTER_TYPE]: ValueFormatterEditor,
};

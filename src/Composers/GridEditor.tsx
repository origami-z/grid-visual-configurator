import { ValueFormatterFunc } from "ag-grid-community";
import { Menu, Dropdown, Button, MenuProps } from "antd";
import { useEffect, useState, createElement } from "react";
import {
  FORMATTER_EDITOR_KEYS,
  FORMATTER_EDITOR_KEY_PREFIX,
  FORMATTER_EDITOR_MAP,
} from "./Formatters";

import "./GridEditor.css";

export interface GenericFieldComposer {
  type: GRID_EDITOR_MAP_TYPE_KEY;
  param?: any;
}

export type GenericColDescriptor = GenericFieldComposer[];

export const FIELD_TYPE = "Grid.Field" as const;
export interface FieldComposerParam {
  field?: string;
}
export interface FieldComposerDescriptor {
  type: typeof FIELD_TYPE;
  param: FieldComposerParam;
}
export const FieldComposer = <T extends {}>(
  input: T,
  param: FieldComposerParam
) => ({
  ...input,
  field: param.field,
});
const DefaultFieldComposer: FieldComposerDescriptor = {
  type: FIELD_TYPE,
  param: { field: "" },
};
export const FieldEditor = (props: {
  param?: FieldComposerParam;
  onParamChange?: (newParam: FieldComposerParam) => void;
}) => {
  return (
    <div>
      <label>
        Field
        <input
          value={props.param?.field}
          onChange={(e) =>
            props.onParamChange?.({ field: e.currentTarget.value })
          }
        />
      </label>
    </div>
  );
};

export const VALUE_FORMATTER_TYPE = "Grid.ValueFormatter" as const;
export interface ValueFormatterComposerParam {
  formatter: (value: any) => any;
}
export interface ValueFormatterComposerDescriptor {
  type: typeof VALUE_FORMATTER_TYPE;
  param: ValueFormatterComposerParam;
}
export const ValueFormatterComposer = <T extends {}>(
  input: T,
  param: ValueFormatterComposerParam
): T & { valueFormatter: ValueFormatterFunc } => ({
  ...input,
  valueFormatter: (valueFormatterParam) => {
    return param.formatter(valueFormatterParam.value);
  },
});
const DefaultValueFormatterComposer: ValueFormatterComposerDescriptor = {
  type: VALUE_FORMATTER_TYPE,
  param: { formatter: (x: any) => x },
};
export interface GenericValueFormatter {
  type: keyof typeof FORMATTER_EDITOR_MAP;
  param?: any;
}
export const ValueFormatterEditor = (props: {
  param?: ValueFormatterComposerParam;
  onParamChange?: (newParam: ValueFormatterComposerParam) => void;
}) => {
  const [formatterArray, setFormatterArray] = useState<GenericValueFormatter[]>(
    []
  );

  const handleNewFormatter: MenuProps["onClick"] = (e) => {
    const selectedKey = (FORMATTER_EDITOR_KEY_PREFIX +
      e.key) as keyof typeof FORMATTER_EDITOR_MAP;
    setFormatterArray((prevArray) => [
      ...prevArray,
      FORMATTER_EDITOR_MAP[selectedKey].defaultKey,
    ]);
  };

  const addFormatterMenu = (
    <Menu onClick={handleNewFormatter}>
      {FORMATTER_EDITOR_KEYS.map((k) => {
        return (
          <Menu.Item
            key={k}
            disabled={formatterArray.some(
              (f) => f.type === FORMATTER_EDITOR_KEY_PREFIX + k
            )}
          >
            {k}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  useEffect(() => {
    const descriptorToFormatter = (input: any) => {
      let outputValue = input;
      for (let i = 0; i < formatterArray.length; i++) {
        const ftType = formatterArray[i].type;
        const formatterFn = FORMATTER_EDITOR_MAP[ftType].converter(
          formatterArray[i].param
        );
        outputValue = formatterFn(outputValue);
      }
      return outputValue;
    };
    props.onParamChange?.({ formatter: descriptorToFormatter });
  }, [formatterArray]);

  const formatterRenderers = formatterArray.map((f) => {
    const ftType = f.type;
    const onParamChange = (newParam: any) => {
      setFormatterArray((prevArray) =>
        prevArray.map((formatter) => {
          if (formatter.type === ftType) {
            return { ...formatter, param: newParam };
          } else {
            return formatter;
          }
        })
      );
    };
    return (
      <div key={ftType} className="GridEditor-FormatterRenderer">
        <Button
          onClick={() =>
            setFormatterArray((prevArray) =>
              prevArray.filter((formatter) => formatter.type !== ftType)
            )
          }
        >
          X
        </Button>
        {createElement(FORMATTER_EDITOR_MAP[ftType].editor as any, {
          param: f.param,
          onParamChange,
        })}
      </div>
    );
  });

  return (
    <div>
      <div>
        Value Formatter
        <Dropdown overlay={addFormatterMenu}>
          <Button>+</Button>
        </Dropdown>
      </div>
      {formatterRenderers}
    </div>
  );
};

export const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: {
    defaultDescriptor: DefaultFieldComposer,
    editor: FieldEditor,
    composer: FieldComposer,
  },
  [VALUE_FORMATTER_TYPE]: {
    defaultDescriptor: DefaultValueFormatterComposer,
    editor: ValueFormatterEditor,
    composer: ValueFormatterComposer,
  },
};
export type GRID_EDITOR_MAP_TYPE_KEY = keyof typeof GRID_EDITOR_MAP;

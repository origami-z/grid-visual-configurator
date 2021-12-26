import { Menu, Dropdown, Button, MenuProps } from "antd";
import { useEffect, useState, createElement } from "react";
import {
  FORMATTER_EDITOR_KEYS,
  FORMATTER_EDITOR_KEY_PREFIX,
  FORMATTER_EDITOR_MAP,
} from "./Formatters";
import { FIELD_TYPE, VALUE_FORMATTER_TYPE } from "./Grid";

import "./GridEditor.css";

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

export interface GenericValueFormatter {
  type: string;
  params?: any;
}

export const DefaultValueFormatterComposer = {
  type: VALUE_FORMATTER_TYPE,
  formatter: (x: any) => x,
};
export const ValueFormatterEditor = (props: {
  formatter?: (value: any) => any;
  onFormatterChange?: (newFormatter: (value: any) => any) => void;
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
    const newFormatter = (input: any) => {
      let outputValue = input;
      for (let i = 0; i < formatterArray.length; i++) {
        const ftType = formatterArray[i]
          .type as keyof typeof FORMATTER_EDITOR_MAP;
        const formatterFn = FORMATTER_EDITOR_MAP[ftType].converter(
          formatterArray[i].params
        );
        outputValue = formatterFn(outputValue);
      }
      return outputValue;
    };
    props.onFormatterChange?.(newFormatter);
  }, [formatterArray]);

  const formatterRenderers = formatterArray.map((f) => {
    const ftType = f.type as keyof typeof FORMATTER_EDITOR_MAP;
    const onChange = (newParam: any) => {
      setFormatterArray((prevArray) =>
        prevArray.map((formatter) => {
          if (formatter.type === ftType) {
            return { ...formatter, params: newParam };
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
          ...f.params,
          onChange,
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
  [FIELD_TYPE]: FieldEditor,
  [VALUE_FORMATTER_TYPE]: ValueFormatterEditor,
};

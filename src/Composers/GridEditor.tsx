import { Menu, Dropdown, Button, MenuProps } from "antd";
import { createElement } from "react";
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
const FieldDefaultDescriptor: FieldComposerDescriptor = {
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
  formatterDescriptors: ValueFormatterDescriptor[];
}
export interface ValueFormatterComposerDescriptor {
  type: typeof VALUE_FORMATTER_TYPE;
  param: ValueFormatterComposerParam;
}
const ValueFormatterDefaultDescriptor: ValueFormatterComposerDescriptor = {
  type: VALUE_FORMATTER_TYPE,
  param: { formatterDescriptors: [] },
};
export interface ValueFormatterDescriptor {
  type: keyof typeof FORMATTER_EDITOR_MAP;
  param?: any;
}
export const ValueFormatterEditor = ({
  param = { formatterDescriptors: [] },
  onParamChange,
}: {
  param?: ValueFormatterComposerParam;
  onParamChange?: (newParam: ValueFormatterComposerParam) => void;
}) => {
  const handleNewFormatter: MenuProps["onClick"] = (e) => {
    const selectedKey = (FORMATTER_EDITOR_KEY_PREFIX +
      e.key) as keyof typeof FORMATTER_EDITOR_MAP;
    onParamChange?.({
      formatterDescriptors: [
        ...param.formatterDescriptors,
        FORMATTER_EDITOR_MAP[selectedKey].defaultKey,
      ],
    });
  };

  const addFormatterMenu = (
    <Menu onClick={handleNewFormatter}>
      {FORMATTER_EDITOR_KEYS.map((k) => {
        return (
          <Menu.Item
            key={k}
            disabled={param.formatterDescriptors.some(
              (f) => f.type === FORMATTER_EDITOR_KEY_PREFIX + k
            )}
          >
            {k}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const formatterRenderers = param.formatterDescriptors.map((f) => {
    const ftType = f.type;
    const onParamChange = (newParam: any) => {
      onParamChange?.({
        formatterDescriptors: param.formatterDescriptors.map((formatter) => {
          if (formatter.type === ftType) {
            return { ...formatter, param: newParam };
          } else {
            return formatter;
          }
        }),
      });
    };
    return (
      <div key={ftType} className="GridEditor-FormatterRenderer">
        <Button
          aria-label="remove formatter"
          onClick={() =>
            onParamChange({
              formatterDescriptors: param.formatterDescriptors.filter(
                (formatter) => formatter.type !== ftType
              ),
            })
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
    defaultDescriptor: FieldDefaultDescriptor,
    editor: FieldEditor,
  },
  [VALUE_FORMATTER_TYPE]: {
    defaultDescriptor: ValueFormatterDefaultDescriptor,
    editor: ValueFormatterEditor,
  },
};
export type GRID_EDITOR_MAP_TYPE_KEY = keyof typeof GRID_EDITOR_MAP;

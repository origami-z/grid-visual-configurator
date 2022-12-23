import { createElement } from "react";
import { Menu, Dropdown, Button, MenuProps } from "antd";
import {
  FORMATTER_EDITOR_KEYS,
  FORMATTER_EDITOR_KEY_PREFIX,
  FORMATTER_EDITOR_MAP,
} from "./Formatters";

export const VALUE_FORMATTER_TYPE = "Grid.ValueFormatter" as const;
export interface ValueFormatterComposerParam {
  formatterDescriptors: ValueFormatterDescriptor[];
}
export interface ValueFormatterComposerDescriptor {
  type: typeof VALUE_FORMATTER_TYPE;
  param: ValueFormatterComposerParam;
}
export const ValueFormatterDefaultDescriptor: ValueFormatterComposerDescriptor =
  {
    type: VALUE_FORMATTER_TYPE,
    param: { formatterDescriptors: [] },
  };
export interface ValueFormatterDescriptor {
  type: keyof typeof FORMATTER_EDITOR_MAP;
  param?: any;
}
export const ValueFormatterEditor = ({
  param = { formatterDescriptors: [] },
  onParamChange: onValueFormatterParamChange,
}: {
  param?: ValueFormatterComposerParam;
  onParamChange?: (newParam: ValueFormatterComposerParam) => void;
}) => {
  const handleNewFormatter: MenuProps["onClick"] = (e) => {
    const selectedKey = (FORMATTER_EDITOR_KEY_PREFIX +
      e.key) as keyof typeof FORMATTER_EDITOR_MAP;
    onValueFormatterParamChange?.({
      formatterDescriptors: [
        ...param.formatterDescriptors,
        FORMATTER_EDITOR_MAP[selectedKey].defaultKey,
      ],
    });
  };

  const addFormatterItems = FORMATTER_EDITOR_KEYS.map((k) => ({
    label: k,
    key: k,
    disabled: param.formatterDescriptors.some(
      (f) => f.type === FORMATTER_EDITOR_KEY_PREFIX + k
    ),
  }));

  const menuProps = {
    items: addFormatterItems,
    onClick: handleNewFormatter,
  };

  const formatterRenderers = param.formatterDescriptors.map((f) => {
    const ftType = f.type;
    const onParamChange = (newParam: any) => {
      onValueFormatterParamChange?.({
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
          icon={"x"}
          onClick={() =>
            onValueFormatterParamChange?.({
              formatterDescriptors: param.formatterDescriptors.filter(
                (formatter) => formatter.type !== ftType
              ),
            })
          }
        />
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
        <Dropdown menu={menuProps}>
          <Button icon={"+"} />
        </Dropdown>
      </div>
      {formatterRenderers}
    </div>
  );
};

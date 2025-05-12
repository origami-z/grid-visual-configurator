import { createElement } from "react";
import {
  Menu,
  Button,
  MenuItem,
  MenuTrigger,
  MenuPanel,
  FlexLayout,
  Label,
} from "@salt-ds/core";
import {
  FORMATTER_EDITOR_KEYS,
  FORMATTER_EDITOR_KEY_PREFIX,
  FORMATTER_EDITOR_MAP,
} from "./Formatters";
import { AddIcon, CloseSmallIcon } from "@salt-ds/icons";

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
      <FlexLayout
        gap={0.5}
        align="center"
        key={ftType}
        className="GridEditor-FormatterRenderer"
      >
        <Button
          appearance="transparent"
          aria-label="remove formatter"
          onClick={() =>
            onValueFormatterParamChange?.({
              formatterDescriptors: param.formatterDescriptors.filter(
                (formatter) => formatter.type !== ftType
              ),
            })
          }
        >
          <CloseSmallIcon />
        </Button>
        {createElement(FORMATTER_EDITOR_MAP[ftType].editor as any, {
          param: f.param,
          onParamChange,
        })}
      </FlexLayout>
    );
  });

  return (
    <div>
      <FlexLayout align="center" gap={0.5}>
        <Label>Value Formatter</Label>
        <Menu>
          <MenuTrigger>
            <Button appearance="transparent" aria-label="add value formatter">
              <AddIcon />
            </Button>
          </MenuTrigger>
          <MenuPanel>
            {FORMATTER_EDITOR_KEYS.map((k) => (
              <MenuItem
                key={k}
                disabled={param.formatterDescriptors.some(
                  (f) => f.type === FORMATTER_EDITOR_KEY_PREFIX + k
                )}
                onClick={() => {
                  const selectedKey = (FORMATTER_EDITOR_KEY_PREFIX +
                    k) as keyof typeof FORMATTER_EDITOR_MAP;
                  onValueFormatterParamChange?.({
                    formatterDescriptors: [
                      ...param.formatterDescriptors,
                      FORMATTER_EDITOR_MAP[selectedKey].defaultKey,
                    ],
                  });
                }}
              >
                {k}
              </MenuItem>
            ))}
          </MenuPanel>
        </Menu>
      </FlexLayout>
      {formatterRenderers}
    </div>
  );
};

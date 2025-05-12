import { createElement } from "react";
import {
  Menu,
  Button,
  MenuItem,
  FlexLayout,
  Label,
  MenuTrigger,
  MenuPanel,
} from "@salt-ds/core";
import {
  BoldFontDefaultDescriptor,
  BoldFontEditor,
  BOLD_FONT_TYPE,
  TextColorDefaultDescriptor,
  TextColorEditor,
  TEXT_COLOR_TYPE,
} from "./Stylers";
import { AddIcon, CloseSmallIcon } from "@salt-ds/icons";

export const CELL_STYLER_TYPE = "Grid.CellStyler" as const;
export const CELL_STYLER_EDITOR_KEY_PREFIX = "Grid.CellStyler." as const;

export const STYLER_EDITOR_MAP = {
  [BOLD_FONT_TYPE]: {
    defaultDescriptor: BoldFontDefaultDescriptor,
    editor: BoldFontEditor,
  },
  [TEXT_COLOR_TYPE]: {
    defaultDescriptor: TextColorDefaultDescriptor,
    editor: TextColorEditor,
  },
};
export const STYLER_EDITOR_KEYS = Object.keys(STYLER_EDITOR_MAP).map((e) =>
  e.replace(CELL_STYLER_EDITOR_KEY_PREFIX, "")
);

export interface CellStylerDescriptor {
  type: keyof typeof STYLER_EDITOR_MAP;
  param?: any;
}
export interface CellStylerComposerParam {
  stylerDescriptors: CellStylerDescriptor[];
}
export interface CellStylerComposerDescriptor {
  type: typeof CELL_STYLER_TYPE;
  param: CellStylerComposerParam;
}
export const CellStylerDefaultDescriptor: CellStylerComposerDescriptor = {
  type: CELL_STYLER_TYPE,
  param: { stylerDescriptors: [] },
};

export const CellStylerEditor = ({
  param: cellStylerParam = { stylerDescriptors: [] },
  onParamChange: onCellStylerParamChange,
}: {
  param?: CellStylerComposerParam;
  onParamChange?: (newParam: CellStylerComposerParam) => void;
}) => {
  const handleNewStyler = (selectedKey: keyof typeof STYLER_EDITOR_MAP) => {
    onCellStylerParamChange?.({
      stylerDescriptors: [
        ...cellStylerParam.stylerDescriptors,
        STYLER_EDITOR_MAP[selectedKey].defaultDescriptor,
      ],
    });
  };

  const stylerRenderers = cellStylerParam.stylerDescriptors.map((s) => {
    const stylerType = s.type;
    const onParamChange = (newParam: any) => {
      onCellStylerParamChange?.({
        stylerDescriptors: cellStylerParam.stylerDescriptors.map((styler) => {
          if (styler.type === stylerType) {
            return { ...styler, param: newParam };
          } else {
            return styler;
          }
        }),
      });
    };
    return (
      <FlexLayout
        gap={0.5}
        align="center"
        key={stylerType}
        className="GridEditor-CellStylerRenderer"
      >
        <Button
          aria-label="remove styler"
          onClick={() =>
            onCellStylerParamChange?.({
              stylerDescriptors: cellStylerParam.stylerDescriptors.filter(
                (formatter) => formatter.type !== stylerType
              ),
            })
          }
          appearance="transparent"
        >
          <CloseSmallIcon />
        </Button>
        {createElement(STYLER_EDITOR_MAP[stylerType].editor as any, {
          param: s.param,
          onParamChange,
        })}
      </FlexLayout>
    );
  });

  return (
    <div>
      <FlexLayout gap={0.5} align="center">
        <Label>Cell Styler</Label>
        <Menu>
          <MenuTrigger>
            <Button aria-label="Add cell styler" appearance="transparent">
              <AddIcon />
            </Button>
          </MenuTrigger>
          <MenuPanel>
            {STYLER_EDITOR_KEYS.map((k) => (
              <MenuItem
                key={k}
                disabled={cellStylerParam.stylerDescriptors.some(
                  (f) => f.type === CELL_STYLER_EDITOR_KEY_PREFIX + k
                )}
                onClick={() =>
                  handleNewStyler(
                    (CELL_STYLER_EDITOR_KEY_PREFIX +
                      k) as keyof typeof STYLER_EDITOR_MAP
                  )
                }
              >
                {k}
              </MenuItem>
            ))}
          </MenuPanel>
        </Menu>
      </FlexLayout>
      {stylerRenderers}
    </div>
  );
};

import { createElement } from "react";
import { Menu, Dropdown, Button, MenuProps } from "antd";
import {
  BoldFontDefaultDescriptor,
  BoldFontEditor,
  BOLD_FONT_TYPE,
  TextColorDefaultDescriptor,
  TextColorEditor,
  TEXT_COLOR_TYPE,
} from "./Stylers";

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
  const handleNewStyler: MenuProps["onClick"] = (e) => {
    const selectedKey = (CELL_STYLER_EDITOR_KEY_PREFIX +
      e.key) as keyof typeof STYLER_EDITOR_MAP;
    onCellStylerParamChange?.({
      stylerDescriptors: [
        ...cellStylerParam.stylerDescriptors,
        STYLER_EDITOR_MAP[selectedKey].defaultDescriptor,
      ],
    });
  };

  const addStylerMenu = (
    <Menu onClick={handleNewStyler}>
      {STYLER_EDITOR_KEYS.map((k) => {
        return (
          <Menu.Item
            key={k}
            disabled={cellStylerParam.stylerDescriptors.some(
              (f) => f.type === CELL_STYLER_EDITOR_KEY_PREFIX + k
            )}
          >
            {k}
          </Menu.Item>
        );
      })}
    </Menu>
  );

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
      <div key={stylerType} className="GridEditor-CellStylerRenderer">
        <Button
          aria-label="remove styler"
          icon={"x"}
          onClick={() =>
            onCellStylerParamChange?.({
              stylerDescriptors: cellStylerParam.stylerDescriptors.filter(
                (formatter) => formatter.type !== stylerType
              ),
            })
          }
        />
        {createElement(STYLER_EDITOR_MAP[stylerType].editor as any, {
          param: s.param,
          onParamChange,
        })}
      </div>
    );
  });

  return (
    <div>
      <div>
        Cell Styler
        <Dropdown overlay={addStylerMenu}>
          <Button icon={"+"} />
        </Dropdown>
      </div>
      {stylerRenderers}
    </div>
  );
};

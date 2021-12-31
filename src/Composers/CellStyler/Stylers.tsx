export const BOLD_FONT_TYPE = "Grid.CellStyler.BoldFont" as const;
export const BoldFontDefaultDescriptor = { type: BOLD_FONT_TYPE };
export const BoldFontEditor = () => <div>Bold Font</div>;

export const TEXT_COLOR_TYPE = "Grid.CellStyler.TextColor" as const;
export const TextColorDefaultDescriptor = {
  type: TEXT_COLOR_TYPE,
  param: { color: "#ff0000" },
};
export interface TextColorParam {
  color: string;
}
export const TextColorEditor = (props: {
  param?: TextColorParam;
  onParamChange?: (newValue: TextColorParam) => void;
}) => (
  <div>
    <label>
      Text Color
      <input
        type="color"
        value={props.param?.color}
        onChange={(e) =>
          props.onParamChange?.({ color: e.currentTarget.value })
        }
      />
    </label>
  </div>
);

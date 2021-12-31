import { InputNumber } from "antd";

export const DIVIDE_BY_THOUSAND_TYPE =
  "Grid.ValueFormatter.DivideByThousand" as const;
export const DivideByThousandEditor = () => <div>Divide by 1e3</div>;

export const FIXED_DECIMAL_PLACES_TYPE =
  "Grid.ValueFormatter.FixedDecimalPlaces" as const;
export interface FixedDecimalPlacesParam {
  dp: number;
}

export const FixedDecimalPlacesEditor = (props: {
  param?: FixedDecimalPlacesParam;
  onParamChange?: (newParam: FixedDecimalPlacesParam) => void;
}) => {
  return (
    <div>
      <label>
        Decimal Places
        <InputNumber
          value={props.param?.dp}
          onChange={(newValue) => props.onParamChange?.({ dp: newValue })}
        />
      </label>
    </div>
  );
};

export const SUFFIX_BY_TYPE = "Grid.ValueFormatter.SuffixBy" as const;
export interface SuffixByParam {
  suffix: string;
}
export const SuffixByEditor = (props: {
  param?: SuffixByParam;
  onParamChange?: (newValue: SuffixByParam) => void;
}) => (
  <div>
    <label>
      Suffix
      <input
        value={props.param?.suffix}
        onChange={(e) =>
          props.onParamChange?.({ suffix: e.currentTarget.value })
        }
      />
    </label>
  </div>
);

export const FORMATTER_EDITOR_MAP = {
  [DIVIDE_BY_THOUSAND_TYPE]: {
    defaultKey: { type: DIVIDE_BY_THOUSAND_TYPE },
    editor: DivideByThousandEditor,
  },
  [FIXED_DECIMAL_PLACES_TYPE]: {
    defaultKey: { type: FIXED_DECIMAL_PLACES_TYPE, param: { dp: 2 } },
    editor: FixedDecimalPlacesEditor,
  },
  [SUFFIX_BY_TYPE]: {
    defaultKey: { type: SUFFIX_BY_TYPE, param: { suffix: " k" } },
    editor: SuffixByEditor,
  },
};

export const FORMATTER_EDITOR_KEY_PREFIX = "Grid.ValueFormatter." as const;

export const FORMATTER_EDITOR_KEYS = Object.keys(FORMATTER_EDITOR_MAP).map(
  (e) => e.replace(FORMATTER_EDITOR_KEY_PREFIX, "")
);

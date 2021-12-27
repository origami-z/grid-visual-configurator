export const DIVIDE_BY_THOUSAND_TYPE =
  "Grid.ValueFormatter.DivideByThousand" as const;
export const divideByThousandConverter = () => (input: string) =>
  Number.parseFloat(input) / 1e3;
export const DivideByThousandEditor = () => <div>Divide by 1e3</div>;

export const FIXED_DECIMAL_PLACES_TYPE =
  "Grid.ValueFormatter.FixedDecimalPlaces" as const;
export interface FixedDecimalPlacesParam {
  dp: number;
}
export const fixedDecimalPlacesConverter =
  (param: FixedDecimalPlacesParam) => (input: string) =>
    Number.parseFloat(input).toFixed(param.dp);
export const FixedDecimalPlacesEditor = (props: {
  param?: FixedDecimalPlacesParam;
  onParamChange?: (newParam: FixedDecimalPlacesParam) => void;
}) => {
  return (
    <div>
      <label>
        Decimal Places
        <input
          value={props.param?.dp}
          type="number"
          onChange={(e) =>
            props.onParamChange?.({
              dp: Number.parseInt(e.currentTarget.value),
            })
          }
        />
      </label>
    </div>
  );
};

export const SUFFIX_BY_TYPE = "Grid.ValueFormatter.SuffixBy" as const;
export interface SuffixByParam {
  suffix: string;
}
export const suffixByConverter = (param: SuffixByParam) => (input: string) =>
  input.toString() + param.suffix;
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
    converter: divideByThousandConverter,
  },
  [FIXED_DECIMAL_PLACES_TYPE]: {
    defaultKey: { type: FIXED_DECIMAL_PLACES_TYPE, param: { dp: 2 } },
    editor: FixedDecimalPlacesEditor,
    converter: fixedDecimalPlacesConverter,
  },
  [SUFFIX_BY_TYPE]: {
    defaultKey: { type: SUFFIX_BY_TYPE, param: { suffix: " k" } },
    editor: SuffixByEditor,
    converter: suffixByConverter,
  },
};

export const FORMATTER_EDITOR_KEY_PREFIX = "Grid.ValueFormatter." as const;

export const FORMATTER_EDITOR_KEYS = Object.keys(FORMATTER_EDITOR_MAP).map(
  (e) => e.replace(FORMATTER_EDITOR_KEY_PREFIX, "")
);

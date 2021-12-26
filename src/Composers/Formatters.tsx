export const DIVIDE_BY_THOUSAND_TYPE =
  "Grid.ValueFormatter.DivideByThousand" as const;
export const divideByThousandConverter = () => (input: string) =>
  Number.parseFloat(input) / 1e3;
export const DivideByThousandEditor = () => <div>Divide by 1e3</div>;

export const FIXED_DECIMAL_PLACES_TYPE =
  "Grid.ValueFormatter.FixedDecimalPlaces" as const;
export const fixedDecimalPlacesConverter =
  (params: { dp: number }) => (input: string) =>
    Number.parseFloat(input).toFixed(params.dp);
export const FixedDecimalPlacesEditor = (props: {
  dp?: number;
  onChange?: (newValue: { dp: number }) => void;
}) => {
  return (
    <div>
      <label>
        Decimal Places
        <input
          value={props.dp}
          type="number"
          onChange={(e) =>
            props.onChange?.({ dp: Number.parseInt(e.currentTarget.value) })
          }
        />
      </label>
    </div>
  );
};

export const SUFFIX_BY_K_TYPE = "Grid.ValueFormatter.SuffixByK" as const;
export const suffixByKConverter =
  (params: { suffix: string }) => (input: string) =>
    input.toString() + params.suffix;
export const SuffixByKEditor = (props: {
  suffix?: string;
  onChange?: (newValue: { suffix: string }) => void;
}) => (
  <div>
    <label>
      Suffix
      <input
        value={props.suffix}
        onChange={(e) => props.onChange?.({ suffix: e.currentTarget.value })}
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
    defaultKey: { type: FIXED_DECIMAL_PLACES_TYPE, params: { dp: 2 } },
    editor: FixedDecimalPlacesEditor,
    converter: fixedDecimalPlacesConverter,
  },
  [SUFFIX_BY_K_TYPE]: {
    defaultKey: { type: SUFFIX_BY_K_TYPE, params: { suffix: "k" } },
    editor: SuffixByKEditor,
    converter: suffixByKConverter,
  },
};

export const FORMATTER_EDITOR_KEY_PREFIX = "Grid.ValueFormatter." as const;

export const FORMATTER_EDITOR_KEYS = Object.keys(FORMATTER_EDITOR_MAP).map(
  (e) => e.replace(FORMATTER_EDITOR_KEY_PREFIX, "")
);

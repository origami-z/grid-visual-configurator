import {
  divideByThousand,
  DIVIDE_BY_THOUSAND_TYPE,
  fixedDecimalPlaces,
  FIXED_DECIMAL_PLACES_TYPE,
  suffixByK,
  SUFFIX_BY_K_TYPE,
} from "./Formatter";

export const DivideByThousandEditor = () => <div>Divide by 1e3</div>;

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

export const SuffixByKEditor = () => <div>Suffix K</div>;

export const FORMATTER_EDITOR_MAP = {
  [DIVIDE_BY_THOUSAND_TYPE]: {
    defaultKey: { type: DIVIDE_BY_THOUSAND_TYPE },
    editor: DivideByThousandEditor,
    converter: divideByThousand,
  },
  [FIXED_DECIMAL_PLACES_TYPE]: {
    defaultKey: { type: FIXED_DECIMAL_PLACES_TYPE, params: { dp: 2 } },
    editor: FixedDecimalPlacesEditor,
    converter: fixedDecimalPlaces,
  },
  [SUFFIX_BY_K_TYPE]: {
    defaultKey: { type: SUFFIX_BY_K_TYPE },
    editor: SuffixByKEditor,
    converter: suffixByK,
  },
};

export const FORMATTER_EDITOR_KEY_PREFIX = "Grid.ValueFormatter." as const;

export const FORMATTER_EDITOR_KEYS = Object.keys(FORMATTER_EDITOR_MAP).map(
  (e) => e.replace(FORMATTER_EDITOR_KEY_PREFIX, "")
);

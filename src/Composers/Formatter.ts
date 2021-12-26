export const DIVIDE_BY_THOUSAND_TYPE = 'Grid.ValueFormatter.DivideByThousand' as const;
export const divideByThousand = () => (input: string) => Number.parseFloat(input) / 1e3;

export const FIXED_DECIMAL_PLACES_TYPE = 'Grid.ValueFormatter.FixedDecimalPlaces' as const;
export const fixedDecimalPlaces = (params: { dp: number }) => (input: string) => Number.parseFloat(input).toFixed(params.dp);

export const SUFFIX_BY_K_TYPE = 'Grid.ValueFormatter.SuffixByK' as const;
export const suffixByK = () => (input: string) => (input.toString() + "k");


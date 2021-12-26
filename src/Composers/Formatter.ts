export const divideByThousand = (input: number) => input / 1e3;

export const fixedDecimalPlaces = (input: number, dp: number) => input.toFixed(dp);

export const suffixByK = (input: string | number) => (input.toString() + "k");
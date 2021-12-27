export const FIELD_TYPE = "Grid.Field" as const;
export interface FieldComposerParam {
  field?: string;
}
export interface FieldComposerDescriptor {
  type: typeof FIELD_TYPE;
  param: FieldComposerParam;
}
export const FieldDefaultDescriptor: FieldComposerDescriptor = {
  type: FIELD_TYPE,
  param: { field: "" },
};
export const FieldEditor = (props: {
  param?: FieldComposerParam;
  onParamChange?: (newParam: FieldComposerParam) => void;
}) => {
  return (
    <div>
      <label>
        Field
        <input
          value={props.param?.field}
          onChange={(e) =>
            props.onParamChange?.({ field: e.currentTarget.value })
          }
        />
      </label>
    </div>
  );
};

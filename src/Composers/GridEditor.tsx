import { FIELD_TYPE } from "./Grid";

export const FieldEditor = (props: {
  field?: string;
  onFieldChange?: (newField: string) => void;
}) => {
  return (
    <div>
      <label>
        Field
        <input
          value={props.field}
          onChange={(e) => props.onFieldChange?.(e.currentTarget.value)}
        />
      </label>
    </div>
  );
};

export const GRID_EDITOR_MAP = {
  [FIELD_TYPE]: FieldEditor,
};

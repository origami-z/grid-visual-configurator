import { useContext } from "react";
import { DataFieldsContext } from "../../DataFieldsContext";

import { ComboBox } from "@salt-ds/lab";

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
  const dataFields = useContext(DataFieldsContext);
  const fieldValue = props.param?.field;
  // const selectOptions = dataFields.map((d) => ({ value: d, label: d }));
  // console.log({ selectOptions });
  const inputRenderer =
    dataFields.length === 0 ? (
      // Default or data error
      <input
        value={props.param?.field}
        onChange={(e) =>
          props.onParamChange?.({ field: e.currentTarget.value })
        }
      />
    ) : (
      // Not great experience when first focus will only show 1 matching option
      <ComboBox
        value={fieldValue ? fieldValue : undefined}
        onSelectionChange={(e, item) =>
          item && props.onParamChange?.({ field: item })
        }
        style={{ width: 100 }}
        placeholder="Search"
        source={dataFields}
      />
    );
  return (
    <div>
      <label>
        Field
        {inputRenderer}
      </label>
    </div>
  );
};

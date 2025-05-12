import { useContext } from "react";
import { DataFieldsContext } from "../../DataFieldsContext";
import { FlexLayout, ComboBox, Option } from "@salt-ds/core";

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
      <ComboBox
        bordered
        value={fieldValue ? fieldValue : undefined}
        selected={fieldValue ? [fieldValue] : undefined}
        onSelectionChange={(e, [newSelected]) =>
          props.onParamChange?.({ field: newSelected })
        }
        style={{ width: 100 }}
        placeholder="Search"
      >
        {dataFields.map((d) => (
          <Option value={d} key={d}>
            {d}
          </Option>
        ))}
      </ComboBox>
    );
  return (
    <div>
      <label>
        <FlexLayout gap={0.5} align="center">
          Field
          {inputRenderer}
        </FlexLayout>
      </label>
    </div>
  );
};

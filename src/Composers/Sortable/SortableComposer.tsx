import { Switch } from "antd";

export const SORTABLE_TYPE = "Grid.Sortable" as const;
export interface SortableComposerParam {
  sortable?: boolean;
}
export interface SortableComposerDescriptor {
  type: typeof SORTABLE_TYPE;
  param: SortableComposerParam;
}
export const SortableDefaultDescriptor: SortableComposerDescriptor = {
  type: SORTABLE_TYPE,
  param: { sortable: true },
};
export const SortableEditor = (props: {
  param?: SortableComposerParam;
  onParamChange?: (newParam: SortableComposerParam) => void;
}) => {
  return (
    <div>
      <label>
        Sortable
        <Switch
          checked={props.param?.sortable}
          onChange={(checked) => props.onParamChange?.({ sortable: checked })}
        />
      </label>
    </div>
  );
};

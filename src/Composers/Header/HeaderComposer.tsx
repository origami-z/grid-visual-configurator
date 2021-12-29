export const HEADER_NAME_TYPE = "Grid.HeaderName" as const;
export interface HeaderNameComposerParam {
  headerName?: string;
}
export interface HeaderNameComposerDescriptor {
  type: typeof HEADER_NAME_TYPE;
  param: HeaderNameComposerParam;
}
export const HeaderNameDefaultDescriptor: HeaderNameComposerDescriptor = {
  type: HEADER_NAME_TYPE,
  param: { headerName: "Custom" },
};
export const HeaderNameEditor = (props: {
  param?: HeaderNameComposerParam;
  onParamChange?: (newParam: HeaderNameComposerParam) => void;
}) => {
  return (
    <div>
      <label>
        Header
        <input
          value={props.param?.headerName}
          onChange={(e) =>
            props.onParamChange?.({ headerName: e.currentTarget.value })
          }
        />
      </label>
    </div>
  );
};

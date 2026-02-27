import { Radio } from "antd";
import { useMemo, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import "./App.css";
import { ColDescriptorEditor } from "./ColDescriptorEditor";
import {
  BOLD_FONT_TYPE,
  CELL_STYLER_TYPE,
  FIELD_TYPE,
  GenericColDescriptor,
  SORTABLE_TYPE,
} from "./Composers";
import { DataInput } from "./DataInput";
import { AgGridPreview } from "./GridPreview/AgGridPreview";
import { AntdTablePreview } from "./GridPreview/AntdTablePreview";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const defaultColDescriptor: GenericColDescriptor[] = [
  [{ type: FIELD_TYPE, param: { field: "make" } }],
  [{ type: FIELD_TYPE, param: { field: "model" } }],
  [
    {
      type: FIELD_TYPE,
      param: {
        field: "price",
      },
    },
    {
      type: SORTABLE_TYPE,
      param: {
        sortable: false,
      },
    },
    {
      type: CELL_STYLER_TYPE,
      param: {
        stylerDescriptors: [
          {
            type: BOLD_FONT_TYPE,
          },
        ],
      },
    },
  ],
];

const gridPreviewOptions = ["ag-grid", "antd table"];

const getFieldsFromData = (data: any[]) => {
  const allFields = new Set<string>();
  data.forEach((rowData) => {
    Object.keys(rowData).forEach((r) => allFields.add(r));
  });
  return Array.from(allFields);
};

function App() {
  const [rowData, setRowData] = useState<any[] | null>([]);
  const [colDescriptors, setColDescriptors] =
    useState<GenericColDescriptor[]>(defaultColDescriptor);
  const [previewOpt, setPreviewOpt] = useState(gridPreviewOptions[0]);
  const dataFields = useMemo(() => getFieldsFromData(rowData || []), [rowData]);
  const previewGrid =
    previewOpt === "ag-grid" ? (
      <AgGridPreview rowData={rowData} colDescriptors={colDescriptors} />
    ) : (
      <AntdTablePreview rowData={rowData} colDescriptors={colDescriptors} />
    );
  return (
    <div className="App">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70}>
              <ColDescriptorEditor
                colDescriptors={colDescriptors}
                setColDescriptors={setColDescriptors}
                dataFields={dataFields}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <DataInput onDataChanged={setRowData} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={50}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70}>{previewGrid}</Panel>
            <PanelResizeHandle />
            <Panel>
              <label htmlFor="grid-preview-radio-group-id">
                Grid preview:{" "}
              </label>
              <Radio.Group
                id="grid-preview-radio-group-id"
                options={gridPreviewOptions}
                onChange={(e) => setPreviewOpt(e.target.value)}
                value={previewOpt}
              />
              <div>Debug Column Descriptors</div>
              <JsonView data={colDescriptors} shouldExpandNode={allExpanded} style={defaultStyles} />
              {/* <div>{JSON.stringify(colDescriptors)}</div> */}
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;

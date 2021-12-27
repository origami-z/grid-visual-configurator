import { Radio } from "antd";
import { useState } from "react";
import "./App.css";
import { ColDefEditor } from "./ColDefEditor";
import {
  FIELD_TYPE,
  GenericColDescriptor,
  GRID_EDITOR_MAP_TYPE_KEY,
} from "./Composers/GridEditor";
import { DataInput } from "./DataInput";
import { AgGridPreview } from "./GridPreview/AgGridPreview";
import { AntdTablePreview } from "./GridPreview/AntdTablePreview";

const defaultColDescriptor: GenericColDescriptor[] = [
  [{ type: FIELD_TYPE, param: { field: "make" } }],
  [{ type: FIELD_TYPE, param: { field: "model" } }],
  [{ type: FIELD_TYPE, param: { field: "price" } }],
];

const gridPreviewOptions = ["ag-grid", "antd table"];

function App() {
  const [rowData, setRowData] = useState<any[] | null>([]);
  const [colDescriptors, setColDescriptors] =
    useState<GenericColDescriptor[]>(defaultColDescriptor);
  const [previewOpt, setPreviewOpt] = useState(gridPreviewOptions[0]);
  const previewGrid =
    previewOpt === "ag-grid" ? (
      <AgGridPreview rowData={rowData} colDescriptors={colDescriptors} />
    ) : (
      <AntdTablePreview rowData={rowData} colDescriptors={colDescriptors} />
    );
  return (
    <div className="App">
      <div className="LeftColumn">
        <div className="LeftColumn-TopPanel">
          <ColDefEditor
            colDescriptors={colDescriptors}
            setColDescriptors={setColDescriptors}
          />
        </div>
        <div className="LeftColumn-BottomPanel">
          <DataInput onDataChanged={setRowData} />
        </div>
      </div>
      <div className="RightColumn">
        <div className="RightColumn-TopPanel">{previewGrid}</div>
        <div className="RightColumn-BottomPanel">
          <Radio.Group
            aria-label="grid preview"
            options={gridPreviewOptions}
            onChange={(e) => setPreviewOpt(e.target.value)}
            value={previewOpt}
          />
          <div>{JSON.stringify(colDescriptors)}</div>
        </div>
      </div>
    </div>
  );
}

export default App;

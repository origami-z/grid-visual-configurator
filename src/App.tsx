import { RadioButtonGroup, RadioButton } from "@salt-ds/lab";
import { Button, SaltProvider } from "@salt-ds/core";

import { useMemo, useState } from "react";
import ReactJson from "react-json-view";
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
    <SaltProvider applyClassesTo="root">
      <div className="App">
        <div className="LeftColumn">
          <div className="LeftColumn-TopPanel">
            <ColDescriptorEditor
              colDescriptors={colDescriptors}
              setColDescriptors={setColDescriptors}
              dataFields={dataFields}
            />
          </div>
          <div className="LeftColumn-BottomPanel">
            <DataInput onDataChanged={setRowData} />
          </div>
        </div>
        <div className="RightColumn">
          <div className="RightColumn-TopPanel">{previewGrid}</div>
          <div className="RightColumn-BottomPanel">
            {/* <label htmlFor="grid-preview-radio-group-id">Grid preview: </label> */}
            {/* <Radio.Group
              id="grid-preview-radio-group-id"
              options={gridPreviewOptions}
              onChange={(e) => setPreviewOpt(e.target.value)}
              value={previewOpt}
            /> */}

            <RadioButtonGroup
              legend={"Grid preview"}
              name={"Name"}
              row
              onChange={(e) => setPreviewOpt(e.currentTarget.value)}
            >
              {gridPreviewOptions.map((opt) => (
                <RadioButton
                  key={opt}
                  label={opt}
                  value={opt}
                  checked={opt === previewOpt}
                />
              ))}
            </RadioButtonGroup>
            <div>Debug Column Descriptors</div>
            <ReactJson src={colDescriptors} />
            {/* <div>{JSON.stringify(colDescriptors)}</div> */}
          </div>
        </div>
      </div>
    </SaltProvider>
  );
}

export default App;

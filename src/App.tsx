import { useState } from "react";
import "./App.css";
import { ColDefEditor } from "./ColDefEditor";
import {
  FIELD_TYPE,
  GenericColDescriptor,
  GRID_EDITOR_MAP_TYPE_KEY,
} from "./Composers/GridEditor";
import { DataInput } from "./DataInput";
import { GridResult } from "./GridResult";

const defaultColDescriptor: GenericColDescriptor[] = [
  [{ type: FIELD_TYPE, param: { field: "make" } }],
  [{ type: FIELD_TYPE, param: { field: "model" } }],
  [{ type: FIELD_TYPE, param: { field: "price" } }],
];

function App() {
  const [rowData, setRowData] = useState<any[] | null>([]);
  const [colDescriptors, setColDescriptors] =
    useState<GenericColDescriptor[]>(defaultColDescriptor);
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
        <GridResult rowData={rowData} colDescriptors={colDescriptors} />
      </div>
    </div>
  );
}

export default App;

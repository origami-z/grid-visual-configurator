import { useState } from "react";
import "./App.css";
import { ColDefEditor } from "./ColDefEditor";
import { DataInput } from "./DataInput";
import { GridResult } from "./GridResult";

function App() {
  const [rowData, setRowData] = useState<any[] | null>([]);
  const [columnDefs, setColumnDefs] = useState<any[] | null>([]);
  return (
    <div className="App">
      <div className="LeftColumn">
        <div className="LeftColumn-TopPanel">
          <ColDefEditor onColDefsChange={setColumnDefs} />
        </div>
        <div className="LeftColumn-BottomPanel">
          <DataInput onDataChanged={setRowData} />
        </div>
      </div>
      <div className="RightColumn">
        <GridResult rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
}

export default App;

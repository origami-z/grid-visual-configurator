import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

export const GridResult = (props: {
  rowData?: any[] | null;
  columnDefs?: any[] | null;
}) => {
  // const columnDefs: ColDef[] = [
  //   {
  //     field: "make",
  //   },
  //   {
  //     field: "model",
  //   },
  //   {
  //     field: "price",
  //   },
  // ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact columnDefs={props.columnDefs} rowData={props.rowData} />
    </div>
  );
};

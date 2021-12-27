import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { GenericColDescriptor, GRID_EDITOR_MAP } from "./Composers/GridEditor";

export const GridResult = (props: {
  rowData?: any[] | null;
  colDescriptors?: GenericColDescriptor[];
}) => {
  // compute colDef when value in editors change
  const colDefFromColDescriptors = props.colDescriptors?.map(
    (colDescriptor, index) => {
      let result: any = {};
      colDescriptor.map((composer) => {
        result = GRID_EDITOR_MAP[composer.type].composer(
          result,
          composer.param
        );
      });
      return result;
    }
  );

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        columnDefs={colDefFromColDescriptors}
        rowData={props.rowData}
        reactUi
      />
    </div>
  );
};

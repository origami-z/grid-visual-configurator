import { useState, createElement, useEffect } from "react";

import "./ColDefEditor.css";
import { FIELD_TYPE, GRID_COMPOSER_MAP } from "./Composers/Grid";
import { GRID_EDITOR_MAP } from "./Composers/GridEditor";

const defaultColDefs = [
  [{ type: FIELD_TYPE, field: "make" }],
  [{ type: FIELD_TYPE, field: "model" }],
  [{ type: FIELD_TYPE, field: "price" }],
];

export const ColDefEditor = (props: {
  onColDefsChange?: (newColDefs: any[]) => void;
}) => {
  const [colDefs, setColDefs] = useState<any[]>(defaultColDefs);

  useEffect(() => {
    // compute colDef
    const newComputedColDef = colDefs.map((colDef) => {
      let result = {};
      colDef.map((composer) => {
        switch (composer.type) {
          case FIELD_TYPE:
            // const fieldComposer = composer as  ;
            result = GRID_COMPOSER_MAP[FIELD_TYPE](result, composer.field);
          default:
          // do nothing
        }
      });
      return result;
    });

    console.log({ newComputedColDef });
    props.onColDefsChange?.(newComputedColDef);
  }, [colDefs]);

  const columnsToRender = colDefs.map((colDef, columnIndex) => (
    <div key={columnIndex}>
      <div>Column {columnIndex + 1}</div>
      {colDef.map((composer, composerIndex) => {
        switch (composer.type) {
          case FIELD_TYPE:
            const onFieldChange = (newField: string) => {
              setColDefs((prevColDefs) =>
                prevColDefs.map((prevColDef, prevColDefIndex) => {
                  if (prevColDefIndex === columnIndex) {
                    const newColDef = [...prevColDef];
                    newColDef[composerIndex].field = newField;
                    return newColDef;
                  } else {
                    return prevColDef;
                  }
                })
              );
            };
            return createElement(GRID_EDITOR_MAP[FIELD_TYPE], {
              ...composer,
              key: `column-${columnIndex}-editor-${composerIndex}`,
              onFieldChange,
            });
          default:
            return null;
        }
      })}
      <button>+</button>
    </div>
  ));
  return <div className="ColDefEditor">{columnsToRender}</div>;
};

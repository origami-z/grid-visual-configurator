import { useState, createElement, useEffect } from "react";
import { Menu, Dropdown, Button, MenuProps } from "antd";

import "./ColDefEditor.css";
import {
  FIELD_TYPE,
  GRID_COMPOSER_MAP,
  VALUE_FORMATTER_TYPE,
} from "./Composers/Grid";
import {
  DefaultFieldComposer,
  DefaultValueFormatterComposer,
  GRID_EDITOR_MAP,
} from "./Composers/GridEditor";

export interface GenericFieldComposer {
  type: string;
  [key: string]: any;
}

export type GenericColDef = GenericFieldComposer[];

const defaultColDefs: GenericColDef[] = [
  [{ type: FIELD_TYPE, field: "make" }],
  [{ type: FIELD_TYPE, field: "model" }],
  [{ type: FIELD_TYPE, field: "price" }],
];

export const ColDefEditor = (props: {
  onColDefsChange?: (newColDefs: any[]) => void;
}) => {
  const [colDefs, setColDefs] = useState(defaultColDefs);

  useEffect(() => {
    // compute colDef when value in editors change
    const newComputedColDef = colDefs.map((colDef) => {
      let result = {};
      colDef.map((composer) => {
        switch (composer.type) {
          case FIELD_TYPE:
            // const fieldComposer = composer as  ;
            result = GRID_COMPOSER_MAP[composer.type](result, composer.field);
            break;
          case VALUE_FORMATTER_TYPE:
            result = GRID_COMPOSER_MAP[composer.type](
              result,
              composer.formatter
            );
            break;
          default:
          // do nothing
        }
      });
      return result;
    });

    console.log({ newComputedColDef });
    props.onColDefsChange?.(newComputedColDef);
  }, [colDefs]);

  const columnsToRender = colDefs.map((colDef, columnIndex) => {
    const handleNewComposer: MenuProps["onClick"] = (e) => {
      const selectedKey = e.key;
      switch (selectedKey) {
        case FIELD_TYPE:
          setColDefs((prevColDefs) =>
            prevColDefs.map((prevColDef, prevColDefIndex) => {
              if (
                prevColDefIndex === columnIndex &&
                !prevColDef.some((c) => c.type === selectedKey)
              ) {
                return [...prevColDef, DefaultFieldComposer];
              } else {
                return prevColDef;
              }
            })
          );
          break;
        case VALUE_FORMATTER_TYPE:
          setColDefs((prevColDefs) =>
            prevColDefs.map((prevColDef, prevColDefIndex) => {
              if (
                prevColDefIndex === columnIndex &&
                !prevColDef.some((c) => c.type === selectedKey)
              ) {
                return [...prevColDef, DefaultValueFormatterComposer];
              } else {
                return prevColDef;
              }
            })
          );
          break;
        default:
          console.warn("Unrecognized composer type", selectedKey);
      }
    };

    const addComposerMenu = (
      <Menu onClick={handleNewComposer}>
        {Object.keys(GRID_COMPOSER_MAP).map((k) => (
          <Menu.Item key={k} disabled={colDef.some((c) => c.type === k)}>
            {k}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
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
              return createElement(GRID_EDITOR_MAP[composer.type], {
                ...composer,
                key: `column-${columnIndex}-editor-${composerIndex}`,
                onFieldChange,
              });
            case VALUE_FORMATTER_TYPE:
              const onFormatterChange = (newFormatter: (value: any) => any) => {
                setColDefs((prevColDefs) =>
                  prevColDefs.map((prevColDef, prevColDefIndex) => {
                    if (prevColDefIndex === columnIndex) {
                      const newColDef = [...prevColDef];
                      newColDef[composerIndex].formatter = newFormatter;
                      return newColDef;
                    } else {
                      return prevColDef;
                    }
                  })
                );
              };
              return createElement(GRID_EDITOR_MAP[composer.type], {
                ...composer,
                key: `column-${columnIndex}-editor-${composerIndex}`,
                onFormatterChange,
              });
            default:
              return null;
          }
        })}

        <Dropdown
          overlay={addComposerMenu}
          // onVisibleChange={this.handleVisibleChange}
          // visible={this.state.visible}
        >
          <Button>Add +</Button>
        </Dropdown>
      </div>
    );
  });
  return <div className="ColDefEditor">{columnsToRender}</div>;
};

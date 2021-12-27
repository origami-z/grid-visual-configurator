import { Button, Dropdown, Menu, MenuProps } from "antd";
import { createElement, useEffect, useState } from "react";
import "./ColDefEditor.css";
import {
  FIELD_TYPE,
  GRID_EDITOR_MAP,
  GRID_EDITOR_MAP_TYPE_KEY,
  VALUE_FORMATTER_TYPE,
} from "./Composers/GridEditor";

export interface GenericFieldComposer {
  type: GRID_EDITOR_MAP_TYPE_KEY;
  param?: any;
}

export type GenericColDescriptor = GenericFieldComposer[];

const defaultColDefs: GenericColDescriptor[] = [
  [{ type: FIELD_TYPE, param: { field: "make" } }],
  [{ type: FIELD_TYPE, param: { field: "model" } }],
  [{ type: FIELD_TYPE, param: { field: "price" } }],
];

export const ColDefEditor = (props: {
  onColDefsChange?: (newColDefs: any[]) => void;
}) => {
  const [colDescriptors, setColDescriptors] = useState(defaultColDefs);

  useEffect(() => {
    // compute colDef when value in editors change
    const newComputedColDef = colDescriptors.map((colDef, colDefIndex) => {
      let result: any = {};
      colDef.map((composer) => {
        result = GRID_EDITOR_MAP[composer.type].composer(
          result,
          composer.param
        );
      });
      return result;
    });
    props.onColDefsChange?.(newComputedColDef);
  }, [colDescriptors]);

  const columnsToRender = colDescriptors.map((colDescriptor, colIndex) => {
    const handleNewComposer: MenuProps["onClick"] = (e) => {
      const selectedKey = e.key as GRID_EDITOR_MAP_TYPE_KEY;

      setColDescriptors((prevColDescriptors) =>
        prevColDescriptors.map((prevColDescriptor, prevColIndex) => {
          if (
            prevColIndex === colIndex &&
            !prevColDescriptor.some((c) => c.type === selectedKey)
          ) {
            return [
              ...prevColDescriptor,
              GRID_EDITOR_MAP[selectedKey].defaultDescriptor,
            ];
          } else {
            return prevColDescriptor;
          }
        })
      );
    };

    const addComposerMenu = (
      <Menu onClick={handleNewComposer}>
        {Object.keys(GRID_EDITOR_MAP).map((k) => (
          <Menu.Item key={k} disabled={colDescriptor.some((c) => c.type === k)}>
            {k}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div key={colIndex}>
        <div>Column {colIndex + 1}</div>
        {colDescriptor.map((composer, composerIndex) => {
          const key = `column-${colIndex}-editor-${composerIndex}`;

          const onParamChange = (newParam: any) => {
            setColDescriptors((prevColDefs) =>
              prevColDefs.map((prevColDef, prevColDefIndex) => {
                if (prevColDefIndex === colIndex) {
                  const newColDef = prevColDef.map(
                    (prevComp, prevCompIndex) => {
                      if (prevCompIndex === composerIndex) {
                        return {
                          ...prevComp,
                          param: newParam,
                        };
                      } else {
                        return prevComp;
                      }
                    }
                  );
                  return newColDef;
                } else {
                  return prevColDef;
                }
              })
            );
          };
          return createElement(GRID_EDITOR_MAP[composer.type].editor as any, {
            key,
            param: composer.param,
            onParamChange,
          });
        })}

        <Dropdown overlay={addComposerMenu}>
          <Button>Add +</Button>
        </Dropdown>
      </div>
    );
  });
  return <div className="ColDefEditor">{columnsToRender}</div>;
};

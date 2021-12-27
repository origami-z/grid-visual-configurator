import { Button, Dropdown, Menu, MenuProps } from "antd";
import { createElement, Dispatch, SetStateAction } from "react";
import "./ColDefEditor.css";
import {
  GenericColDescriptor,
  GRID_EDITOR_MAP,
  GRID_EDITOR_MAP_TYPE_KEY,
} from "./Composers";

export const ColDefEditor = ({
  colDescriptors,
  setColDescriptors,
}: {
  colDescriptors: GenericColDescriptor[];
  setColDescriptors: Dispatch<SetStateAction<GenericColDescriptor[]>>;
}) => {
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

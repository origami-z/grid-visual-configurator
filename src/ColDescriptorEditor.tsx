import { Button, Dropdown, Menu, MenuProps } from "antd";
import { createElement, Dispatch, SetStateAction } from "react";
import "./ColDescriptorEditor.css";
import {
  FieldDefaultDescriptor,
  GenericColDescriptor,
  GRID_EDITOR_MAP,
  GRID_EDITOR_MAP_TYPE_KEY,
} from "./Composers";
import { DataFieldsContext } from "./DataFieldsContext";

export const ColDescriptorEditor = ({
  colDescriptors,
  setColDescriptors,
  dataFields,
}: {
  colDescriptors: GenericColDescriptor[];
  setColDescriptors: Dispatch<SetStateAction<GenericColDescriptor[]>>;
  dataFields: string[];
}) => {
  const addNewColumn = () => {
    setColDescriptors((prevColDescriptor) => [
      ...prevColDescriptor,
      [FieldDefaultDescriptor],
    ]);
  };

  const removeColumnAtIndex = (indexToRemove: number) => {
    setColDescriptors((prevColDescriptors) => {
      const newColDescriptors = prevColDescriptors.slice();
      newColDescriptors.splice(indexToRemove, 1);
      return newColDescriptors;
    });
  };

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
      <div key={colIndex} className="ColDescriptorEditor-Column">
        <div className="ColDescriptorEditor-ColumnHeader">
          <div>Column {colIndex + 1}</div>
          <Button icon={"x"} onClick={() => removeColumnAtIndex(colIndex)} />
        </div>
        {colDescriptor.map((composer, composerIndex) => {
          const key = `column-${colIndex}-editor-${composerIndex}`;

          const onParamChange = (newParam: any) => {
            setColDescriptors((preColDescriptors) =>
              preColDescriptors.map(
                (prevColDescriptor, prevColDescriptorIndex) => {
                  if (prevColDescriptorIndex === colIndex) {
                    const newColDef = prevColDescriptor.map(
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
                    return prevColDescriptor;
                  }
                }
              )
            );
          };
          const descriptorEditor = createElement(
            GRID_EDITOR_MAP[composer.type].editor as any,
            {
              key,
              param: composer.param,
              onParamChange,
            }
          );

          const removeDescriptor = () => {
            setColDescriptors((prevColDescriptors) =>
              prevColDescriptors.map((prevDescriptor, prevDescriptorIndex) => {
                if (prevDescriptorIndex === colIndex) {
                  const newColDescriptor = prevDescriptor.slice();
                  newColDescriptor.splice(composerIndex, 1);
                  return newColDescriptor;
                } else {
                  return prevDescriptor;
                }
              })
            );
          };

          return (
            <div
              className="ColDescriptorEditor-ColumnRow"
              key={`${key}-container`}
            >
              <Button
                icon={"x"}
                onClick={removeDescriptor}
                aria-label="remove composer"
              />{" "}
              {descriptorEditor}
            </div>
          );
        })}

        <Dropdown overlay={addComposerMenu}>
          <Button>Add +</Button>
        </Dropdown>
      </div>
    );
  });
  return (
    <DataFieldsContext.Provider value={dataFields}>
      <div>
        <Button onClick={addNewColumn}>New Column</Button>
        <div className="ColDescriptorEditor-Columns">{columnsToRender}</div>
      </div>
    </DataFieldsContext.Provider>
  );
};

import { Button } from "@salt-ds/core";
import { AddIcon, DeleteIcon, RemoveIcon } from "@salt-ds/icons";
import {
  CascadingMenuProps,
  Dropdown,
  MenuButton,
  MenuDescriptor,
} from "@salt-ds/lab";
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
    const handleNewComposer = (sourceItem: MenuDescriptor, e: any) => {
      const selectedKey = sourceItem.id as GRID_EDITOR_MAP_TYPE_KEY;

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

    const addComposerItems = Object.keys(GRID_EDITOR_MAP).map((k) => ({
      id: k,
      title: k,
      disabled: colDescriptor.some((c) => c.type === k),
    }));

    const menuProps: CascadingMenuProps = {
      initialSource: { menuItems: addComposerItems },
      onItemClick: handleNewComposer,
    };

    return (
      <div key={colIndex} className="ColDescriptorEditor-Column">
        <div className="ColDescriptorEditor-ColumnHeader">
          <div>Column {colIndex + 1}</div>
          <Button onClick={() => removeColumnAtIndex(colIndex)}>
            {" "}
            <DeleteIcon />
          </Button>
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
              <Button onClick={removeDescriptor} aria-label="remove composer">
                {" "}
                <RemoveIcon />{" "}
              </Button>{" "}
              {descriptorEditor}
            </div>
          );
        })}

        <MenuButton CascadingMenuProps={menuProps}>Add</MenuButton>
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

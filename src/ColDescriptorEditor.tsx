import {
  Button,
  FlexLayout,
  Menu,
  MenuItem,
  MenuPanel,
  MenuTrigger,
  StackLayout,
  Text,
} from "@salt-ds/core";
import { createElement, Dispatch, SetStateAction } from "react";
import "./ColDescriptorEditor.css";
import {
  FieldDefaultDescriptor,
  GenericColDescriptor,
  GRID_EDITOR_MAP,
  GRID_EDITOR_MAP_TYPE_KEY,
} from "./Composers";
import { DataFieldsContext } from "./DataFieldsContext";
import { AddIcon, CloseIcon, CloseSmallIcon } from "@salt-ds/icons";

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
    const handleNewComposer = (selectedKey: GRID_EDITOR_MAP_TYPE_KEY) => {
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

    const addComposerMenuItems = Object.keys(GRID_EDITOR_MAP).map((k) => (
      <MenuItem
        onClick={() => handleNewComposer(k as GRID_EDITOR_MAP_TYPE_KEY)}
        key={k}
        disabled={colDescriptor.some((c) => c.type === k)}
      >
        {k}
      </MenuItem>
    ));

    return (
      <StackLayout
        gap={1}
        key={colIndex}
        align="start"
        className="ColDescriptorEditor-Column"
      >
        <FlexLayout gap={0.5} className="ColDescriptorEditor-ColumnHeader">
          <Text styleAs="h4">Column {colIndex + 1}</Text>
          <Button
            appearance="transparent"
            aria-label="Remove column"
            onClick={() => removeColumnAtIndex(colIndex)}
          >
            <CloseSmallIcon />
          </Button>
        </FlexLayout>
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
            <FlexLayout
              gap={0.5}
              className="ColDescriptorEditor-ColumnRow"
              key={`${key}-container`}
            >
              <Button
                onClick={removeDescriptor}
                aria-label="remove composer"
                appearance="transparent"
              >
                <CloseSmallIcon />
              </Button>{" "}
              {descriptorEditor}
            </FlexLayout>
          );
        })}

        <Menu>
          <MenuTrigger>
            <Button appearance="bordered">
              Add <AddIcon aria-hidden />
            </Button>
          </MenuTrigger>
          <MenuPanel>{addComposerMenuItems}</MenuPanel>
        </Menu>
      </StackLayout>
    );
  });
  return (
    <DataFieldsContext.Provider value={dataFields}>
      <div className="ColDescriptorEditor-Columns">
        {columnsToRender}
        <Button onClick={addNewColumn} appearance="bordered">
          New Column
        </Button>
      </div>
    </DataFieldsContext.Provider>
  );
};

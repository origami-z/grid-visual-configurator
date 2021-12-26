import { useState, ChangeEventHandler, useEffect } from "react";
import "./DataInput.css";

const defaultRowData = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxter", price: 72000 },
];

export const DataInput = (props: {
  onDataChanged?: <T extends []>(newData: T | null) => void;
}) => {
  // [{"make":"Toyota","model":"Celica","price":35000},{"make":"Ford","model":"Mondeo","price":32000},{"make":"Porsche","model":"Boxter","price":72000}]
  const [textInput, setTextInput] = useState<string>(
    '[{"make":"Toyota","model":"Celica","price":35000},{"make":"Ford","model":"Mondeo","price":32000},{"make":"Porsche","model":"Boxter","price":72000}]'
  );
  const [parsedJson, setParsedJson] = useState<any>(defaultRowData);

  useEffect(() => {
    props.onDataChanged?.(parsedJson);
  }, []);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const newValue = e.currentTarget.value;
    setTextInput(newValue);
    try {
      const newData = JSON.parse(newValue);
      setParsedJson(newData);
      props.onDataChanged?.(newData);
    } catch (error) {
      console.error(error);
      setParsedJson(null);
      props.onDataChanged?.(null);
    }
  };

  return (
    <label className="DataInput">
      Input data JSON {parsedJson === null ? "ERROR" : "OK"}
      <br />
      <textarea
        value={textInput}
        onChange={handleChange}
        className="DataInput-textarea"
      />
    </label>
  );
};

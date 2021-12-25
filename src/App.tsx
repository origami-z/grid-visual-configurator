import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="LeftColumn">
        <div className="LeftColumn-TopPanel">Top</div>
        <div className="LeftColumn-BottomPanel">Bottom</div>
      </div>
      <div className="RightColumn">Result</div>
    </div>
  );
}

export default App;

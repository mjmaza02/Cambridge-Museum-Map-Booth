import React from "react";
import "./App.css";

import Playback from "./playback/playback";
import Record from "./record/record";

const locationMap = new Map<string, string>([
  ["1", "Area 1"],
  ["2", "Area 2"],
  ["3", "Area 3"],
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Playback />
        <Record locationMap={locationMap} />
      </header>
    </div>
  );
}

export default App;

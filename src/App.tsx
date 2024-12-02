import React from "react";
import "./App.css";

import Playback from "./playback/playback";
import Record from "./record/record";
import { useState } from "react";

const controlMap = new Map<string, string>([
  ["r", "record"],
  ["s", "stop"],
  ["p", "play"],
  ["l", "pause"],
]);

const locationMap = new Map<string, string>([
  ["1", "Area 1"],
  ["2", "Area 2"],
  ["3", "Area 3"],
]);

function App() {
  const [webcamStream, setStream] = useState<MediaStream>();
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (!webcamStream) setStream(stream);
    });

  return (
    <div className="App">
      <header className="App-header">
        <Playback />
        {webcamStream && (
          <Record
            locationMap={locationMap}
            controlMap={controlMap}
            webcamStream={webcamStream}
          />
        )}
      </header>
    </div>
  );
}

export default App;

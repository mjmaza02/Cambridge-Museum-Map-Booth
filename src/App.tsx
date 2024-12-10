import React from "react";
import "./App.css";

import Playback from "./playback/playback";
import Record from "./record/record";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const controlMap = new Map<string, string>([
  ["0", "record"],
  ["7", "stop"],
  ["8", "play"],
  ["9", "pause"],
]);

const locationMap = new Map<string, string>([
  ["Backspace", "Area 1"],
  ["Enter", "Area 2"],
  [`-`, "Area 3"],
  [`'`, "Area 4"],
  [`/`, "Area 5"],
  ["l", "Area 6"],
  [",", "Area 7"],
  ["u", "Area 8"],
  ["t", "Area 9"],
  ["v", "Area 10"],
  ["2", "Area 11"],
  ["w", "Area 12"],
  ["Shift", "Area 13"],
]);

function App() {
  const [webcamStream, setStream] = useState<MediaStream>();
  const [temp, setTemp] = useState<string | undefined>(undefined);
  const [keyPressed, setKey] = useState("");

  useHotkeys("*", (event) => {
    event.preventDefault();
    const t = locationMap.get(event.key);
    if (t) {
      setKey(t);
    }
  });

  if (temp === "record" && !webcamStream)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!webcamStream) setStream(stream);
      });
  else if (webcamStream && temp !== "record") {
    webcamStream.getTracks().forEach((track) => track.stop());
    setStream(undefined);
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setTemp("record")}>Record</button>
        <button onClick={() => setTemp("play")}>Play</button>
        {temp === "play" && <Playback location={keyPressed} />}
        {webcamStream && temp === "record" && (
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

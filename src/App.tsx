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

const States = {
  READY: "ready",
  RECORD: "record",
  PLAY: "play",
};

function App() {
  const [webcamStream, setStream] = useState<MediaStream>();
  const [state, setState] = useState<string>(States.READY);
  const [keyPressed, setKey] = useState("");

  useHotkeys("*", (event) => {
    event.preventDefault();
    const loc = locationMap.get(event.key);
    const con = controlMap.get(event.key);
    if (loc && state === States.READY) {
      setKey(loc);
      setState(States.PLAY);
    } else if (con && state === States.READY) {
      switch (con) {
        case "stop":
          setState(States.READY);
          break;
        case "record":
          setState(States.RECORD);
          break;
        case "play":
          setState(States.PLAY);
          break;
        default:
          break;
      }
    }
  });

  if (state === "record" && !webcamStream)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!webcamStream) setStream(stream);
      });
  else if (webcamStream && state !== "record") {
    webcamStream.getTracks().forEach((track) => track.stop());
    setStream(undefined);
  }
  return (
    <div className="App">
      <header className="App-header">
        {state === States.PLAY && (
          <Playback
            location={keyPressed}
            controlMap={controlMap}
            resetState={() => setState(States.READY)}
          />
        )}
        {webcamStream && state === States.RECORD && (
          <Record
            locationMap={locationMap}
            controlMap={controlMap}
            webcamStream={webcamStream}
            resetState={() => setState(States.READY)}
          />
        )}
        {state === States.READY && (
          <p>
            Press record to start recording, or press a location to play a video
            from there!
          </p>
        )}
      </header>
    </div>
  );
}

export default App;

import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";

const controlMap = new Map<string, string>([
  ["r", "record"],
  ["s", "stop"],
  ["p", "play"],
  ["l", "pause"],
]);

function downloadHandler(fileUrl: string) {
  console.log("downloading");
  const element = document.createElement("a");
  element.href = fileUrl;
  element.download = "recording-" + Date.now(); // simulate link click
  element.click();
}

export default function Record({
  locationMap,
}: {
  locationMap: Map<string, string>;
}) {
  const keyMap = new Map(controlMap.entries());
  locationMap.forEach((value, key) => keyMap.set(key, value));

  const [key, setKey] = useState("");
  const [locations, setLocations] = useState<Array<[number, string]>>([]); // location button presses to encode later (idk how yet)
  const [time, setTime] = useState(0);

  useHotkeys(
    Array.from(keyMap.keys()),
    (e) => {
      const t = keyMap.get(e.key);
      if (t !== undefined) {
        setKey(t);
      }
    },
    {
      keyup: true,
    }
  );
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ video: true });

  if (key === "record" && status === "idle") {
    startRecording();
    setTime(Date.now());
    setLocations([]);
  } else if (key === "stop" && status === "recording") {
    stopRecording();
    console.log(locations);
  } else if (key === "pause") {
    if (mediaBlobUrl) downloadHandler(mediaBlobUrl);
    setKey("");
    clearBlobUrl();
    setTime(0);
  } else if (key === "play") {
    clearBlobUrl();
    setTime(0);
  } else if (Array.from(locationMap.values()).includes(key)) {
    const newEntry: [[number, string]] = [[Date.now() - time, key]];
    setLocations(locations.concat(newEntry));
  }

  if (key) setKey(""); // to reset key after each press and avoid too many re-renders

  return (
    <div className="App">
      <h1>RECORD</h1>
      <p>{status}</p>
      {key && <h2>Pressed Key: {key}</h2>}
      <video src={mediaBlobUrl} controls />
    </div>
  );
}

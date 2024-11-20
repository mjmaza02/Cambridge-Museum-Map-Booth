import React from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';


const keyMap = new Map<string, string>([
  ["r", "record"],
  ["s", "stop"],
  ["p", "play"],
  ["l", "pause"],
]);

function downloadHandler (fileUrl:string) {
    console.log("downloading");
    const element = document.createElement("a");
    element.href = fileUrl;
    element.download = "100ideas-" + Date.now() + ".txt";// simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export default function Record () {

    const [key, setKey] = useState("");

    useHotkeys(Array.from(keyMap.keys()), (e) => {
    let t = keyMap.get(e.key);
    if (t !== undefined) {
      setKey(t)
    }
  }, 
  {
    keyup:true
  });

    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ video: true });

    if (key === "record" && status === "idle") {
        startRecording();
    }
    else if (key === "stop" && status === "recording") {
        stopRecording();        
    }
    else if (key === "pause") {
        clearBlobUrl();
        console.log("CLEAR");
        setKey("");
    }

    return (
        <div className="App">
            <h1>RECORD</h1>
            <p>{status}</p>
            {key && <h2>Pressed Key: {key}</h2>}
            <video src={mediaBlobUrl} controls autoPlay loop />
        </div>
    );
}
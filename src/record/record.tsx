import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Record({
  locationMap,
  controlMap,
  webcamStream,
}: {
  locationMap: Map<string, string>;
  controlMap: Map<string, string>;
  webcamStream: MediaStream;
}) {
  // Create full control map
  const keyMap = new Map(controlMap.entries());
  locationMap.forEach((value, key) => keyMap.set(key, value));

  const [key, setKey] = useState("");
  const [location, setLocation] = useState<string | undefined>(undefined); // location button presses to encode later

  const recorderRef = useRef(new MediaRecorder(webcamStream));

  let recordedChunks: Blob[] = [];
  const [blob, setBlob] = useState<Blob>();

  function startRecording() {
    recordedChunks = [];
    if (webcamStream) {
      recorderRef.current.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };
      recorderRef.current.onstop = () => {
        setBlob(new Blob(recordedChunks, { type: "video/webm" }));
      };
      recorderRef.current.start();
    }
  }

  function sendRecording() {
    if (!location) throw new Error("Invalid Location")
    const formData = new FormData();
    formData.append("location", location);
    console.log(blob);
    if (blob) formData.append("file", blob, "recorded_video.webm");
    axios
      .post("http://localhost:8080/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Video uploaded successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
      });
    setBlob(undefined);
  }

  // Parse keypress to command/location
  useHotkeys(
    Array.from(keyMap.keys()),
    (e) => {
      e.preventDefault();
      const t = keyMap.get(e.key);
      if (t !== undefined) {
        setKey(t);
      }
    },
    {
      keyup: true,
    }
  );

  if (key === "record" && recorderRef.current.state === "inactive") {
    startRecording();
    setLocation(undefined);
  } else if (key === "stop" && recorderRef.current.state === "recording") {
    recorderRef.current.stop();
  } else if (Array.from(locationMap.values()).includes(key) && !location) {
    setLocation(key);
  }

  useEffect(() => {
    if (blob) sendRecording();
  }, [blob]);

  if (key) setKey(""); // to reset key after each press and avoid too many re-renders
  return (
    <div className="App">
      <h1>RECORD</h1>
      <p>STATUS: {recorderRef.current.state}</p>
      <video
        ref={(video) => {
          if (video) video.srcObject = webcamStream;
        }}
        autoPlay
        muted
      />
    </div>
  );
}

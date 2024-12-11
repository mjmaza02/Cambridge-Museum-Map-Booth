import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Record({
  locationMap,
  controlMap,
  webcamStream,
  resetState,
}: {
  locationMap: Map<string, string>;
  controlMap: Map<string, string>;
  webcamStream: MediaStream;
  resetState: Function;
}) {
  // Create full control map
  const [key, setKey] = useState("");
  const [location, setLocation] = useState("");

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

  // Parse keypress to command/location
  useHotkeys("*", (event) => {
    event.preventDefault();
    const loc = locationMap.get(event.key);
    const cont = controlMap.get(event.key);
    if (loc) {
      setLocation(loc);
    } else if (cont) {
      setKey(cont);
    }
  });

  if (recorderRef.current.state === "inactive" && location) {
    startRecording();
  } else if (key === "stop" && recorderRef.current.state === "recording") {
    recorderRef.current.stop();
  }

  useEffect(() => {
    if (blob) {
      const formData = new FormData();
      formData.append("location", location);
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
      setLocation("");
      resetState();
    };
  }, [blob, resetState, location]);

  if (key) setKey(""); // to reset key after each press and avoid too many re-renders
  return (
    <div className="App">
      <h1>RECORD</h1>
      {location && <p>STATUS: {recorderRef.current.state}</p>}
      {!location && <p>Set location to start</p>}
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

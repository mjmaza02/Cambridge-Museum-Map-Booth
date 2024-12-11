import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useHotkeys } from "react-hotkeys-hook";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Playback({
  location,
  controlMap,
  resetState,
}: {
  location: string;
  controlMap: Map<string, string>;
  resetState: Function;
}) {
  const [streamSource, setSource] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const streamRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setStream() {
      await axios
        .get("http://localhost:8080/play", {
          params: { location },
          responseType: "blob",
        })
        .then((res) => {
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(
            new Blob([res.data], { type: "video/webm" })
          );
          setSource(url);
          setLoaded(true);
        }).catch(()=>sleep(3000).then(resetState()))
    }
    if (location) setStream();
  }, [location, resetState]);

  useHotkeys(Array.from(controlMap.keys()), (e) => {
    const val = controlMap.get(e.key);
    switch (val) {
      case "play":
        streamRef.current?.play();
        break;
      case "pause":
        streamRef.current?.pause();
        break;
      case "stop":
        streamRef.current?.play();
        resetState();
        break;
      default:
        break;
    }
  });

  return (
    <div>
      <h1>PLAYBACK TODO</h1>
      <h2>Location: {location}</h2>
      {location && loaded && (
        <video
          autoPlay
          src={streamSource}
          ref={streamRef}
          onEnded={() => resetState()}
        ></video>
      )}
      {location && !loaded && <p>Select a new location</p>}
      {!location && <p>Set location to start</p>}
    </div>
  );
}

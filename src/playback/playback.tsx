import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Playback({ location }: { location: string }) {
  const [streamSource, setSource] = useState<string>("")
  useEffect(() => {
    async function setStream() {
      await axios
        .get("http://localhost:8080/play", { params: { location } })
        .then((res) => {
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(
            new Blob([res.data], { type: "video/mp4" })
          );
          setSource(url);
        })
        .catch((e) => console.error(e));
    }
    if (location) setStream();
  }, [location]);

  return (
    <div>
      <h1>PLAYBACK TODO</h1>
      {location && <h2>{location}</h2>}
      {location && <video controls autoPlay src={streamSource}></video>}
      {!location && <p>Set location to start</p>}
    </div>
  );
}

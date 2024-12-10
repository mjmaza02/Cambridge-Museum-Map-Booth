import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Playback({ location }: { location: string }) {
  const [streamSource, setSource] = useState<string>("")
  useEffect(() => {
    async function setStream() {
      await axios
        .get("http://localhost:8080/play", { params: { location }, responseType: 'blob' })
        .then((res) => {
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(
            new Blob([res.data], { type: "video/webm" })
          );
          setSource(url);
        })
        // .catch((e) => if(e.status===404) );
    }
    if (location) setStream();
  }, [location]);

  return (
    <div>
      <h1>PLAYBACK TODO</h1>
      {location && <h2>{location}</h2>}
      {location && <video autoPlay src={streamSource}></video>}
      {!location && <p>Set location to start</p>}
    </div>
  );
}

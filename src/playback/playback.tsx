import React, { useEffect } from "react";
import axios from "axios";

export default function Playback({
  location,
}: {
  location: string;
}) {

  useEffect(() => {
    async function setStream() {
      const p = await axios
        .get("http://localhost:8080/play", {params: {location}})
        .then((res) => res.headers)
        .catch((e) => console.error(e));
      console.log(p);
    }
    if (location) setStream();
  }, [location]);

  return (
    <div>
      <h1>PLAYBACK TODO</h1>
      {location && <h2>{location}</h2>}
      {location && (
        <video src="http://localhost:8080/play" controls autoPlay></video>
      )}
    </div>
  );
}

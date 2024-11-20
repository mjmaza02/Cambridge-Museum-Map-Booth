import React from "react";

export default function Playback() {
  const elementArr: string[] = ["do", "re", "mi"];
  return (
    <div>
      <h1>PLAYBACK TODO</h1>
      <ul>
        {elementArr.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';
import logo from './logo.svg';
import './App.css';

import Playback from './playback/playback';
import Record from './record/record';

import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const keyMap = {
    RECORD: "q",
    STOP: "w",
    PLAY: "e",
    PAUSE: "r",
};

function App() {
  const [key, setKey] = useState("");
  useHotkeys(Object.values(keyMap), (e) => {
    setKey(e.key);
    console.log(e.key);
  }, 
  {
    keyup:true
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Playback/>
        <Record keyPressed={key}/>
      </header>
    </div>
  );
}

export default App;

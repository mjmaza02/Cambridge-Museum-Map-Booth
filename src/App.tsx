import React from 'react';
import logo from './logo.svg';
import './App.css';

import Playback from './playback/playback';
import Record from './record/record';

const keyMap = new Map<string, string>([
  ["r", "record"],
  ["s", "stop"],
  ["p", "play"],
  ["q", "pause"],
]);

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Playback/>
        <Record/>
      </header>
    </div>
  );
}

export default App;

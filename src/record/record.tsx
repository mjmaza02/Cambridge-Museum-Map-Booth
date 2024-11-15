import React from 'react';

const enum recordStatus {
    RECORD,
    STOP,
    WAIT
};

export default function Record ({ keyPressed } : { keyPressed:string }) {
    let status = recordStatus.WAIT; // Move to top to also control playback

    return (
        <div className="App">
            <h1>RECORD</h1>
            {keyPressed && <h2>Pressed Key: {status}</h2>}
        </div>
    );
}
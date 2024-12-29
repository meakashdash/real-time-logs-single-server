import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const LogMonitor = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Listen for log events
    socket.on('log', (message) => {
      setLogs((prevLogs) => [message, ...prevLogs]);
    });

    // Clean up the Socket.io connection on component unmount
    return () => socket.off('log');
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Real-Time Log Monitor</h1>
      <div style={{ maxHeight: '400px', overflowY: 'auto', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogMonitor;

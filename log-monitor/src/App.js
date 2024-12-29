import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('log', (message) => {
      setLogs((prevLogs) => [...prevLogs, message]);
    });

    newSocket.on('build',(message)=>{
      setLogs((prevLogs) => [...prevLogs, message]);
    })

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const installPackage = () => {
    if (socket && packageName.trim()) {
      setLogs((prevLogs) => [...prevLogs, `Requesting installation for: ${packageName}`]);
      socket.emit('install-package', packageName);
      setPackageName('');
    } else {
      setLogs((prevLogs) => [...prevLogs, 'Error: Package name is empty.']);
    }
  };

  const uninstallPackage = () => {
    if (socket && packageName.trim()) {
      setLogs((prevLogs) => [...prevLogs, `Requesting uninstallation for: ${packageName}`]);
      socket.emit('uninstall-package', packageName);
      setPackageName('');
    } else {
      setLogs((prevLogs) => [...prevLogs, 'Error: Package name is empty.']);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Real-Time Logs</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter npm package name"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={installPackage}>
          Install Package
        </button>
        <button style={styles.button} onClick={uninstallPackage}>
          Uninstall Package
        </button>
      </div>
      <div style={styles.logsContainer}>
        {logs.map((log, index) => (
          <div key={index} style={styles.logEntry}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginRight:'10px'
  },
  logsContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    height: '300px',
    overflowY: 'auto',
    background: '#f9f9f9',
    textAlign: 'left',
  },
  logEntry: {
    marginBottom: '10px',
  },
};

export default App;

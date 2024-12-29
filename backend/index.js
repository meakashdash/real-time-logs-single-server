const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {exec} = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('install-package', (packageName) => {
    const logMessage = `Installing package: ${packageName}...`;
    console.log(logMessage);
    const p=exec(`npm install ${packageName}`)
    p.stdout.on('data',(data)=>{
        console.log(data.toString())
        io.emit('log', data.toString());
    })

    p.stderr.on('data',(data)=>{
        console.log(data.toString())
        io.emit('log', data.toString());
    })

  });

  socket.on('uninstall-package',(packageName)=>{
    const logMessage = `Unnstalling package: ${packageName}...`;
    console.log(logMessage);
    const p=exec(`npm uninstall ${packageName}`)
    p.stdout.on('data',(data)=>{
        console.log(data.toString())
        io.emit('log', data.toString());
    })

    p.stderr.on('data',(data)=>{
        console.log(data.toString())
        io.emit('log', data.toString());
    })
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

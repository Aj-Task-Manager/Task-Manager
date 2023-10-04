const io = require('socket.io-client');

const serverUrl = 'http://localhost:3002/tasks'; 

const socket = io(serverUrl);

// Replace 'ClientName' with the actual client name
const clientName = 'ClientName';

socket.on('connect', () => {
  console.log(`Connected to the hub as ${socket.id}`);

  // Join the client to their own room
  socket.emit('join', { assignee: clientName });

  // Subscribe to the 'getTasks' event to receive the list of tasks
  socket.on('getTasks', (tasks) => {
    console.log(`Received tasks for ${clientName}:`, tasks);
  });

  // Example: Create a new task
  socket.emit('create', { assignee: clientName, title: 'New Task' });

  // Example: Update existing tasks
  socket.emit('update', { assignee: clientName, title: 'New Task' });

  // Example: Delete tasks
  socket.emit('delete', { assignee: clientName, title: 'New Task' });
});

  // Listen for a custom event 
  socket.on('broadcastMsg', (broadcast) => {
    console.log(`${broadcast.message}`);
  });


socket.on('disconnect', () => {
  console.log('Disconnected from the hub');
});

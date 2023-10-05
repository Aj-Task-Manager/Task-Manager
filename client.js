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
  const newTask = { title: 'New Task' };
  socket.emit('create', { assignee: clientName, task: newTask });

  // Example: Update existing tasks
  const updatedTask = { title: 'Task 1', status: 'completed' };
  socket.emit('update', { assignee: clientName, task: updatedTask });

  // Example: Delete tasks
  const taskToDelete = { title: 'Task 3' };
  socket.emit('delete', { assignee: clientName, task: taskToDelete });
});

  // Listen for a custom event 
  socket.on('customBroadcastEvent', (message) => {
    console.log(`Received custom broadcast: ${message}`);
  });


socket.on('disconnect', () => {
  console.log('Disconnected from the hub');
});

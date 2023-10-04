'use strict';

const TaskQueue = require('./hub/TaskQueue');

const { Server } = require('socket.io');

const PORT = process.env.PORT || 3002;

// generic server
let server = new Server(PORT); // as soon as this line runs, we have something to connect to.

const hubQueue = new TaskQueue();

// namespace server
let taskServer = server.of('/tasks');

taskServer.on('connection', function(socket){
    console.log('Client connected')

    // Put Client into their own room
   socket.on('join', (data) => {

    const { assignee, title } = data;

    socket.join(assignee);

    // send client their task list if one exists, or an obj like {tasks: []} if not
    const initialTaskList = hubQueue.getQueue(data.assignee);

    console.log(`Inital task list for ${assignee}: ${initialTaskList}`);
    
    taskServer.to(assignee).emit('getTasks', initialTaskList);

    // listen for create tasks
    socket.on('create', (data) => {
        hubQueue.addTask(data);
        taskServer.emit('broadcastMsg', { message: `New Task '${data.title}' created by ${data.assignee}` });
    })

    // listen for update tasks
    socket.on('update', (data) => {
        hubQueue.updateTask(data);
        taskServer.emit('broadcastMsg', { message: `Task '${data.title}' completed by ${data.assignee}` });
    })

    // listen for delete tasks
    socket.on('delete', (data) => {
        hubQueue.deleteTask(data);
        taskServer.emit('broadcastMsg', { message: `Task '${data.title}' deleted by ${data.assignee}` });
    })

   })
});

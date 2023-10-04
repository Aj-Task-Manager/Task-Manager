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
    const initialTaskList = hubQueue.getQueue(assignee);

    console.log(`Inital task list for ${assignee}: ${initialTaskList}`);
    
    taskServer.to(assignee).emit('getTasks', initialTaskList);

    // listen for create tasks
    socket.to(assignee).on('create', (data) => {
        hubQueue.addTask(assignee, data);
        taskServer.emit('broadcastMsg', { message: `New Task '${title}' created by ${assignee}` });
    })

    // listen for update tasks
    socket.to(assignee).on('update', (data) => {
        hubQueue.updateTask(assignee, data);
        taskServer.emit('broadcastMsg', { message: `Task '${title}' completed by ${assignee}` });
    })

    // listen for delete tasks
    socket.to(assignee).on('delete', (data) => {
        hubQueue.deleteTask(assignee, data);
        taskServer.emit('broadcastMsg', { message: `Task '${title}' deleted by ${assignee}` });
    })

   })
});

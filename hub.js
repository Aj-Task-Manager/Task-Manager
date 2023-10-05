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

    socket.join(data.assignee);

    // send client their task list if one exists, or an obj like {tasks: []} if not
    const initialTaskList = hubQueue.getQueue(data.assignee);

    console.log(`Inital task list for ${data.assignee}: ${initialTaskList}`);
    
    taskServer.to(data.assignee).emit('getTasks', initialTaskList);

    // listen for create tasks
    socket.to(data.assignee).on('create', (data) => {
        hubQueue.updateQueue(data.assignee, data);
        // broadcast emit will go here
    })

    // listen for update tasks
    socket.to(data.assignee).on('update', (data) => {
        hubQueue.updateQueue(data.assignee, data);
        // broadcast emit will go here
    })

    // listen for delete tasks
    socket.to(data.assignee).on('delete', (data) => {
        hubQueue.updateQueue(data.assignee, data);
        // broadcast emit will go here
    })

   })
});

//hasQueue(clientName)
//addQueue(clientName)
//updateQueue(clientName, tasks)
//getQueue(clientName)


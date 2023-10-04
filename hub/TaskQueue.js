/*

    TaskQueue - Stores and manages the individual Task arrays for each client.

    When instantiated, and when a client queue has been created, this.queue will look like:

    {
        "client name": {
            "tasks": [
                { title:"This is my first task", status: "open"}
            ]
        },
        "another client name": {
            "tasks": [
                { title:"Some other task", status: "in progress"}
            ]
        },
    }

    Methods:

    hasQueue('client name')
    addQueue('client name')
    getQueue(clientName)
    updateQueue('client name',tasksArray)

*/

class TaskQueue {
    constructor() {
        this.queue = {}
    }

    hasQueue(clientName) {
        //console.log(Boolean(this.queue[clientName]));
        return Boolean(this.queue[clientName]);
    }

    addQueue(clientName) {
        this.queue[clientName] = { "tasks": [] };
    
    }

    getQueue(clientName) {
        if (!this.hasQueue(clientName)) {
            this.addQueue(clientName);
        }
        return this.queue[clientName];
    }

    addTask(task) {
        const newTask = { ...task,
                           status: 'new',
        }
        console.log(this.queue);
        this.queue[task.assignee].tasks.push(newTask);
    }

    updateTask(updatedTask) {
        this.queue[updatedTask.assignee].tasks.map((task) => {
            if (task.title === updatedTask.title) {
              return updatedTask;
            }
            return task;
        })
    }

    deleteTask(taskToRemove) {
        this.queue[taskToRemove.assignee].tasks.filter((task) => task.title !== taskToRemove.title);
    }

    updateQueue(clientName, tasks) {
        this.queue[clientName].tasks = tasks;
    }
}

module.exports = TaskQueue;

const task = {
    id:Number,
    title:String,
    description:String,
    completed:Boolean,
    priority: "high"||"medium"||"low",
    createdAt:String,
    source:String
}

function validateTask(task) {   
    if (!task) return false;

    const title = typeof task === 'string' ? task : task.title;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return false;
    }

    if (typeof task === 'object' && task.priority) {
        const validPriorities = ['high', 'medium', 'low'];
        if (!validPriorities.includes(task.priority)) {
            return false;
        }
    }

    return true;
}

function createTask(){}

function updateTask(){}

function deleteTask(){}

function updateStatus(){}

function searchTask(){}

function filtertaskByStatus(){}

function sortTaskByDate(){}

function totalTask(){}

function initializeStatus (){}

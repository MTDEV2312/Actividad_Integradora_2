/*
Task model
    id:Number,
    title:String,
    description:String,
    completed:Boolean,
    priority: "high"||"medium"||"low",
    createdAt:String,
    source:String
*/

import { getTasks, saveTask, clearTask } from "./storage.js";

const tasks = [
  {
    id: 1,
    title: "Estudiar JavaScript",
    description: "Repasar localStorage",
    completed: false,
    priority: "high",
    createdAt: new Date().toISOString(),
    source: "local"
  }
];

// CREATE
function createTask(task) {
    if (!task) return null;

    if (Array.isArray(task)) {
        saveTask(task);
        return task;
    }

    const currentTasks = getTasks();
    const newTask = {
        id: task.id || Date.now(),
        title: task.title || "",
        description: task.description || "",
        completed: Boolean(task.completed),
        priority: task.priority || "medium",
        createdAt: task.createdAt || new Date().toISOString(),
        source: task.source || "local"
    };

    currentTasks.push(newTask);
    saveTask(currentTasks);
    return newTask;
}

// READ
function readTasks() {
    return getTasks();
}

function searchTask(id) {
    const currentTasks = getTasks();
    return currentTasks.find(t => t.id === Number(id) || t.id === id) || null;
}

// UPDATE
function updateTask(id, updatedTask) {
    const currentTasks = getTasks();
    const index = currentTasks.findIndex(t => t.id === Number(id) || t.id === id);

    if (index === -1) return null;

    currentTasks[index] = {
        ...currentTasks[index],
        ...updatedTask,
        id: currentTasks[index].id
    };

    saveTask(currentTasks);
    return currentTasks[index];
}

function updateStatus(id, status) {
    const currentTasks = getTasks();
    const item = currentTasks.find(t => t.id === Number(id) || t.id === id);

    if (!item) return null;

    item.completed = typeof status === "boolean" ? status : !item.completed;
    saveTask(currentTasks);
    return item;
}

// DELETE
function deleteTask(id) {
    const currentTasks = getTasks();
    const filteredTasks = currentTasks.filter(t => t.id !== Number(id) && t.id !== id);

    saveTask(filteredTasks);
    return filteredTasks;
}

function filtertaskByStatus(){}

function sortTaskByDate(){}

function totalTask(){}

function initializeStatus (){}

export {
    createTask,
    readTasks,
    searchTask,
    updateTask,
    updateStatus,
    deleteTask,
    filtertaskByStatus,
    sortTaskByDate,
    totalTask,
    initializeStatus
};

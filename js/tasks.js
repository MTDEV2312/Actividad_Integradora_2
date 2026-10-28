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

// Búsqueda por título (o por ID si se pasa número)
function searchTask(tasksOrQuery, query) {
    const list = Array.isArray(tasksOrQuery) ? tasksOrQuery : getTasks();

    // Búsqueda por ID directo
    if (typeof tasksOrQuery === "number" || (!Array.isArray(tasksOrQuery) && !isNaN(Number(tasksOrQuery)) && typeof tasksOrQuery !== "string")) {
        return list.find(t => t.id === Number(tasksOrQuery)) || null;
    }

    const term = (typeof tasksOrQuery === "string" ? tasksOrQuery : query || "").toLowerCase().trim();

    if (!term) return list;

    return list.filter(task => task.title.toLowerCase().includes(term));
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

// FILTRADO POR ESTADO
function filtertaskByStatus(tasksOrStatus, status) {
    const list = Array.isArray(tasksOrStatus) ? tasksOrStatus : getTasks();
    const filterStatus = typeof tasksOrStatus === "string" ? tasksOrStatus : status;

    if (!filterStatus || filterStatus === "all") {
        return list;
    }

    if (filterStatus === "completed") {
        return list.filter(task => task.completed === true);
    }

    if (filterStatus === "pending") {
        return list.filter(task => task.completed === false);
    }

    return list;
}

// ORDENAMIENTO (inmutable)
function sortTaskByDate(tasksOrCriteria, criteria = "date-desc") {
    const list = Array.isArray(tasksOrCriteria) ? tasksOrCriteria : getTasks();
    const sortOrder = typeof tasksOrCriteria === "string" ? tasksOrCriteria : criteria;

    const sorted = [...list];

    const priorityWeights = {
        high: 3,
        medium: 2,
        low: 1
    };

    return sorted.sort((a, b) => {
        if (sortOrder === "priority") {
            const weightA = priorityWeights[a.priority] || 0;
            const weightB = priorityWeights[b.priority] || 0;
            return weightB - weightA;
        }

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortOrder === "date-asc") {
            return dateA - dateB;
        }

        // Por defecto: date-desc (más recientes primero)
        return dateB - dateA;
    });
}

// ESTADÍSTICAS TOTALES
function totalTask(tasks) {
    const list = Array.isArray(tasks) ? tasks : getTasks();
    const total = list.length;
    const completed = list.filter(task => task.completed).length;
    const pending = total - completed;

    return {
        total,
        pending,
        completed
    };
}

function initializeStatus() {
    return {
        search: "",
        status: "all",
        sort: "date-desc"
    };
}

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

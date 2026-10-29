import { getTasks, saveTask } from "./storage.js";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchFromAPI() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("La API no devolvió una lista válida");
            return [];
        }

        return data.map(task => ({
            id: task.id,
            title: task.title,
            description: "",
            completed: Boolean(task.completed),
            priority: "medium",
            createdAt: new Date().toISOString(),
            source: "api"
        }));
    } catch (error) {
        console.error("Error al consultar la API:", error);
        return [];
    }
}

export async function loadAPITasksToStorage(limit = 10) {
    const apiTasks = await fetchFromAPI();

    if (!apiTasks || apiTasks.length === 0) {
        return getTasks();
    }

    const tasksToImport = typeof limit === "number" ? apiTasks.slice(0, limit) : apiTasks;
    const currentTasks = getTasks();

    // Evita duplicar tareas si ya existen en localStorage por ID
    const existingIds = new Set(currentTasks.map(task => task.id));
    const newTasks = tasksToImport.filter(task => !existingIds.has(task.id));

    const updatedTasks = [...currentTasks, ...newTasks];
    saveTask(updatedTasks);
    return updatedTasks;
}

import { getTasks, saveTask } from "./storage.js";
import { showNotification } from "./dom.js";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchFromAPI() {
    try {
        const response = await fetch(API_URL);

        // Fallo de servidor (códigos HTTP 4xx / 5xx)
        if (!response.ok) {
            throw new Error(`Error en el servidor (Código ${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Formato de respuesta inválido: la API no devolvió una lista.");
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

        let friendlyMessage = "Error inesperado al conectar con el servidor.";

        // Distinción de fallo de red vs servidor
        if (!navigator.onLine || error.name === "TypeError" || error.message.toLowerCase().includes("failed to fetch")) {
            friendlyMessage = "Fallo de red: No se pudo conectar con el servidor. Revisa tu conexión a internet.";
        } else if (error.message && error.message.includes("Error en el servidor")) {
            friendlyMessage = `Fallo de servidor: ${error.message}. Intenta nuevamente más tarde.`;
        } else if (error.message) {
            friendlyMessage = error.message;
        }

        showNotification(friendlyMessage, "error");
        return [];
    }
}

export async function loadAPITasksToStorage(limit = 10) {
    try {
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
    } catch (error) {
        console.error("Error al procesar tareas de la API:", error);
        showNotification("No se pudieron guardar las tareas remotas en el almacenamiento.", "error");
        return getTasks();
    }
}

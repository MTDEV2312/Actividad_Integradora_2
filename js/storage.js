
const STORAGE_KEY = "taskmanager_tasks";

export function getTasks(){
    const data = localStorage.getItem(STORAGE_KEY);

    if (data === null) {
        return [];
    }

    try {
        const tasks = JSON.parse(data);

        if (!Array.isArray(tasks)) {
        console.error("Los datos guardados no son una lista.");
        }
        return tasks;
    } catch (error) {
        console.error("Error al leer las tareas:", error);
        return [];
    }
}

export function saveTask(tasks){
    if(!Array.isArray(tasks)){
        console.error("Los datos no son una lista")
    }
    try{
        const data = JSON.stringify(tasks)
        localStorage.setItem(STORAGE_KEY,data)
        return true
    }catch(error){
        console.error("Error al guardar tareas: ", error)
        return false
    }
}

export function clearTask() {
    localStorage.removeItem(STORAGE_KEY)
}

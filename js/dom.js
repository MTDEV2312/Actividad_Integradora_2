import { totalTask } from "./tasks.js";

const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const priorityInput = document.getElementById("task-priority");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const notificationEl = document.getElementById("notification");

const totalTasksEl = document.getElementById("total-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");
const completedTasksEl = document.getElementById("completed-tasks");

const LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
  ALLOWED_PRIORITIES: ["high", "medium", "low"]
};

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function validateTaskInput(title, description, priority) {
  const errors = [];
  const cleanTitle = (title || "").trim();
  const cleanDescription = (description || "").trim();

  // Validación de título
  if (!cleanTitle) {
    errors.push("El título no puede estar vacío.");
  } else if (cleanTitle.length < LIMITS.TITLE_MIN) {
    errors.push(`El título debe tener al menos ${LIMITS.TITLE_MIN} caracteres.`);
  } else if (cleanTitle.length > LIMITS.TITLE_MAX) {
    errors.push(`El título no puede superar ${LIMITS.TITLE_MAX} caracteres.`);
  }

  // Validación de descripción
  if (cleanDescription.length > LIMITS.DESCRIPTION_MAX) {
    errors.push(`La descripción no puede superar ${LIMITS.DESCRIPTION_MAX} caracteres.`);
  }

  // Validación de prioridad
  if (!LIMITS.ALLOWED_PRIORITIES.includes(priority)) {
    errors.push("La prioridad debe ser 'high', 'medium' o 'low'.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      title: cleanTitle,
      description: cleanDescription,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      source: "local"
    } : null
  };
}

export function getTaskFormData() {
  return validateTaskInput(
    titleInput.value,
    descriptionInput.value,
    priorityInput.value
  );
}

export function resetTaskForm() {
  titleInput.value = "";
  descriptionInput.value = "";
  priorityInput.value = "medium";
}

export function toggleTaskForm(visible) {
  if (!taskForm) return;
  if (visible) {
    taskForm.removeAttribute("hidden");
    titleInput?.focus();
  } else {
    taskForm.setAttribute("hidden", "");
    resetTaskForm();
  }
}

export function showNotification(message, duration = 3000) {
  if (!notificationEl) return;
  notificationEl.textContent = message;
  setTimeout(() => {
    notificationEl.textContent = "";
  }, duration);
}

export function updateStats(tasks = []) {
  const { total, pending, completed } = totalTask(tasks);

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
  if (completedTasksEl) completedTasksEl.textContent = completed;
}

export function renderTasks(tasks = [], editingTaskId = null) {
  if (!taskList) return;
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    if (emptyState) emptyState.removeAttribute("hidden");
    return;
  }

  if (emptyState) emptyState.setAttribute("hidden", "");

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (editingTaskId !== null && Number(editingTaskId) === task.id) {
      li.className = "task-item editing";
      li.innerHTML = `
        <div class="task-edit-form">
          <input
            type="text"
            class="edit-input-title"
            value="${escapeHTML(task.title)}"
            placeholder="Título de la tarea"
            required
          >
          <textarea
            class="edit-input-desc"
            placeholder="Descripción (opcional)"
          >${escapeHTML(task.description || "")}</textarea>
          <div class="edit-row">
            <select class="edit-input-priority">
              <option value="high" ${task.priority === "high" ? "selected" : ""}>Alta</option>
              <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Media</option>
              <option value="low" ${task.priority === "low" ? "selected" : ""}>Baja</option>
            </select>
            <div class="task-actions">
              <button type="button" class="btn-action btn-save" data-action="save-edit">Guardar</button>
              <button type="button" class="btn-action btn-cancel" data-action="cancel-edit">Cancelar</button>
            </div>
          </div>
        </div>
      `;
    } else {
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
        <div class="task-main">
          <input
            type="checkbox"
            class="task-status-checkbox"
            ${task.completed ? "checked" : ""}
            aria-label="Completar tarea"
          >
          <div class="task-content">
            <h3 class="task-title">${escapeHTML(task.title)}</h3>
            ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ""}
            <span class="badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
          </div>
        </div>
        <div class="task-actions">
          <button type="button" class="btn-action btn-edit" data-action="edit">Editar</button>
          <button type="button" class="btn-action btn-delete" data-action="delete">Eliminar</button>
        </div>
      `;
    }

    taskList.appendChild(li);
  });
}

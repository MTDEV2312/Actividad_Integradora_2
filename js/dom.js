import { totalTask } from "./tasks.js";

const titleInput = document.getElementById("task-title");
const errorTitleEl = document.getElementById("error-task-title");
const descriptionInput = document.getElementById("task-description");
const errorDescEl = document.getElementById("error-task-description");
const priorityInput = document.getElementById("task-priority");
const errorPriorityEl = document.getElementById("error-task-priority");
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

export function updateFieldValidationUI(inputEl, errorEl, errorMessage) {
  if (!inputEl) return;
  const hasError = Boolean(errorMessage);

  if (errorEl) {
    errorEl.textContent = errorMessage || "";
  }

  inputEl.classList.toggle("is-invalid", hasError);
  inputEl.classList.toggle("is-valid", !hasError);
  inputEl.setAttribute("aria-invalid", String(hasError));
}

export function clearFieldValidationUI(inputEl, errorEl) {
  if (!inputEl) return;
  if (errorEl) {
    errorEl.textContent = "";
  }
  inputEl.classList.remove("is-invalid", "is-valid");
  inputEl.removeAttribute("aria-invalid");
}

export function validateTaskInput(title, description, priority) {
  const errors = [];
  const fieldErrors = {
    title: "",
    description: "",
    priority: ""
  };

  const cleanTitle = (title || "").trim();
  const cleanDescription = (description || "").trim();

  // Validación de título: obligatorio y entre 3 y 100 caracteres
  if (!cleanTitle) {
    fieldErrors.title = "El título es obligatorio.";
    errors.push(fieldErrors.title);
  } else if (cleanTitle.length < LIMITS.TITLE_MIN || cleanTitle.length > LIMITS.TITLE_MAX) {
    fieldErrors.title = `El título debe tener entre ${LIMITS.TITLE_MIN} y ${LIMITS.TITLE_MAX} caracteres.`;
    errors.push(fieldErrors.title);
  }

  // Validación de descripción: máximo 500 caracteres (opcional)
  if (cleanDescription.length > LIMITS.DESCRIPTION_MAX) {
    fieldErrors.description = `La descripción no puede superar ${LIMITS.DESCRIPTION_MAX} caracteres.`;
    errors.push(fieldErrors.description);
  }

  // Validación de prioridad: obligatoria y dentro de las opciones permitidas
  if (!priority || !LIMITS.ALLOWED_PRIORITIES.includes(priority)) {
    fieldErrors.priority = "Selecciona una prioridad válida (Alta, Media o Baja).";
    errors.push(fieldErrors.priority);
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
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

export function validateFormUI(field = "all") {
  const titleEl = document.getElementById("task-title");
  const descEl = document.getElementById("task-description");
  const prioEl = document.getElementById("task-priority");

  const errTitle = document.getElementById("error-task-title");
  const errDesc = document.getElementById("error-task-description");
  const errPrio = document.getElementById("error-task-priority");

  const validation = validateTaskInput(
    titleEl ? titleEl.value : "",
    descEl ? descEl.value : "",
    prioEl ? prioEl.value : ""
  );

  if (field === "all" || field === "title") {
    updateFieldValidationUI(titleEl, errTitle, validation.fieldErrors.title);
  }
  if (field === "all" || field === "description") {
    updateFieldValidationUI(descEl, errDesc, validation.fieldErrors.description);
  }
  if (field === "all" || field === "priority") {
    updateFieldValidationUI(prioEl, errPrio, validation.fieldErrors.priority);
  }

  if (field === "all" && !validation.isValid) {
    if (validation.fieldErrors.title && titleEl) {
      titleEl.focus();
    } else if (validation.fieldErrors.description && descEl) {
      descEl.focus();
    } else if (validation.fieldErrors.priority && prioEl) {
      prioEl.focus();
    }
  }

  return validation;
}

export function getTaskFormData() {
  const titleEl = document.getElementById("task-title");
  const descEl = document.getElementById("task-description");
  const prioEl = document.getElementById("task-priority");

  return validateTaskInput(
    titleEl ? titleEl.value : "",
    descEl ? descEl.value : "",
    prioEl ? prioEl.value : ""
  );
}

export function resetTaskForm() {
  const titleEl = document.getElementById("task-title");
  const descEl = document.getElementById("task-description");
  const prioEl = document.getElementById("task-priority");

  const errTitle = document.getElementById("error-task-title");
  const errDesc = document.getElementById("error-task-description");
  const errPrio = document.getElementById("error-task-priority");

  if (titleEl) titleEl.value = "";
  if (descEl) descEl.value = "";
  if (prioEl) prioEl.value = "medium";

  clearFieldValidationUI(titleEl, errTitle);
  clearFieldValidationUI(descEl, errDesc);
  clearFieldValidationUI(prioEl, errPrio);
}

export function toggleTaskForm(visible) {
  const form = document.getElementById("task-form");
  const titleEl = document.getElementById("task-title");

  if (!form) return;
  if (visible) {
    form.removeAttribute("hidden");
    titleEl?.focus();
  } else {
    form.setAttribute("hidden", "");
    resetTaskForm();
  }
}

let notificationTimeout = null;

export function showNotification(message, type = "info", duration = 4000) {
  if (!notificationEl) return;

  if (typeof type === "number") {
    duration = type;
    type = "info";
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notificationEl.textContent = message;
  notificationEl.className = "";
  if (type) {
    notificationEl.classList.add(`notification-${type}`, type);
  }

  notificationTimeout = setTimeout(() => {
    notificationEl.textContent = "";
    notificationEl.className = "";
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
            aria-label="Título de la tarea"
          >
          <div class="invalid-feedback edit-error-title"></div>
          <textarea
            class="edit-input-desc"
            placeholder="Descripción (opcional)"
            aria-label="Descripción de la tarea"
          >${escapeHTML(task.description || "")}</textarea>
          <div class="invalid-feedback edit-error-desc"></div>
          <div class="edit-row">
            <select class="edit-input-priority" aria-label="Prioridad de la tarea">
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

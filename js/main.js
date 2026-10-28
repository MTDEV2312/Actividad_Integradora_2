import {
  createTask,
  readTasks,
  updateTask,
  updateStatus,
  deleteTask
} from "./tasks.js";
import {
  getTaskFormData,
  resetTaskForm,
  toggleTaskForm,
  renderTasks,
  updateStats,
  showNotification,
  validateTaskInput
} from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const newTaskBtn = document.getElementById("new-task-btn");
  const cancelTaskBtn = document.getElementById("cancel-task-btn");
  const taskList = document.getElementById("task-list");

  let currentEditingId = null;

  const refreshUI = () => {
    const tasks = readTasks();
    renderTasks(tasks, currentEditingId);
    updateStats(tasks);
  };

  // Carga inicial
  refreshUI();

  // Abrir formulario para nueva tarea
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", () => {
      currentEditingId = null;
      toggleTaskForm(true);
      refreshUI();
    });
  }

  // Cancelar formulario de nueva tarea
  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", () => {
      toggleTaskForm(false);
    });
  }

  // Crear tarea desde formulario principal
  if (taskForm) {
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const { isValid, errors, data } = getTaskFormData();

      if (!isValid) {
        showNotification(errors.join(" | "));
        return;
      }

      createTask(data);
      resetTaskForm();
      toggleTaskForm(false);
      refreshUI();
      showNotification("¡Tarea guardada exitosamente!");
    });
  }

  // Cambiar estado (updateStatus) desde el checkbox de la card
  if (taskList) {
    taskList.addEventListener("change", (e) => {
      if (e.target.classList.contains("task-status-checkbox")) {
        const card = e.target.closest(".task-item");
        if (!card) return;
        const id = Number(card.dataset.id);

        updateStatus(id, e.target.checked);
        refreshUI();
        showNotification(e.target.checked ? "Tarea completada" : "Tarea marcada como pendiente");
      }
    });

    // Acciones de la card: eliminar (deleteTask), editar y guardar (updateTask)
    taskList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const card = btn.closest(".task-item");
      if (!card) return;
      const id = Number(card.dataset.id);
      const action = btn.dataset.action;

      // Eliminar tarea
      if (action === "delete") {
        deleteTask(id);
        if (currentEditingId === id) currentEditingId = null;
        refreshUI();
        showNotification("Tarea eliminada");
        return;
      }

      // Activar modo edición en la card
      if (action === "edit") {
        currentEditingId = id;
        toggleTaskForm(false); // Cierra form de nueva tarea si estaba abierto
        refreshUI();
        const editTitleInput = taskList.querySelector(`.task-item[data-id="${id}"] .edit-input-title`);
        editTitleInput?.focus();
        return;
      }

      // Cancelar edición inline
      if (action === "cancel-edit") {
        currentEditingId = null;
        refreshUI();
        return;
      }

      // Guardar edición (updateTask)
      if (action === "save-edit") {
        const titleInput = card.querySelector(".edit-input-title");
        const descInput = card.querySelector(".edit-input-desc");
        const prioritySelect = card.querySelector(".edit-input-priority");

        const validation = validateTaskInput(
          titleInput ? titleInput.value : "",
          descInput ? descInput.value : "",
          prioritySelect ? prioritySelect.value : "medium"
        );

        if (!validation.isValid) {
          showNotification(validation.errors.join(" | "));
          return;
        }

        updateTask(id, {
          title: validation.data.title,
          description: validation.data.description,
          priority: validation.data.priority
        });

        currentEditingId = null;
        refreshUI();
        showNotification("¡Tarea actualizada exitosamente!");
      }
    });
  }
});

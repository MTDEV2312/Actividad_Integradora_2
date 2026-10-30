import {
  createTask,
  readTasks,
  updateTask,
  updateStatus,
  deleteTask,
  searchTask,
  filtertaskByStatus,
  sortTaskByDate
} from "./tasks.js";
import { loadAPITasksToStorage } from "./api.js";
import {
  resetTaskForm,
  toggleTaskForm,
  renderTasks,
  updateStats,
  showNotification,
  validateTaskInput,
  validateFormUI,
  updateFieldValidationUI
} from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const newTaskBtn = document.getElementById("new-task-btn");
  const cancelTaskBtn = document.getElementById("cancel-task-btn");
  const taskList = document.getElementById("task-list");

  // Controles del formulario principal
  const titleInput = document.getElementById("task-title");
  const descriptionInput = document.getElementById("task-description");
  const priorityInput = document.getElementById("task-priority");

  // Controles de búsqueda, filtros y ordenamiento
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const sortSelect = document.getElementById("sort-select");

  let currentEditingId = null;

  // Actualiza UI combinando búsqueda, filtro y ordenamiento sin alterar estadísticas
  const refreshUI = () => {
    const allTasks = readTasks();

    // Las estadísticas representan TODAS las tareas
    updateStats(allTasks);

    // Pipeline combinado: Búsqueda -> Filtro de estado -> Ordenamiento
    const searchTerm = searchInput ? searchInput.value : "";
    const statusVal = statusFilter ? statusFilter.value : "all";
    const sortVal = sortSelect ? sortSelect.value : "date-desc";

    let visibleTasks = searchTask(allTasks, searchTerm);
    visibleTasks = filtertaskByStatus(visibleTasks, statusVal);
    visibleTasks = sortTaskByDate(visibleTasks, sortVal);

    renderTasks(visibleTasks, currentEditingId);
  };

  // Carga inicial (consume API si no hay tareas guardadas)
  const init = async () => {
    try {
      if (readTasks().length === 0) {
        await loadAPITasksToStorage(5);
      }
    } catch (error) {
      console.error("Error al inicializar tareas:", error);
    } finally {
      refreshUI();
    }
  };

  init();

  // Búsqueda dinámica en tiempo real
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      refreshUI();
    });
  }

  // Filtro por estado
  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      refreshUI();
    });
  }

  // Ordenamiento
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      refreshUI();
    });
  }

  // Validaciones en tiempo real para el formulario de tareas (blur / input / change)
  if (titleInput) {
    titleInput.addEventListener("blur", () => {
      validateFormUI("title");
    });
    titleInput.addEventListener("input", () => {
      if (titleInput.classList.contains("is-invalid") || titleInput.classList.contains("is-valid")) {
        validateFormUI("title");
      }
    });
  }

  if (descriptionInput) {
    descriptionInput.addEventListener("blur", () => {
      validateFormUI("description");
    });
    descriptionInput.addEventListener("input", () => {
      if (descriptionInput.classList.contains("is-invalid") || descriptionInput.classList.contains("is-valid")) {
        validateFormUI("description");
      }
    });
  }

  if (priorityInput) {
    priorityInput.addEventListener("change", () => {
      validateFormUI("priority");
    });
  }

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

  // Crear tarea desde formulario principal con validación completa y accesible
  if (taskForm) {
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const validation = validateFormUI("all");

      if (!validation.isValid) {
        showNotification(validation.errors.join(" | "), "error");
        return;
      }

      createTask(validation.data);
      resetTaskForm();
      toggleTaskForm(false);
      refreshUI();
      showNotification("¡Tarea guardada exitosamente!", "success");
    });

    taskForm.addEventListener("reset", () => {
      resetTaskForm();
    });
  }

  // Eventos de la lista de tareas
  if (taskList) {
    // Cambiar estado (updateStatus)
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

    // Acciones de card: eliminar (deleteTask), editar y guardar (updateTask)
    taskList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const card = btn.closest(".task-item");
      if (!card) return;
      const id = Number(card.dataset.id);
      const action = btn.dataset.action;

      if (action === "delete") {
        deleteTask(id);
        if (currentEditingId === id) currentEditingId = null;
        refreshUI();
        showNotification("Tarea eliminada");
        return;
      }

      if (action === "edit") {
        currentEditingId = id;
        toggleTaskForm(false);
        refreshUI();
        const editTitleInput = taskList.querySelector(`.task-item[data-id="${id}"] .edit-input-title`);
        editTitleInput?.focus();
        return;
      }

      if (action === "cancel-edit") {
        currentEditingId = null;
        refreshUI();
        return;
      }

      if (action === "save-edit") {
        const titleInputEdit = card.querySelector(".edit-input-title");
        const descInputEdit = card.querySelector(".edit-input-desc");
        const prioritySelectEdit = card.querySelector(".edit-input-priority");
        const errTitleEdit = card.querySelector(".edit-error-title");
        const errDescEdit = card.querySelector(".edit-error-desc");

        const validation = validateTaskInput(
          titleInputEdit ? titleInputEdit.value : "",
          descInputEdit ? descInputEdit.value : "",
          prioritySelectEdit ? prioritySelectEdit.value : "medium"
        );

        updateFieldValidationUI(titleInputEdit, errTitleEdit, validation.fieldErrors.title);
        updateFieldValidationUI(descInputEdit, errDescEdit, validation.fieldErrors.description);

        if (!validation.isValid) {
          if (validation.fieldErrors.title && titleInputEdit) {
            titleInputEdit.focus();
          } else if (validation.fieldErrors.description && descInputEdit) {
            descInputEdit.focus();
          }
          showNotification(validation.errors.join(" | "), "error");
          return;
        }

        updateTask(id, {
          title: validation.data.title,
          description: validation.data.description,
          priority: validation.data.priority
        });

        currentEditingId = null;
        refreshUI();
        showNotification("¡Tarea actualizada exitosamente!", "success");
      }
    });
  }
});

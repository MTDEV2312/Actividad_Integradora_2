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

  // Carga inicial
  refreshUI();

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

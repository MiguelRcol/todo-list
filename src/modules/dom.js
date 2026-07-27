import { saveApp } from "./storage.js";

let currentView = "project";

function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDueDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function capitalizeText(text) {
  if (!text) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}

function getAllTodoEntries(todoApp) {
  return todoApp.projects.flatMap((project) =>
    project.todos.map((todo) => ({
      todo,
      projectId: project.id,
      projectName: project.name,
    }))
  );
}

function setActiveSidebarButton(viewName) {
  const buttons = document.querySelectorAll(
    ".sidebar-nav__button"
  );

  buttons.forEach((button) => {
    button.classList.remove(
      "sidebar-nav__button--active"
    );
  });

  if (!viewName) {
    return;
  }

  const activeButton = document.querySelector(
    `[data-view="${viewName}"]`
  );

  if (activeButton) {
    activeButton.classList.add(
      "sidebar-nav__button--active"
    );
  }
}

function updateContentHeader(label, title) {
  const headerLabel = document.querySelector(
    ".content-header__label"
  );

  const headerTitle = document.querySelector(
    "#current-view-title"
  );

  headerLabel.textContent = label;
  headerTitle.textContent = title;
}

function renderProjects(todoApp) {
  const projectsList = document.querySelector(
    "#projects-list"
  );

  projectsList.replaceChildren();

  const customProjects = todoApp.projects.filter(
    (project) =>
      project.id !== todoApp.defaultProjectId
  );

  customProjects.forEach((project) => {
    const projectRow = document.createElement("div");

    projectRow.classList.add("project-row");
    projectRow.dataset.projectId = project.id;

    const projectButton =
      document.createElement("button");

    projectButton.type = "button";
    projectButton.classList.add("project-item");
    projectButton.textContent = project.name;
    projectButton.dataset.projectId = project.id;

    if (
      currentView === "project" &&
      project.id === todoApp.activeProjectId
    ) {
      projectButton.classList.add(
        "project-item--active"
      );
    }

    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";

    deleteButton.classList.add(
      "icon-button",
      "project-delete"
    );

    deleteButton.dataset.action =
      "delete-project";

    deleteButton.textContent = "×";

    deleteButton.setAttribute(
      "aria-label",
      `Delete ${project.name}`
    );

    projectRow.append(
      projectButton,
      deleteButton
    );

    projectsList.appendChild(projectRow);
  });
}

function renderCurrentProject(todoApp) {
  const activeProject = todoApp.getActiveProject();

  if (!activeProject) {
    return;
  }

  updateContentHeader(
    "Project",
    activeProject.name
  );
}

function renderTodoEntries(
  entries,
  emptyTitle,
  emptyDescription,
  showProjectName = false
) {
  const todosList = document.querySelector(
    "#todos-list"
  );

  todosList.replaceChildren();

  if (entries.length === 0) {
    const emptyState =
      document.createElement("div");

    emptyState.classList.add("empty-state");

    const title = document.createElement("h2");

    title.classList.add(
      "empty-state__title"
    );

    title.textContent = emptyTitle;

    const description =
      document.createElement("p");

    description.classList.add(
      "empty-state__description"
    );

    description.textContent = emptyDescription;

    emptyState.append(title, description);
    todosList.appendChild(emptyState);

    return;
  }

  entries.forEach((entry) => {
    const {
      todo,
      projectId,
      projectName,
    } = entry;

    const todoCard =
      document.createElement("article");

    todoCard.classList.add(
      "todo-card",
      `todo-card--${todo.priority}`
    );

    todoCard.dataset.todoId = todo.id;
    todoCard.dataset.projectId = projectId;

    if (todo.completed) {
      todoCard.classList.add(
        "todo-card--completed"
      );
    }

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.classList.add(
      "todo-card__checkbox"
    );

    checkbox.checked = todo.completed;

    checkbox.setAttribute(
      "aria-label",
      todo.completed
        ? `Mark ${todo.title} as incomplete`
        : `Mark ${todo.title} as completed`
    );

    const content =
      document.createElement("div");

    content.classList.add(
      "todo-card__content"
    );

    const title =
      document.createElement("h2");

    title.classList.add(
      "todo-card__title"
    );

    title.textContent = todo.title;

    const metadata =
      document.createElement("p");

    metadata.classList.add(
      "todo-card__date"
    );

    const formattedDate = formatDueDate(
      todo.dueDate
    );

    metadata.textContent = showProjectName
      ? `${formattedDate} · ${projectName}`
      : formattedDate;

    const actions =
      document.createElement("div");

    actions.classList.add(
      "todo-card__actions"
    );

    const detailsButton =
      document.createElement("button");

    detailsButton.type = "button";

    detailsButton.classList.add(
      "todo-card__details",
      "secondary-button"
    );

    detailsButton.textContent = "Details";
    detailsButton.dataset.action = "details";

    detailsButton.setAttribute(
      "aria-label",
      `View details for ${todo.title}`
    );

    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";

    deleteButton.classList.add(
      "icon-button",
      "todo-card__delete"
    );

    deleteButton.textContent = "×";
    deleteButton.dataset.action = "delete";

    deleteButton.setAttribute(
      "aria-label",
      `Delete ${todo.title}`
    );

    content.append(title, metadata);

    actions.append(
      detailsButton,
      deleteButton
    );

    todoCard.append(
      checkbox,
      content,
      actions
    );

    todosList.appendChild(todoCard);
  });
}

function renderTodos(todoApp) {
  const activeProject =
    todoApp.getActiveProject();

  if (!activeProject) {
    renderTodoEntries(
      [],
      "Project not found",
      "The selected project is no longer available."
    );

    return;
  }

  const entries = activeProject.todos.map(
    (todo) => ({
      todo,
      projectId: activeProject.id,
      projectName: activeProject.name,
    })
  );

  renderCurrentProject(todoApp);

  renderTodoEntries(
    entries,
    "No tasks yet",
    "Create your first task to start organizing this project."
  );
}

function renderFilteredView(
  todoApp,
  viewName
) {
  const allEntries =
    getAllTodoEntries(todoApp);

  const today = getTodayDateString();

  let filteredEntries = [];
  let title = "";
  let emptyTitle = "";
  let emptyDescription = "";

  if (viewName === "today") {
    title = "Today";

    filteredEntries = allEntries.filter(
      ({ todo }) =>
        todo.dueDate === today &&
        !todo.completed
    );

    emptyTitle = "Nothing due today";

    emptyDescription =
      "You have no pending tasks scheduled for today.";
  }

  if (viewName === "upcoming") {
    title = "Upcoming";

    filteredEntries = allEntries.filter(
      ({ todo }) =>
        todo.dueDate &&
        todo.dueDate > today &&
        !todo.completed
    );

    filteredEntries.sort(
      (firstEntry, secondEntry) =>
        firstEntry.todo.dueDate.localeCompare(
          secondEntry.todo.dueDate
        )
    );

    emptyTitle = "No upcoming tasks";

    emptyDescription =
      "Tasks with future due dates will appear here.";
  }

  if (viewName === "completed") {
    title = "Completed";

    filteredEntries = allEntries.filter(
      ({ todo }) => todo.completed
    );

    emptyTitle = "No completed tasks";

    emptyDescription =
      "Tasks you complete will appear here.";
  }

  updateContentHeader("Filter", title);

  renderTodoEntries(
    filteredEntries,
    emptyTitle,
    emptyDescription,
    true
  );
}

function renderCurrentView(todoApp) {
  if (currentView === "project") {
    renderTodos(todoApp);
    return;
  }

  renderFilteredView(todoApp, currentView);
}

function setupProjectNavigation(todoApp) {
  const projectsList = document.querySelector(
    "#projects-list"
  );

  projectsList.addEventListener(
    "click",
    (event) => {
      const deleteButton = event.target.closest(
        '[data-action="delete-project"]'
      );

      if (deleteButton) {
        const projectRow = deleteButton.closest(
          ".project-row"
        );

        if (!projectRow) {
          return;
        }

        const projectId =
          projectRow.dataset.projectId;

        const project =
          todoApp.getProjectById(projectId);

        if (!project) {
          return;
        }

        const confirmed = window.confirm(
          `Delete "${project.name}" and all its tasks?`
        );

        if (!confirmed) {
          return;
        }

        const wasActive =
          todoApp.activeProjectId === projectId;

        const removed =
          todoApp.removeProject(projectId);

        if (!removed) {
          return;
        }

        if (
          wasActive &&
          currentView === "project"
        ) {
          currentView = "project";
          setActiveSidebarButton("inbox");
        }

        saveApp(todoApp);

        renderProjects(todoApp);
        renderCurrentView(todoApp);

        return;
      }

      const projectButton = event.target.closest(
        ".project-item"
      );

      if (!projectButton) {
        return;
      }

      const projectId =
        projectButton.dataset.projectId;

      const changed =
        todoApp.setActiveProject(projectId);

      if (!changed) {
        return;
      }

      currentView = "project";

      setActiveSidebarButton(null);

      saveApp(todoApp);

      renderProjects(todoApp);
      renderCurrentView(todoApp);
    }
  );
}

function setupInboxNavigation(todoApp) {
  const sidebarNavigation =
    document.querySelector(".sidebar-nav");

  sidebarNavigation.addEventListener(
    "click",
    (event) => {
      const viewButton = event.target.closest(
        "[data-view]"
      );

      if (!viewButton) {
        return;
      }

      const viewName =
        viewButton.dataset.view;

      if (viewName === "inbox") {
        const changed =
          todoApp.setActiveProject(
            todoApp.defaultProjectId
          );

        if (!changed) {
          return;
        }

        currentView = "project";

        setActiveSidebarButton("inbox");

        saveApp(todoApp);

        renderProjects(todoApp);
        renderCurrentView(todoApp);

        return;
      }

      if (
        viewName !== "today" &&
        viewName !== "upcoming" &&
        viewName !== "completed"
      ) {
        return;
      }

      currentView = viewName;

      setActiveSidebarButton(viewName);

      renderProjects(todoApp);
      renderCurrentView(todoApp);
    }
  );
}

function populateProjectOptions(todoApp) {
  const projectSelect = document.querySelector(
    "#todo-project"
  );

  projectSelect.replaceChildren();

  todoApp.projects.forEach((project) => {
    const option =
      document.createElement("option");

    option.value = project.id;
    option.textContent = project.name;

    if (
      project.id === todoApp.activeProjectId
    ) {
      option.selected = true;
    }

    projectSelect.appendChild(option);
  });
}

function setupTodoInteractions(todoApp) {
  const todosList = document.querySelector(
    "#todos-list"
  );

  const detailsDialog = document.querySelector(
    "#todo-details-dialog"
  );

  const closeDetailsButton =
    document.querySelector(
      "#close-details-dialog"
    );

  const cancelDetailsButton =
    document.querySelector(
      "#cancel-details-dialog"
    );

  const editTodoButton =
    document.querySelector(
      "#open-edit-todo-form"
    );

  const detailsTitle =
    document.querySelector("#details-title");

  const detailsDescription =
    document.querySelector(
      "#details-description"
    );

  const detailsDueDate =
    document.querySelector(
      "#details-due-date"
    );

  const detailsPriority =
    document.querySelector(
      "#details-priority"
    );

  const detailsStatus =
    document.querySelector(
      "#details-status"
    );

  const detailsProject =
    document.querySelector(
      "#details-project"
    );

  const detailsNotes =
    document.querySelector("#details-notes");

  let selectedTodoId = null;
  let selectedProjectId = null;

  function closeDetailsDialog() {
    detailsDialog.close();
  }

  closeDetailsButton.addEventListener(
    "click",
    closeDetailsDialog
  );

  cancelDetailsButton.addEventListener(
    "click",
    closeDetailsDialog
  );

  todosList.addEventListener(
    "change",
    (event) => {
      const checkbox = event.target.closest(
        ".todo-card__checkbox"
      );

      if (!checkbox) {
        return;
      }

      const todoCard = checkbox.closest(
        ".todo-card"
      );

      if (!todoCard) {
        return;
      }

      const todoId =
        todoCard.dataset.todoId;

      const projectId =
        todoCard.dataset.projectId;

      const changed =
        todoApp.toggleTodoComplete(
          todoId,
          projectId
        );

      if (!changed) {
        return;
      }

      saveApp(todoApp);
      renderCurrentView(todoApp);
    }
  );

  todosList.addEventListener(
    "click",
    (event) => {
      const actionButton =
        event.target.closest("[data-action]");

      if (!actionButton) {
        return;
      }

      const todoCard = actionButton.closest(
        ".todo-card"
      );

      if (!todoCard) {
        return;
      }

      const todoId =
        todoCard.dataset.todoId;

      const projectId =
        todoCard.dataset.projectId;

      const action =
        actionButton.dataset.action;

      const project =
        todoApp.getProjectById(projectId);

      if (!project) {
        return;
      }

      const todo =
        project.getTodoById(todoId);

      if (!todo) {
        return;
      }

      if (action === "delete") {
        const removed =
          todoApp.removeTodo(
            todoId,
            projectId
          );

        if (!removed) {
          return;
        }

        saveApp(todoApp);
        renderCurrentView(todoApp);

        return;
      }

      if (action === "details") {
        selectedTodoId = todo.id;
        selectedProjectId = project.id;

        detailsTitle.textContent =
          todo.title;

        detailsDescription.textContent =
          todo.description ||
          "No description";

        detailsDueDate.textContent =
          formatDueDate(todo.dueDate);

        detailsPriority.textContent =
          capitalizeText(todo.priority) ||
          "No priority";

        detailsStatus.textContent =
          todo.completed
            ? "Completed"
            : "Pending";

        detailsProject.textContent =
          project.name;

        detailsNotes.textContent =
          todo.notes || "No notes";

        detailsDialog.showModal();
      }
    }
  );

  editTodoButton.addEventListener(
    "click",
    () => {
      const project =
        todoApp.getProjectById(
          selectedProjectId
        );

      if (!project) {
        return;
      }

      const todo =
        project.getTodoById(
          selectedTodoId
        );

      if (!todo) {
        return;
      }

      const todoDialog =
        document.querySelector(
          "#todo-dialog"
        );

      const todoForm =
        document.querySelector(
          "#todo-form"
        );

      const dialogTitle =
        document.querySelector(
          "#todo-dialog-title"
        );

      const submitButton =
        todoForm.querySelector(
          'button[type="submit"]'
        );

      const titleInput =
        document.querySelector(
          "#todo-title"
        );

      const descriptionInput =
        document.querySelector(
          "#todo-description"
        );

      const dueDateInput =
        document.querySelector(
          "#todo-due-date"
        );

      const prioritySelect =
        document.querySelector(
          "#todo-priority"
        );

      const projectSelect =
        document.querySelector(
          "#todo-project"
        );

      const notesInput =
        document.querySelector(
          "#todo-notes"
        );

      populateProjectOptions(todoApp);

      todoForm.dataset.mode = "edit";
      todoForm.dataset.todoId = todo.id;
      todoForm.dataset.projectId =
        project.id;

      dialogTitle.textContent =
        "Edit task";

      submitButton.textContent =
        "Save changes";

      titleInput.value = todo.title;

      descriptionInput.value =
        todo.description || "";

      dueDateInput.value =
        todo.dueDate || "";

      prioritySelect.value =
        todo.priority || "medium";

      projectSelect.value = project.id;

      notesInput.value =
        todo.notes || "";

      projectSelect.disabled = true;

      detailsDialog.close();
      todoDialog.showModal();

      titleInput.focus();
    }
  );
}

function setupProjectForm(todoApp) {
  const dialog = document.querySelector(
    "#project-dialog"
  );

  const form = document.querySelector(
    "#project-form"
  );

  const nameInput = document.querySelector(
    "#project-name"
  );

  const errorMessage =
    document.querySelector(
      "#project-name-error"
    );

  const openButton =
    document.querySelector(
      "#open-project-form"
    );

  const closeButton =
    document.querySelector(
      "#close-project-form"
    );

  const cancelButton =
    document.querySelector(
      "#cancel-project-form"
    );

  openButton.addEventListener("click", () => {
    dialog.showModal();
    nameInput.focus();
  });

  function closeDialog() {
    form.reset();

    errorMessage.textContent = "";

    nameInput.removeAttribute(
      "aria-invalid"
    );

    dialog.close();
  }

  closeButton.addEventListener(
    "click",
    closeDialog
  );

  cancelButton.addEventListener(
    "click",
    closeDialog
  );

  dialog.addEventListener(
    "cancel",
    (event) => {
      event.preventDefault();
      closeDialog();
    }
  );

  nameInput.addEventListener(
    "input",
    () => {
      if (nameInput.value.trim()) {
        errorMessage.textContent = "";

        nameInput.removeAttribute(
          "aria-invalid"
        );
      }
    }
  );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const projectName =
        nameInput.value.trim();

      if (!projectName) {
        errorMessage.textContent =
          "Please enter a project name.";

        nameInput.setAttribute(
          "aria-invalid",
          "true"
        );

        nameInput.focus();

        return;
      }

      const newProject =
        todoApp.addProject(projectName);

      todoApp.setActiveProject(
        newProject.id
      );

      currentView = "project";

      setActiveSidebarButton(null);

      saveApp(todoApp);

      renderProjects(todoApp);
      renderCurrentView(todoApp);

      closeDialog();
    }
  );
}

function setupTodoForm(todoApp) {
  const dialog = document.querySelector(
    "#todo-dialog"
  );

  const form = document.querySelector(
    "#todo-form"
  );

  const dialogTitle =
    document.querySelector(
      "#todo-dialog-title"
    );

  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );

  const titleInput =
    document.querySelector("#todo-title");

  const descriptionInput =
    document.querySelector(
      "#todo-description"
    );

  const dueDateInput =
    document.querySelector(
      "#todo-due-date"
    );

  const prioritySelect =
    document.querySelector(
      "#todo-priority"
    );

  const projectSelect =
    document.querySelector(
      "#todo-project"
    );

  const notesInput =
    document.querySelector("#todo-notes");

  const errorMessage =
    document.querySelector(
      "#todo-title-error"
    );

  const openButton =
    document.querySelector(
      "#open-todo-form"
    );

  const closeButton =
    document.querySelector(
      "#close-todo-form"
    );

  const cancelButton =
    document.querySelector(
      "#cancel-todo-form"
    );

  form.dataset.mode = "create";

  openButton.addEventListener("click", () => {
    form.reset();

    form.dataset.mode = "create";

    delete form.dataset.todoId;
    delete form.dataset.projectId;

    dialogTitle.textContent =
      "New task";

    submitButton.textContent =
      "Create task";

    projectSelect.disabled = false;

    errorMessage.textContent = "";

    titleInput.removeAttribute(
      "aria-invalid"
    );

    populateProjectOptions(todoApp);

    dialog.showModal();
    titleInput.focus();
  });

  function closeDialog() {
    form.reset();

    form.dataset.mode = "create";

    delete form.dataset.todoId;
    delete form.dataset.projectId;

    dialogTitle.textContent =
      "New task";

    submitButton.textContent =
      "Create task";

    projectSelect.disabled = false;

    errorMessage.textContent = "";

    titleInput.removeAttribute(
      "aria-invalid"
    );

    dialog.close();
  }

  closeButton.addEventListener(
    "click",
    closeDialog
  );

  cancelButton.addEventListener(
    "click",
    closeDialog
  );

  dialog.addEventListener(
    "cancel",
    (event) => {
      event.preventDefault();
      closeDialog();
    }
  );

  titleInput.addEventListener(
    "input",
    () => {
      if (titleInput.value.trim()) {
        errorMessage.textContent = "";

        titleInput.removeAttribute(
          "aria-invalid"
        );
      }
    }
  );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const title =
        titleInput.value.trim();

      const description =
        descriptionInput.value.trim();

      const dueDate =
        dueDateInput.value;

      const priority =
        prioritySelect.value;

      const projectId =
        projectSelect.value;

      const notes =
        notesInput.value.trim();

      if (!title) {
        errorMessage.textContent =
          "Please enter a task title.";

        titleInput.setAttribute(
          "aria-invalid",
          "true"
        );

        titleInput.focus();

        return;
      }

      if (form.dataset.mode === "edit") {
        const todoId =
          form.dataset.todoId;

        const originalProjectId =
          form.dataset.projectId;

        const updated =
          todoApp.updateTodo(
            todoId,
            {
              title,
              description,
              dueDate,
              priority,
              notes,
            },
            originalProjectId
          );

        if (!updated) {
          errorMessage.textContent =
            "The task could not be updated.";

          return;
        }

        saveApp(todoApp);
        renderCurrentView(todoApp);
        closeDialog();

        return;
      }

      const newTodo = todoApp.addTodo(
        title,
        description,
        dueDate,
        priority,
        notes,
        projectId
      );

      if (!newTodo) {
        errorMessage.textContent =
          "The selected project could not be found.";

        return;
      }

      todoApp.setActiveProject(projectId);

      currentView = "project";

      if (
        projectId ===
        todoApp.defaultProjectId
      ) {
        setActiveSidebarButton("inbox");
      } else {
        setActiveSidebarButton(null);
      }

      saveApp(todoApp);

      renderProjects(todoApp);
      renderCurrentView(todoApp);

      closeDialog();
    }
  );
}

export {
  renderProjects,
  renderCurrentProject,
  renderTodos,
  setupProjectNavigation,
  setupInboxNavigation,
  setupTodoInteractions,
  setupProjectForm,
  setupTodoForm,
};
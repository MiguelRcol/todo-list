function renderProjects(todoApp) {
  const projectsList = document.querySelector("#projects-list");

  projectsList.replaceChildren();

  const customProjects = todoApp.projects.filter(
    (project) => project.id !== todoApp.defaultProjectId
  );

  customProjects.forEach((project) => {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("project-item");
    button.textContent = project.name;
    button.dataset.projectId = project.id;

    if (project.id === todoApp.activeProjectId) {
      button.classList.add("project-item--active");
    }

    projectsList.appendChild(button);
  });
}

function renderCurrentProject(todoApp) {
  const currentViewTitle = document.querySelector(
    "#current-view-title"
  );

  const activeProject = todoApp.getActiveProject();

  if (!activeProject) {
    return;
  }

  currentViewTitle.textContent = activeProject.name;
}

function renderTodos(todoApp) {
  const todosList = document.querySelector("#todos-list");
  const activeProject = todoApp.getActiveProject();

  todosList.replaceChildren();

  if (!activeProject || activeProject.todos.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.classList.add("empty-state");

    const title = document.createElement("h2");
    title.classList.add("empty-state__title");
    title.textContent = "No tasks yet";

    const description = document.createElement("p");
    description.classList.add("empty-state__description");
    description.textContent =
      "Create your first task to start organizing this project.";

    emptyState.append(title, description);
    todosList.appendChild(emptyState);

    return;
  }

  activeProject.todos.forEach((todo) => {
    const todoCard = document.createElement("article");

    todoCard.classList.add(
      "todo-card",
      `todo-card--${todo.priority}`
    );

    todoCard.dataset.todoId = todo.id;

    if (todo.completed) {
      todoCard.classList.add("todo-card--completed");
    }

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.classList.add("todo-card__checkbox");
    checkbox.checked = todo.completed;

    checkbox.setAttribute(
      "aria-label",
      todo.completed
        ? `Mark ${todo.title} as incomplete`
        : `Mark ${todo.title} as completed`
    );

    const content = document.createElement("div");
    content.classList.add("todo-card__content");

    const title = document.createElement("h2");
    title.classList.add("todo-card__title");
    title.textContent = todo.title;

    const dueDate = document.createElement("p");
    dueDate.classList.add("todo-card__date");
    dueDate.textContent = todo.dueDate || "No due date";

    const actions = document.createElement("div");
    actions.classList.add("todo-card__actions");

    const detailsButton = document.createElement("button");

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

    const deleteButton = document.createElement("button");

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

    content.append(title, dueDate);
    actions.appendChild(detailsButton);
    actions.appendChild(deleteButton);

    todoCard.append(checkbox, content, actions);
    todosList.appendChild(todoCard);
  });
}

function setupProjectNavigation(todoApp) {
  const projectsList = document.querySelector("#projects-list");

  projectsList.addEventListener("click", (event) => {
    const projectButton = event.target.closest(".project-item");

    if (!projectButton) {
      return;
    }

    const projectId = projectButton.dataset.projectId;
    const changed = todoApp.setActiveProject(projectId);

    if (!changed) {
      return;
    }

    const sidebarButtons = document.querySelectorAll(
      ".sidebar-nav__button"
    );

    sidebarButtons.forEach((button) => {
      button.classList.remove(
        "sidebar-nav__button--active"
      );
    });

    renderProjects(todoApp);
    renderCurrentProject(todoApp);
    renderTodos(todoApp);
  });
}

function setupInboxNavigation(todoApp) {
  const inboxButton = document.querySelector(
    '[data-view="inbox"]'
  );

  inboxButton.addEventListener("click", () => {
    const changed = todoApp.setActiveProject(
      todoApp.defaultProjectId
    );

    if (!changed) {
      return;
    }

    const sidebarButtons = document.querySelectorAll(
      ".sidebar-nav__button"
    );

    sidebarButtons.forEach((button) => {
      button.classList.remove(
        "sidebar-nav__button--active"
      );
    });

    inboxButton.classList.add(
      "sidebar-nav__button--active"
    );

    renderProjects(todoApp);
    renderCurrentProject(todoApp);
    renderTodos(todoApp);
  });
}

function setupTodoInteractions(todoApp){
  const todosList = document.querySelector("#todos-list");

  const detailsDialog = document.querySelector(
    "#todo-details-dialog"
  );

  const closeDetailsButton = document.querySelector(
    "#close-details-dialog"
  );

  const cancelDetailsButton = document.querySelector(
    "#cancel-details-dialog"
  );

  const detailsTitle = document.querySelector(
    "#details-title"
  );

  const detailsDescription = document.querySelector(
    "#details-description"
  );

  const detailsDueDate = document.querySelector(
    "#details-due-date"
  );

  const detailsPriority = document.querySelector(
    "#details-priority"
  );

  const detailsStatus = document.querySelector(
    "#details-status"
  );

  const detailsProject = document.querySelector(
    "#details-project"
  );

  const detailsNotes = document.querySelector(
    "#details-notes"
  );

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

  todosList.addEventListener("change", (event) => {
    const checkbox = event.target.closest(
      ".todo-card__checkbox"
    );

    if (!checkbox) {
      return;
    }

    const todoCard = checkbox.closest(".todo-card");

    if (!todoCard) {
      return;
    }

    const todoId = todoCard.dataset.todoId;
    const changed = todoApp.toggleTodoComplete(todoId);

    if (!changed) {
      return;
    }

    renderTodos(todoApp);
  });

  todosList.addEventListener("click", (event) => {
    const actionButton = event.target.closest(
      "[data-action]"
    );

    if (!actionButton) {
      return;
    }

    const todoCard = actionButton.closest(".todo-card");

    if (!todoCard) {
      return;
    }

    const todoId = todoCard.dataset.todoId;
    const action = actionButton.dataset.action;

    if (action === "delete") {
      const removed = todoApp.removeTodo(todoId);

      if (!removed) {
        return;
      }

      renderTodos(todoApp);
      return;
    }

    if (action === "details") {
      const activeProject = todoApp.getActiveProject();

      if (!activeProject) {
        return;
      }

      const todo = activeProject.getTodoById(todoId);

      if (!todo) {
        return;
      }

      detailsTitle.textContent = todo.title;

      detailsDescription.textContent =
        todo.description || "No description";

      detailsDueDate.textContent =
        todo.dueDate || "No due date";

      detailsPriority.textContent = todo.priority
        ? todo.priority.charAt(0).toUpperCase() +
          todo.priority.slice(1)
        : "No priority";

      detailsStatus.textContent = todo.completed
        ? "Completed"
        : "Pending";

      detailsProject.textContent = activeProject.name;

      detailsNotes.textContent =
        todo.notes || "No notes";

      detailsDialog.showModal();
    }
  });
}

function setupProjectForm(todoApp) {
  const dialog = document.querySelector("#project-dialog");
  const form = document.querySelector("#project-form");
  const nameInput = document.querySelector("#project-name");

  const errorMessage = document.querySelector(
    "#project-name-error"
  );

  const openButton = document.querySelector(
    "#open-project-form"
  );

  const closeButton = document.querySelector(
    "#close-project-form"
  );

  const cancelButton = document.querySelector(
    "#cancel-project-form"
  );

  openButton.addEventListener("click", () => {
    dialog.showModal();
    nameInput.focus();
  });

  function closeDialog() {
    form.reset();
    errorMessage.textContent = "";
    nameInput.removeAttribute("aria-invalid");
    dialog.close();
  }

  closeButton.addEventListener("click", closeDialog);
  cancelButton.addEventListener("click", closeDialog);

  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim()) {
      errorMessage.textContent = "";
      nameInput.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const projectName = nameInput.value.trim();

    if (!projectName) {
      errorMessage.textContent =
        "Please enter a project name.";

      nameInput.setAttribute("aria-invalid", "true");
      nameInput.focus();

      return;
    }

    todoApp.addProject(projectName);
    renderProjects(todoApp);

    closeDialog();
  });
}

function populateProjectOptions(todoApp) {
  const projectSelect = document.querySelector(
    "#todo-project"
  );

  projectSelect.replaceChildren();

  todoApp.projects.forEach((project) => {
    const option = document.createElement("option");

    option.value = project.id;
    option.textContent = project.name;

    if (project.id === todoApp.activeProjectId) {
      option.selected = true;
    }

    projectSelect.appendChild(option);
  });
}

function setupTodoForm(todoApp) {
  const dialog = document.querySelector("#todo-dialog");
  const form = document.querySelector("#todo-form");

  const titleInput = document.querySelector("#todo-title");

  const descriptionInput = document.querySelector(
    "#todo-description"
  );

  const dueDateInput = document.querySelector(
    "#todo-due-date"
  );

  const prioritySelect = document.querySelector(
    "#todo-priority"
  );

  const projectSelect = document.querySelector(
    "#todo-project"
  );

  const notesInput = document.querySelector("#todo-notes");

  const errorMessage = document.querySelector(
    "#todo-title-error"
  );

  const openButton = document.querySelector(
    "#open-todo-form"
  );

  const closeButton = document.querySelector(
    "#close-todo-form"
  );

  const cancelButton = document.querySelector(
    "#cancel-todo-form"
  );

  openButton.addEventListener("click", () => {
    populateProjectOptions(todoApp);
    dialog.showModal();
    titleInput.focus();
  });

  function closeDialog() {
    form.reset();
    errorMessage.textContent = "";
    titleInput.removeAttribute("aria-invalid");
    dialog.close();
  }

  closeButton.addEventListener("click", closeDialog);
  cancelButton.addEventListener("click", closeDialog);

  titleInput.addEventListener("input", () => {
    if (titleInput.value.trim()) {
      errorMessage.textContent = "";
      titleInput.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
    const projectId = projectSelect.value;
    const notes = notesInput.value.trim();

    if (!title) {
      errorMessage.textContent =
        "Please enter a task title.";

      titleInput.setAttribute("aria-invalid", "true");
      titleInput.focus();

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

    const sidebarButtons = document.querySelectorAll(
      ".sidebar-nav__button"
    );

    sidebarButtons.forEach((button) => {
      button.classList.remove(
        "sidebar-nav__button--active"
      );
    });

    if (projectId === todoApp.defaultProjectId) {
      const inboxButton = document.querySelector(
        '[data-view="inbox"]'
      );

      inboxButton.classList.add(
        "sidebar-nav__button--active"
      );
    }

    renderProjects(todoApp);
    renderCurrentProject(todoApp);
    renderTodos(todoApp);

    closeDialog();
  });
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
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
      `Mark ${todo.title} as completed`
    );

    const content = document.createElement("div");
    content.classList.add("todo-card__content");

    const title = document.createElement("h2");
    title.classList.add("todo-card__title");
    title.textContent = todo.title;

    const dueDate = document.createElement("p");
    dueDate.classList.add("todo-card__date");
    dueDate.textContent = todo.dueDate || "No due date";

    content.append(title, dueDate);
    todoCard.append(checkbox, content);
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

function setupTodoInteractions(todoApp) {
  const todosList = document.querySelector("#todos-list");

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
}

export {
  renderProjects,
  renderCurrentProject,
  renderTodos,
  setupProjectNavigation,
  setupInboxNavigation,
  setupTodoInteractions,
};
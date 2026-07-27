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
      button.classList.remove("sidebar-nav__button--active");
    });

    renderProjects(todoApp);
    renderCurrentProject(todoApp);
  });
}

export {
  renderProjects,
  renderCurrentProject,
  setupProjectNavigation,
};
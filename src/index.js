import "./styles.css";

import TodoApp from "./modules/TodoApp.js";

import {
  renderProjects,
  renderCurrentProject,
  setupProjectNavigation,
} from "./modules/dom.js";

const todoApp = new TodoApp();

todoApp.addProject("Programming");
todoApp.addProject("University");
todoApp.addProject("Personal");

renderProjects(todoApp);
renderCurrentProject(todoApp);
setupProjectNavigation(todoApp);
import "./styles.css";

import {
  loadApp,
  saveApp,
} from "./modules/storage.js";

import {
  renderProjects,
  renderTodos,
  setupProjectNavigation,
  setupInboxNavigation,
  setupTodoInteractions,
  setupProjectForm,
  setupTodoForm,
} from "./modules/dom.js";

const todoApp = loadApp();

saveApp(todoApp);

renderProjects(todoApp);
renderTodos(todoApp);

setupProjectNavigation(todoApp);
setupInboxNavigation(todoApp);
setupTodoInteractions(todoApp);
setupProjectForm(todoApp);
setupTodoForm(todoApp);
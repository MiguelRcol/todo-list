import "./styles.css";

import TodoApp from "./modules/TodoApp.js";

import {
  renderProjects,
  renderCurrentProject,
  renderTodos,
  setupProjectNavigation,
  setupInboxNavigation,
  setupTodoInteractions,
  setupProjectForm,
  setupTodoForm,
} from "./modules/dom.js";

const todoApp = new TodoApp();

const programming = todoApp.addProject("Programming");
const university = todoApp.addProject("University");

todoApp.addProject("Personal");

todoApp.addTodo(
  "Finish Todo List",
  "Continue building the DOM module",
  "2026-08-05",
  "high",
  "",
  programming.id
);

todoApp.addTodo(
  "Review class notes",
  "Prepare for the next lesson",
  "2026-08-08",
  "medium",
  "",
  university.id
);

renderProjects(todoApp);
renderCurrentProject(todoApp);
renderTodos(todoApp);

setupProjectNavigation(todoApp);
setupInboxNavigation(todoApp);
setupTodoInteractions(todoApp);
setupProjectForm(todoApp);
setupTodoForm(todoApp);
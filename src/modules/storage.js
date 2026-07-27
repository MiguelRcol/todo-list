import TodoApp from "./TodoApp.js";
import Project from "./Project.js";
import Todo from "./Todo.js";

const STORAGE_KEY = "focusboard-data";

function parseStoredDate(value) {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return date;
}

function restoreTodo(todoData) {
  const todo = new Todo(
    todoData.title || "",
    todoData.description || "",
    todoData.dueDate || "",
    todoData.priority || "medium",
    todoData.notes || ""
  );

  todo.id = todoData.id || crypto.randomUUID();
  todo.completed = Boolean(todoData.completed);
  todo.createdAt = parseStoredDate(todoData.createdAt);

  return todo;
}

function restoreProject(projectData) {
  const project = new Project(
    projectData.name || "Untitled project"
  );

  project.id =
    projectData.id || crypto.randomUUID();

  project.createdAt = parseStoredDate(
    projectData.createdAt
  );

  project.todos = Array.isArray(projectData.todos)
    ? projectData.todos.map(restoreTodo)
    : [];

  return project;
}

function saveApp(todoApp) {
  try {
    const serializedApp = JSON.stringify(todoApp);

    localStorage.setItem(
      STORAGE_KEY,
      serializedApp
    );

    return true;
  } catch (error) {
    console.error(
      "FocusBoard could not save its data:",
      error
    );

    return false;
  }
}

function loadApp() {
  const storedApp = localStorage.getItem(STORAGE_KEY);

  if (!storedApp) {
    return new TodoApp();
  }

  try {
    const parsedApp = JSON.parse(storedApp);

    if (
      !Array.isArray(parsedApp.projects) ||
      parsedApp.projects.length === 0
    ) {
      return new TodoApp();
    }

    const todoApp = new TodoApp();

    todoApp.projects =
      parsedApp.projects.map(restoreProject);

    const savedDefaultProject =
      todoApp.projects.find(
        (project) =>
          project.id === parsedApp.defaultProjectId
      );

    const inboxProject = todoApp.projects.find(
      (project) => project.name === "Inbox"
    );

    const defaultProject =
      savedDefaultProject ||
      inboxProject ||
      todoApp.projects[0];

    todoApp.defaultProjectId = defaultProject.id;

    const savedActiveProject =
      todoApp.projects.find(
        (project) =>
          project.id === parsedApp.activeProjectId
      );

    todoApp.activeProjectId = savedActiveProject
      ? savedActiveProject.id
      : todoApp.defaultProjectId;

    return todoApp;
  } catch (error) {
    console.error(
      "FocusBoard could not load its saved data:",
      error
    );

    localStorage.removeItem(STORAGE_KEY);

    return new TodoApp();
  }
}

function clearAppStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export {
  saveApp,
  loadApp,
  clearAppStorage,
};
import Project from "./Project.js";
import Todo from "./todo.js";

class TodoApp {
  constructor() {
    const inbox = new Project("Inbox");

    this.projects = [inbox];
    this.defaultProjectId = inbox.id;
    this.activeProjectId = inbox.id;
  }

  addProject(name) {
    // Crear y agregar proyecto
    const newProject = new Project(name);
    this.projects.push(newProject);
    return newProject;
  }

  getProjectById(projectId) {
    // Buscar con find()
    return this.projects.find(project => project.id === projectId);
  }

  setActiveProject(projectId) {
    // Cambiarlo únicamente si existe
    const project = this.getProjectById(projectId);
    if (project) {
      this.activeProjectId = projectId;
    }
  }

  getActiveProject() {
    // Devolver el proyecto activo
    return this.getProjectById(this.activeProjectId);
  }

  removeProject(projectId) {
    if (projectId === this.defaultProjectId) {
      return false;
    }

    const project = this.getProjectById(projectId);

    if (!project) {
      return false;
    }

    this.projects = this.projects.filter(
      (currentProject) => currentProject.id !== projectId
    );

    if (this.activeProjectId === projectId) {
      this.activeProjectId = this.defaultProjectId;
    }

    return true;
  }

  addTodo(
    title,
    description,
    dueDate,
    priority,
    notes,
    projectId = this.activeProjectId
  ) {
    const project = this.getProjectById(projectId);

    if (!project) {
      return null;
    }

    // Crear la nueva tarea
    const newTodo = new Todo(title, description, dueDate, priority, notes);

    // Agregarla usando project.addTodo()
    project.addTodo(newTodo);

    // Devolver la tarea
    return newTodo;
  }
 removeTodo(todoId, projectId = this.activeProjectId) {
  const project = this.getProjectById(projectId);

  if (!project) {
    return false;
  }

  const todo = project.getTodoById(todoId);

  if (!todo) {
    return false;
  }

  project.removeTodo(todoId);

  return true;
}
toggleTodoComplete(todoId, projectId = this.activeProjectId) {
  // Buscar proyecto
  const project = this.getProjectById(projectId);

  // Si no existe, devolver false
  if (!project) {
    return false;
  }

  // Buscar tarea
  const todo = project.getTodoById(todoId);

  // if doesnt exist return false
  if (!todo) {
    return false;
  }

  // Ejecutar toggleComplete()
  todo.toggleComplete();

  // Devolver true
  return true;
}
updateTodo(todoId, updates, projectId = this.activeProjectId) {
  const project = this.getProjectById(projectId);

  if (!project) {
    return false;
  }

  const todo = project.getTodoById(todoId);

  if (!todo) {
    return false;
  }

  todo.updateDetails(updates);

  return true;
}
}

export default TodoApp;
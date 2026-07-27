import Project from "./Project.js";
import Todo from "./Todo.js";

class TodoApp {
  constructor() {
    const inbox = new Project("Inbox");

    this.projects = [inbox];
    this.defaultProjectId = inbox.id;
    this.activeProjectId = inbox.id;
  }

  addProject(name) {
    const newProject = new Project(name);

    this.projects.push(newProject);

    return newProject;
  }

  getProjectById(projectId) {
    return this.projects.find(
      (project) => project.id === projectId
    );
  }

  setActiveProject(projectId) {
    const project = this.getProjectById(projectId);

    if (!project) {
      return false;
    }

    this.activeProjectId = projectId;

    return true;
  }

  getActiveProject() {
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
      (currentProject) =>
        currentProject.id !== projectId
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

    const newTodo = new Todo(
      title,
      description,
      dueDate,
      priority,
      notes
    );

    project.addTodo(newTodo);

    return newTodo;
  }

  removeTodo(
    todoId,
    projectId = this.activeProjectId
  ) {
    const project = this.getProjectById(projectId);

    if (!project) {
      return false;
    }

    return project.removeTodo(todoId);
  }

  toggleTodoComplete(
    todoId,
    projectId = this.activeProjectId
  ) {
    const project = this.getProjectById(projectId);

    if (!project) {
      return false;
    }

    const todo = project.getTodoById(todoId);

    if (!todo) {
      return false;
    }

    todo.toggleComplete();

    return true;
  }

  updateTodo(
    todoId,
    updates,
    projectId = this.activeProjectId
  ) {
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
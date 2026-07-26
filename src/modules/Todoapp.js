import Project from "./Project.js";

class TodoApp {
constructor() {
  const inbox = new Project("Inbox");

  this.projects = [inbox];
  this.defaultProject = inbox.id;
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
}

export default TodoApp;
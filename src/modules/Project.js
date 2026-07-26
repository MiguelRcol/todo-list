class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  getTodoById(todoId) {
    return this.todos.find((todo) => todo.id === todoId);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
  }
}

export default Project;
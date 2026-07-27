class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
  }

  addTodo(todo) {
    this.todos.push(todo);
    return todo;
  }

  getTodoById(todoId) {
    return this.todos.find((todo) => todo.id === todoId);
  }

  removeTodo(todoId) {
    const previousLength = this.todos.length;

    this.todos = this.todos.filter(
      (todo) => todo.id !== todoId
    );

    return this.todos.length < previousLength;
  }
}

export default Project;
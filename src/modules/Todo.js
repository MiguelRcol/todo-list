class Todo {
  constructor(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;

    this.id = crypto.randomUUID();
    this.completed = false;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  updateDetails(updates) {
    const editableFields = [
      "title",
      "description",
      "dueDate",
      "priority",
      "notes",
    ];

    editableFields.forEach((field) => {
      if (updates[field] !== undefined) {
        this[field] = updates[field];
      }
    });
  }
}

export default Todo;
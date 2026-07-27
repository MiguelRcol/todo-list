# FocusBoard

FocusBoard is a task and project management application built with vanilla JavaScript. It allows users to organize tasks into projects, assign due dates and priorities, track completed work, and preserve their information between browser sessions.

## Live Demo

[View FocusBoard](https://miguelrcol.github.io/todo-list/)

## Preview


<img width="2816" height="1580" alt="image" src="https://github.com/user-attachments/assets/3da4c58a-aa78-4d49-8cc6-73cdb726f068" />


## Features

- Create and delete custom projects.
- Create, edit, complete, and delete tasks.
- Organize tasks by project.
- Assign low, medium, or high priority.
- Add descriptions, due dates, and notes.
- View complete task details.
- Filter tasks by:
  - Today
  - Upcoming
  - Completed
- Store application data with `localStorage`.
- Restore projects and tasks after refreshing the page.
- Responsive interface for desktop and smaller screens.
- Accessible labels and native HTML dialogs.

## Technologies

- HTML5
- CSS3
- JavaScript
- ES6 modules
- Object-oriented programming
- Webpack
- npm
- Local Storage
- Git and GitHub
- GitHub Pages

## Project Structure

```text
todo-list/
├── src/
│   ├── modules/
│   │   ├── Todo.js
│   │   ├── Project.js
│   │   ├── TodoApp.js
│   │   ├── storage.js
│   │   └── dom.js
│   ├── index.js
│   ├── styles.css
│   └── template.html
├── package.json
├── webpack.config.js
└── README.md
```

## Architecture

The application separates its responsibilities into different modules.

### `Todo.js`

Represents an individual task and manages task-specific behavior, including:

- Updating task information.
- Toggling completion status.
- Storing title, description, date, priority, and notes.

### `Project.js`

Represents a project and manages its collection of tasks.

It is responsible for:

- Adding tasks.
- Finding tasks by ID.
- Removing tasks.

### `TodoApp.js`

Acts as the main application controller.

It manages:

- All projects.
- The default Inbox project.
- The currently active project.
- Task creation, editing, completion, and deletion.
- Project creation and deletion.

### `dom.js`

Handles the user interface and DOM events.

It is responsible for:

- Rendering projects and tasks.
- Opening and closing dialogs.
- Handling forms.
- Showing task details.
- Editing tasks.
- Managing filtered views.
- Connecting user actions with the application logic.

### `storage.js`

Handles persistence with the browser's Local Storage API.

Because JSON does not preserve class methods, this module reconstructs saved data as instances of `Todo`, `Project`, and `TodoApp` when the application loads.

## Installation

Clone the repository:

```bash
git clone git@github.com:MiguelRcol/todo-list.git
```

Enter the project directory:

```bash
cd todo-list
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Deployment

The project is deployed to GitHub Pages using the `gh-pages` package.

To deploy the latest version:

```bash
npm run deploy
```

## What I Learned

This project helped me practice:

- Separating application logic from DOM manipulation.
- Designing JavaScript classes with clear responsibilities.
- Using ES6 modules.
- Managing data through a central application class.
- Rendering dynamic content.
- Using event delegation.
- Building reusable form behavior.
- Creating filtered views without modifying the original data.
- Saving and restoring class-based application data.
- Configuring Webpack for development and production.
- Using Git branches and commits during development.

## Possible Improvements

- Allow tasks to move between projects during editing.
- Add project renaming.
- Add task search.
- Add sorting by date or priority.
- Add overdue task indicators.
- Replace confirmation dialogs with custom modals.
- Add automated tests.
- Add drag-and-drop task organization.
- Improve keyboard navigation.

## Author

**Miguel Ángel Rua Ruiz**

- GitHub: [MiguelRcol](https://github.com/MiguelRcol)

## Acknowledgements

This project was created as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.

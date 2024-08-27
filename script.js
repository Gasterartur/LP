const createForm = document.querySelector("#create-form");
const searchInput = document.querySelector(".search-field__input");
const headerDate = document.querySelector(".header__group-subheader");
const headerDay = document.querySelector(".main-header");

const getTodos = () => {
  return JSON.parse(localStorage.getItem("todosStorage")) || [];
};

const saveTodos = (todos) => {
  localStorage.setItem("todosStorage", JSON.stringify(todos));
};

const createTodo = (e) => {
  e.preventDefault();
  const startDate = document.querySelector("#startDate").value;
  const description = document.querySelector("#description").value;
  const newTodo = {
    id: "todo_" + Math.random().toString(16).slice(2),
    createAt: new Date(),
    startDate,
    description,
    done: false,
  };
  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);
  renderTodos();
};

const renderTodos = (filterType = 'all', searchQuery = '') => {
  const todos = getTodos();
  const filteredTodos = filterTodos(todos, filterType, searchQuery);
  const container = document.querySelector(".todo-list");
  container.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const startDate = new Date(todo.startDate).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    });
    const id = todo.id;
    container.insertAdjacentHTML(
      "beforeend",
      `
        <li class='todo-block'>
          <label class="checkbox" for="${id}" onclick="toggleTodoDone('${id}')">
            <input type="checkbox" name="${id}" id="${id}" ${todo.done ? "checked" : ""}/>
            <span class="material-symbols-rounded checkbox__check-icon">check</span>
          </label>
          <div class="todo-block__data">
            <p class="todo-block__date">${startDate}</p>
            <h3 class="todo-block__title">${todo.description}</h3>
          </div>
          <span class="material-symbols-rounded" onclick="deleteTodo('${id}')">close</span>
        </li>
      `
    );
  });
};

const filterTodos = (todos, filterType, searchQuery) => {
  let filtered = todos;
  if (filterType === 'active') {
    filtered = todos.filter(todo => !todo.done);
  } else if (filterType === 'done') {
    filtered = todos.filter(todo => todo.done);
  }
  if (searchQuery) {
    filtered = filtered.filter(todo => todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  return filtered;
};

const toggleTodoDone = (todoId) => {
  const todos = getTodos();
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  todos[todoIndex].done = !todos[todoIndex].done;
  saveTodos(todos);
  renderTodos();
};

const deleteTodo = (todoId) => {
  const todos = getTodos();
  const newTodos = todos.filter((todo) => todo.id !== todoId);
  saveTodos(newTodos);
  renderTodos();
};

const splitButtonClickHandler = (button) => {
  const filterType = button.id.replace('filter-', '');
  document.querySelectorAll('.split-button__button').forEach(btn => btn.classList.remove('split-button__button--active'));
  button.classList.add('split-button__button--active');
  renderTodos(filterType, searchInput.value);
};

const updateHeaderDate = () => {
  const now = new Date();
  const day = now.toLocaleString("ru-RU", { weekday: "long" });
  const date = now.toLocaleString("ru-RU", { day: "numeric", month: "long" });
  headerDay.textContent = day;
  headerDate.textContent = date;
};

searchInput.addEventListener("input", () => {
  renderTodos('all', searchInput.value);
});

createForm.addEventListener("submit", (e) => {
  createTodo(e);
});

updateHeaderDate();
renderTodos();
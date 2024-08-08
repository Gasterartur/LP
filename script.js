const createForm = document.querySelector("#create-form");
const getTodos = () => {
  return JSON.parse(localStorage.getItem("todosStorage"));
};
const createTodo = (e) => {
  e.preventDefault();
  const startDate = document.querySelector("#startDate").value;
  const description = document.querySelector("#description").value;
  const localStorageTodos = getTodos();
  const newTodo = {
    // создаем случайный id, чтобы иметь возможность без проблем найти необходимую запись
    id: "todo_" + Math.random().toString(16).slice(2),
    // Текущая дата
    createAt: new Date(),
    startDate,
    description,
    done: false,
  };
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    //если условие истинно, добавляем новыу запись в массив и записываем в localStorage
    localStorageTodos.push(newTodo);
    localStorage.setItem("todosStorage", JSON.stringify(localStorageTodos));
  } else {
    //если условие ложно, записываем массив с одним элементов в localStorage
    localStorage.setItem("todosStorage", JSON.stringify([newTodo]));
  }

  renderTodos();
};

const renderTodos = () => {
  const localStorageTodos = JSON.parse(localStorage.getItem("todosStorage"));
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    // Достаем контейнер
    const container = document.querySelector(".todo-list");
    // Обнуляем содержимое контейнера
    container.innerHTML = "";
    // Проходим по массиву элементов и по одному добавляем в контейнер
    localStorageTodos.forEach((todos) => {
      const startDate = new Date(todos.startDate).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
      });

      const id = todos.id;
      container.insertAdjacentHTML(
        "beforeend",
        `
                    <li class='todo-block'>
                        <label class="checkbox" for="${id}" onclick="toggleTodoDone('${id}')">
              <input type="checkbox" name="${id}" id="${id}" ${
          todos.done ? "checked" : ""
        }/>
              <span class="material-symbols-rounded checkbox__check-icon">
                check
              </span>
            </label>
            <div class="todo-block__data">
              <p class="todo-block__date">${startDate}</p>
              <h3 class="todo-block__title">${todos.description}</h3>
            </div>
<span class="material-symbols-rounded" onclick="deleteTodo('${id}')">
              close
            </span>

                    </li>
                `
      );
    });
  }
};

const toggleTodoDone = (todoId) => {
  const localStorageTodos = getTodos();
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    const todoIndex = localStorageTodos.findIndex((todo) => todo.id === todoId);
    localStorageTodos[todoIndex].done = !localStorageTodos[todoIndex].done;
    localStorage.setItem("todosStorage", JSON.stringify(localStorageTodos));
  }
  renderTodos();
};

const deleteTodo = (todoId) => {
  const localStorageTodos = getTodos();
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    const newTodos = localStorageTodos.filter((todo) => {
        return todo.id !== todoId
    });
    localStorage.setItem("todosStorage", JSON.stringify(newTodos));
  }
  renderTodos();
};

createForm.addEventListener("submit", (e) => {
  createTodo(e);
});
renderTodos();
// console.log(todosIds);

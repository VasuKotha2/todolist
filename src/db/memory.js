let todos = [];

async function listTodos() {
  return todos.slice();
}

async function createTodo(todo) {
  todos.push(todo);
  return todo;
}

function reset() {
  todos = [];
}

module.exports = { listTodos, createTodo, reset };

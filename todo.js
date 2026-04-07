const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const countText = document.getElementById('countText');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 保存到 localStorage
function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 渲染列表
function render() {
  const filtered = todos.filter(t => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'completed') return t.done;
    return true;
  });

  if (filtered.length === 0) {
    todoList.innerHTML = '<li class="empty-msg">暂无任务</li>';
  } else {
    todoList.innerHTML = filtered.map(t => `
      <li class="todo-item${t.done ? ' completed' : ''}" data-id="${t.id}">
        <input type="checkbox" ${t.done ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(t.text)}</span>
        <button class="delete-btn">✕</button>
      </li>
    `).join('');
  }

  const activeCount = todos.filter(t => !t.done).length;
  countText.textContent = `${activeCount} 项待完成`;
}

// 防止 XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 添加任务
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  todoInput.value = '';
  save();
  render();
});

// 切换完成 / 删除
todoList.addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.type === 'checkbox') {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
    save();
    render();
  }

  if (e.target.classList.contains('delete-btn')) {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }
});

// 筛选
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// 清除已完成
clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

// 初始渲染
render();

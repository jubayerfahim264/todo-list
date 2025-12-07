 const btn = document.getElementById('submitBtn');
        const input = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');

        function escapeHtml(str) {
            return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        }

        function createTodoElement(text, completed = false) {
            const li = document.createElement('li');
            li.className = 'list-group-item fade-in';
            li.innerHTML = `<input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''}/> <span class="text">${escapeHtml(text)}</span> <button type="button" class="btn btn-danger btn-sm float-end delete-btn">X</button>`;
            setTimeout(() => li.classList.remove('fade-in'), 480);
            return li;
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = input.value.trim();
            if (!value) {
                alert('Please add a todo');
                return;
            }
            const li = createTodoElement(value, false);
            todoList.appendChild(li);
            input.value = '';
            updateEmptyState();
            saveToLocalStorage();
        });

        // Delegated click handler for delete buttons
        todoList.addEventListener('click', (e) => {
            const target = e.target;
            if (!target) return;
            if (target.classList && target.classList.contains('delete-btn')) {
                const li = target.closest('li');
                if (!li) return;
                li.classList.add('fade-out');
                li.addEventListener('animationend', () => {
                    li.remove();
                    saveToLocalStorage();
                    updateEmptyState();
                }, { once: true });
            }
        });

        // Handle checkbox toggles via delegation
        todoList.addEventListener('change', (e) => {
            const target = e.target;
            if (target.matches('input[type="checkbox"]')) {
                const li = target.closest('li');
                const textEl = li.querySelector('.text');
                if (target.checked) {
                    textEl.style.textDecoration = 'line-through';
                    textEl.style.opacity = '0.6';
                    textEl.style.color = 'gray';
                } else {
                    textEl.style.textDecoration = 'none';
                    textEl.style.opacity = '1';
                    textEl.style.color = 'inherit';
                }
                saveToLocalStorage();
            }
        });

        const saveToLocalStorage = () => {
            const todos = [];
            todoList.querySelectorAll('li').forEach(li => {
                todos.push({
                    text: li.querySelector('.text').textContent,
                    completed: !!li.querySelector('input[type="checkbox"]').checked
                });
            });
            localStorage.setItem('todos', JSON.stringify(todos));
        };

        const loadFromLocalStorage = () => {
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            todos.forEach(todo => {
                const li = createTodoElement(todo.text, todo.completed);
                if (todo.completed) {
                    const textEl = li.querySelector('.text');
                    textEl.style.textDecoration = 'line-through';
                    textEl.style.opacity = '0.6';
                    textEl.style.color = 'gray';
                }
                todoList.appendChild(li);
            });
            updateEmptyState();
        };

        function updateEmptyState(){
            const empty = document.getElementById('empty-state');
            if(!empty) return;
            const hasItems = todoList.querySelectorAll('li').length > 0;
            empty.style.display = hasItems ? 'none' : 'flex';
        }

        window.addEventListener('DOMContentLoaded', loadFromLocalStorage);
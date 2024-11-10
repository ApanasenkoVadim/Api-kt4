document.addEventListener("DOMContentLoaded", function() {
    const loadUsersButton = document.getElementById('loadUsers');
    const loadPostsButton = document.getElementById('loadPosts');
    const dataList = document.getElementById('dataList');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const messagesList = document.getElementById('messagesList');
    const sseList = document.getElementById('sseList');

    async function loadData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            const data = await response.json();
            return data;
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    }

    loadUsersButton.addEventListener('click', async () => {
        const users = await loadData('https://jsonplaceholder.typicode.com/users');
        dataList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email}`;
            dataList.appendChild(li);
        });
    });

    loadPostsButton.addEventListener('click', async () => {
        const posts = await loadData('https://jsonplaceholder.typicode.com/posts');
        dataList.innerHTML = '';
        posts.forEach(post => {
            const li = document.createElement('li');
            li.textContent = `${post.title}: ${post.body}`;
            dataList.appendChild(li);
        });
    });

    const socket = io(); 

    socket.on('message', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        messagesList.appendChild(li);
    });

    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('message', message);
            messageInput.value = '';
        }
    });

    const eventSource = new EventSource('/events');

    eventSource.onmessage = (event) => {
        const li = document.createElement('li');
        li.textContent = event.data;
        sseList.appendChild(li);
    };

    eventSource.onerror = () => {
        alert('Ошибка соединения с сервером для SSE');
    };
});

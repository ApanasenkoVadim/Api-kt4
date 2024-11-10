const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // для работы с путями файлов

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Указываем путь к папке с вашими статичными файлами (например, папка "public")
app.use(express.static(path.join(__dirname, 'public')));

// Роут для корня сайта (главная страница)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // отправляем index.html
});

// Подключение WebSocket
io.on('connection', (socket) => {
    console.log('Новый клиент подключен');

    socket.on('message', (msg) => {
        console.log('Сообщение: ', msg);
        io.emit('message', msg);  // Отправить сообщение всем пользователям
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключился');
    });
});

// SSE для отправки обновлений в реальном времени
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Пример отправки данных каждые 5 секунд
    setInterval(() => {
        res.write(`data: Новое обновление от сервера в ${new Date().toLocaleTimeString()}\n\n`);
    }, 5000);
});

// Запуск сервера
server.listen(3000, () => {
    console.log('Сервер работает на порту 3000');
});

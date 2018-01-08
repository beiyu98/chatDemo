const Express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;

const app = new Express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(Express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');

io.serveClient('log level', 1);

io.on('connection', socket => {
    let client;

    socket.emit('open');
    console.log(socket.handshake);

    client = {
        socket: socket,
        name: false,
        color: getColor(),
    };

    socket.on('message', msg => {
        let obj = { time: getTime(), color: client.color };

        if (!client.name) {
            client.name = msg;
            obj['text'] = client.name;
            obj['author'] = 'System';
            obj['type'] = 'welcome';
            console.log(client.name + 'login');

            socket.emit('system', obj);
        } else {
            obj['text'] = msg;
            obj['author'] = client.name;
            obj['type'] = 'message';
            console.log(client.name + 'say: ' + msg);

            socket.emit('message', obj);
            socket.broadcast.emit('message', obj);
        }
    });

    socket.on('disconnect', () => {
        let obj = {
            time: getTime(),
            color: client.color,
            author: 'System',
            text: client.name,
            type: 'disconnect'
        };
        socket.broadcast.emit('system', obj);
        console.log(client.name + ' Disconnect');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

server.listen(port, function () {
    console.log('server listening at port %d', port);
});

let getTime = () => {
    let date = new Date();
    return date.getHours() + ":" + date.getMinutes() + date.getSeconds();
}

let getColor = () => {
    let colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'pink', 'red', 'green',
        'orange', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue'];
    return colors[Math.round(Math.random() * 10000 % colors.length)];
}

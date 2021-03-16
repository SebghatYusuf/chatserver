const users = {
    username: { username: "", password: "" }
};


const rooms = {
    roomName: "", description: "", maxPeople: 100, private: true | false, creator: "", users: [

    ]
};


const io = require('socket.io')(
    require('http').createServer(
        function () {

        }
    ).listen(80)
)


io.on('connection', io => {
    console.log('Connection established with a client!');
    // More stuff (coming soon to a chapter near you!)
});

io.on('validate', (inData, inCallback) => {
    const user = users[inData.username];
    if (user) {
        if (user.password === inData.password) {
            inCallback({ status: "ok" })
        } else {
            inCallback({ status: "fail" })
        }
    } else {
        users[inData.username] = inData;
        io.emit('newUser', users);
        inCallback({ status: 'created' });
    }
})


io.on('create', (inData, inCallback) => {
    if (rooms[inData.roomName]) {
        inCallback({ status: 'exists' })
    } else {
        inData.users = {};
        rooms[inData.username] = inData;
        io.emit('created', rooms);
        inCallback({ status: 'created', rooms: rooms });
    }
})

io.on('listRooms', (inData, inCallback) => {
    inCallback(rooms);
})

io.on('listUsers', (inData, inCallback) => {
    inCallback(users);
})

io.on('join', (inData, inCallback) => {
    const room = rooms[inData.roomName];
    if (Objects.keys(room.users).length >= room.maxPeople) {
        inCallback({ status: 'fail' })
    } else {
        room.users[inData.username] = users[inData.username];
        io.emit('joined', room);
        inCallback({ status: 'joined', room: room });
    }
})

io.on('post', (inData, inCallback) => {
    io.emit('posted', inData);
    inCallback({ status: "ok" });
})

io.on('invite', (inData, inCallback) => {
    io.emit('invited', inData);
    inCallback({ status: "ok" });
})

io.on('leave', (inData, inCallback) => {
    const room = rooms[inData.roomName];
    delete room.users[inData.username];
    io.emit('left', room);
    inCallback({ status: 'ok' });
})

io.on('close', (inData, inCallback) => {
    delete rooms[inData.roomName];
    io.emit('closed', { roomName: inData.roomName, rooms: rooms });
    inCallback(rooms);
})

io.on('kick', (inData, inCallback) => {
    const room = rooms[inData.roomName];
    const users = room.users;
    delete users[inData.username];
    io.emit('kicked', room);
    inCallback({ status: "ok" });
})




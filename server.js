const users = {
    username: { username: "", password: "" }
};


const rooms = {
    roomName: "", description: "", maxPeople: 100, private: true | false, creator: "", users: [

    ]
};


const io = require('socket.io')(
    require('http').createServer(
        function(){

        }
    ).listen(80)
)


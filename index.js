var express = require("express")
var socket = require("socket.io")

const PORT=4000

var app = express();
var server = app.listen(PORT,function(){
    console.log("Server is up on http://"+getOwnIp()+":"+PORT)
});

app.use(express.static("public"))
var io = socket(server)


class Player{
    constructor(socket){
        this.socket=socket
        this.isActive=true
    }
}
var playerLookup=[]
var clientId=0

//networking in
io.on("connection",function(socket){
    socket.id=clientId++
    playerLookup[socket.id]=new Player(socket)

    console.log("client connected on socket: ",socket.id +" Current active sockets: "+getTotalActiveSockets())

    //listen for data
    socket.on('disconnect', function(){
        console.info('user disconnected from socket: ' + socket.id+" Current active sockets: "+getTotalActiveSockets());
        playerLookup[socket.id].isActive=false
    });

    socket.on("buttonClicked",function(){
        console.log("button was clicked")
        socket.emit("serverUpdate",{
            message: "server recieved the message"
        })
    })
});


function getOwnIp(){
    var os = require('os');
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses
}
function getTotalActiveSockets(){
    var total=0
    for(var i=0;i<playerLookup.length;i++){
        if(playerLookup[i].isActive){
            total++
        }
    }
    return total
}
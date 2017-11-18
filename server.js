var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var http = require("http").Server(app);
var io = require('socket.io')(http)
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//get requests

var messages = [
	{"name":"Khan","message":"Hello!"}, 
]

app.get('/messages', (req,res) => {
	res.send(messages);
})

app.post('/messages', (req,res) => {
	// console.log(req.body);

	messages.push(req.body);
	io.emit('message',req.body);
	res.sendStatus(200);
})

io.on('connection',(socket) =>{
	console.log("A new connection.");
})


http.listen(8081,function () {
	console.log("running on 8081.")
})
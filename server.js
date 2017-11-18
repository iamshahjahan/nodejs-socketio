var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var config = require('./config');

var app = express();

var http = require("http").Server(app);
var io = require('socket.io')(http)
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var dbUrl = config.dbUrl;

//a model of mongodb

var Message = mongoose.model('Message',{
	name: String,
	message: String
});

//get requests

// var messages = [
// 	{"name":"Khan","message":"Hello!"}, 
// ]

app.get('/messages', (req,res) => {
	Message.find({},(err,messages)=>{
		res.send(messages);
	})
})

app.post('/messages', (req,res) => {
	// console.log(req.body);
	var message = new Message(req.body);

	message.save((err)=>{
		if(err)
			req.sendStatus(500);
		// messages.push(req.body);
		io.emit('message',req.body);
		res.sendStatus(200);
	})

})
mongoose.connect(dbUrl,{useMongoClient:true},(err)=>{
	console.log("connected to mongodb",err);
})

io.on('connection',(socket) =>{
	console.log("A new connection.");
})


http.listen(8081,function () {
	console.log("running on 8081.")
})
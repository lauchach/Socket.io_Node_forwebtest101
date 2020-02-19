const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
let users = [];
let messages = [];
// var time = new Date().getTime()
var moment = require('moment')
let timex = moment().format('h:mm a')
let dateday = moment().format('DD-MM-YYYY') 
const { crtime } = require('./utils/crtime')
// const items = this.users
// const copy = []


mongoose.connect("mongodb://localhost:27017/chatapp");

const ChatSchema = mongoose.Schema({
	username: String,
	msg: String,
	time: String
});

const ChatModel = mongoose.model("chat", ChatSchema);

ChatModel.find((err, result) => {
	if (err) throw err;

	messages = result;
});
function a () {
	console.log('this.users//a',this.users)
	var items = this.users
    const copy = []
	for (let i = 0; i < this.users.length; i++) {
		copy.push(this.users[i])
	  }
	  return{
		  users: users
	  }
}

io.on("connection", socket => {
	socket.emit('loggedIn', {
		users: a(),    //	
		messages: messages,
		time: timex,
		date: dateday
	});
// io.on("connection", socket => {
// 	socket.emit('loggedIn', {
// 		users: users.map(next => next.username),    //	
// 		messages: messages,
// 		time: timex,
// 		date: dateday
// 	});
	// console.log(createdAt)

	socket.on('newuser', username => {
		console.log(JSON.stringify(username))
		console.log(`${username} Join in the party.`);
		socket.username = username;                        //******//
		
		users.push(socket);                                //******//

		io.emit('userOnline', socket.username);
	});

	socket.on('msg', msg => {
		let message = new ChatModel({
			username: socket.username,
			msg: msg,
			time: timex
		});

		message.save((err, result) => {
			if (err) throw err;

			messages.push(result);

			io.emit('msg', result);
		});
	});
	
	// Disconnect
	socket.on("disconnect", () => {
		console.log(`${socket.username} Exit party.`);
		io.emit("userOut", socket.username);
		users.splice(users.indexOf(socket), 1);
	});
});

http.listen(process.env.PORT || 3000, () => {
	console.log("Listening on port %s", process.env.PORT || 3000);
});
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
var moment = require('moment')
var users = [];
let messages = [];
var user = [];
var timex = moment().format('LTS')
// var arrayuser = Array.from(users);

mongoose.connect("mongodb://localhost:27017/chatapp");

const ChatSchema = mongoose.Schema({
	username: String,
	msg: String,
	time: String,
	type: String
});

const ChatModel = mongoose.model("chat", ChatSchema);

ChatModel.find((err, result) => {
	if (err) throw err;

	messages = result;
});

function a () {
	console.log('ทำ function a ()this.users////',users,'users.length',users.length)
	var leng = users.length
	for (var i = 0; i < leng; i++) { 
		users.push(users[i])
	}
	// users.splice(users.length,users);
	const set = new Set(users);
	var arrayuser = Array.from(set);
			console.log('function a ()this.user//return arrayuser//',arrayuser)
 return arrayuser
}



io.on('connection', socket => {
	console.log('IO Connected')

	socket.on('newuser', username => {
		console.log(`${username} has arrived at the party.`);
		user = username;
		
		users.push(username);
		
		// x = a()
		// console.log('x',x)
		socket.emit('loggedIn', {
			users: a(),
			// users: users,
			// users: users.map(s => s.username),
			messages: messages
		})
		
		socket.broadcast.emit('userOnline', users.username);
		// let users = userx
		// console.log('userx',userx) 
	});
	

	socket.on('msg', msg => {
		let message = new ChatModel({
			username: socket.username,
            msg: msg,
			time: timex,
			type: ''
		});
		message.save((err, result) => {
			if (err) throw err;

			messages.push(result);

			socket.emit('msg', result);
		});
	});
	
	// Disconnect
	socket.on("disconnect", () => {
		console.log(`${socket.username} has left the party.`);
		socket.broadcast.emit("userLeft", socket.username);
		users.splice(users.indexOf(users), 1);
		console.log('this.usersdisconnect////',users)
    });
    socket.on("logOut", () => {
		console.log(`${socket.username} has left the party.`);
		socket.broadcast.emit("userLeft", socket.username);


		console.log('users.indexOf(users)',users.indexOf(users))
		console.log('users.splice(users.indexOf(users), 1)',users.splice(users.indexOf(users), 1))
		users.splice(users.indexOf(users), 1);

		
		console.log('this.userslogOut////',users)
	});
}); 	

http.listen(process.env.PORT || 3000, () => {
	console.log("Listening on port %s", process.env.PORT || 3000);
});
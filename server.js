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
	// console.log('ทำ function a ()this.users////',users,'users.length',users.length)
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
		users.push(username.username)
		io.emit('userOnline', {
			users: users,
		})
		// socket.broadcast.emit('userOnline', {
		// 	users: a(),
		// })
		// eslint-disable-next-line no-console
		console.log('push//users',users)

		
		// x = a()
		// console.log('x',x)
		socket.emit('loggedIn', {
			// users: a(),
			// users: users,
			// users: users.map(s => s.username),
			messages: messages
		})
		
		// socket.broadcast.emit('userOnline', {
		// 	users: a(),
		// })
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
		console.log(`${users} has left the party.`);
		io.emit("userLeft", a());
		users.splice(users.includes(users.username), []);
		// users.splice(users.includes(users), 1);

		console.log('this.usersdisconnect////',user)
    });
    socket.on("logOut", () => {
		console.log(`${socket.username} has left the party.`);
		socket.broadcast.emit("userLeft", socket.username);
		users.splice(users.indexOf(socket), 1);
		// users.splice(users.includes(users), 1);
		
		console.log('users.indexOf(users)',users.includes(users))
		console.log('users.splice(users.indexOf(users), 1)',users.splice(users.indexOf(users), 1))
		console.log('this.userslogOut////',users)
	});
}); 	

http.listen(process.env.PORT || 3000, () => {
	console.log("Listening on port %s", process.env.PORT || 3000);
});
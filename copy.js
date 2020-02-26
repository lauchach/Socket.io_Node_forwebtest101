const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
var moment = require('moment')
var users = ['A', 'B', 'C'];
let messages = [];
var user = [];
var timex = moment().format('LTS')
var test = []

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
	socket.on('userLeft', (username) => {
		// const set = new Set(username);
		// var arrayuser = Array.from(set);
		// io.emit('userOnline', {
		// 	users: arrayuser,
		// })
	})
	socket.on('newuser', username => {
		console.log(`${username} has arrived at the party.`,'>>>>>',users);
		// users.push(username.username)
		// const set = new Set(users);
		// var arrayuser = Array.from(set);
		// users = ['A', 'B', 'C']
		io.emit('userOnline', {
			// users: arrayuser,
			users: users
		})


		// if (users.length === 0) {
		// 	users.push(username.username)
		// 	console.log('push//users',users)
		// 	io.emit('userOnline', {
		// 	users: users
		// })
		// } else {
		// 	console.log('else')
		// 	for(let i = 0; i < Suser.length; i++) {
		// 		if (username.username === this.Suser[i].users) {
		// 			console.log('if')
		// 			io.emit('userOnline', {
		// 			users: users,
		// 			})	
		// 			} else {
		// 				users.push(username.username)
		// 				console.log('push//users',users)
		// 				io.emit('userOnline', {
		// 					users: [],
		// 			})		 
		// 		}	
		// 	}
		// }

		
		// socket.broadcast.emit('userOnline', {
		// 	users: a(),
		// })
		// eslint-disable-next-line no-console
		// console.log('push//users',users)

		
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
		socket.on('msg', msg => {
			let message = new ChatModel({
				username: username.username,
				msg: msg,
				time: timex,
				type: username.type
			});
			message.save((err, result) => {
				if (err) throw err;
	
				messages.push(result);
	
				io.emit('msg', result);
			})
		}),
		socket.on("logOut", () => {
			// console.log(`${username} has left the party.`);
			// console.log('logOut ', username)
			// users.splice(users.includes(users), 1);
			// console.log('users ', users)
			// io.emit("userLeft", socket.username);
			// console.log('this.userslogOut////',users,users.splice(users.indexOf(username.username), 1))
		});
	});
	



	
	// Disconnect
	socket.on("disconnect", () => {
		// console.log(`${users} has left the party.`);
		// users.splice(users.includes(users.username), []);
		// users.splice(users.includes(users), 1);
		for (let i = 0; i < users.length; i++) {
			if (users[i] !== 'B') {
				test.push(users[i])
			}
		}
		users = [...test]
		// console.log('this.usersdisconnect////',users)
    });
}); 	

http.listen(process.env.PORT || 3000, () => {
	console.log("Listening on port %s", process.env.PORT || 3000);
});
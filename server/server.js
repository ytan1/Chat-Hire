const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const models = require('./model')
const chat = models.getModel('chat')







//body parser and cookie parser for post
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')

//build app

//use the middleware to process data
app.use(cookieparser())
app.use(bodyparser.json())

app.use('/pics',express.static('./pics'))
app.use('/cv', express.static('./CV'))

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const userRouter = require('./user')
app.use('/user', userRouter)

//for chat function

let socketId = {}
io.on('connection', function(socket){
	console.log('one user connected')
	socket.on('sendMsg', function(data){

		const { from, text, to } = data
		data.time = Date.now()

		const chatId = [from, to].sort().join('_')
		chat.findOne({chatId},  function(err, doc){
			if(err){
				console.log(err)
			} else if (!doc){
				chat.create({chatId, msgList:[data]}, function(err, doc2){
					if(err) { console.log(err) }
					else { 
						io.to(socketId[to]).emit('findRecv', data) 
						socket.emit('findRecv', data) 
					}
				})
			} else {
				doc.msgList.push(data)
				chat.findOneAndUpdate({chatId}, {msgList: doc.msgList}, {new: true}, function(err,doc3){
					if (err) { console.log(err) }
					else { 
	
						io.to(socketId[to]).emit('findRecv', data)
						socket.emit('findRecv', data)
					}
				})
			}
		})
	})
	//get socket id for accurately sending msg
	socket.on('register', function(data){
		socketId[data] = socket.id
	})




})

//port
const PORT = 3030
http.listen(PORT, function(){
	console.log(`Listening at PORT ${PORT}`)
})
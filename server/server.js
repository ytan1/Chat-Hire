const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

const models = require('./model')
const chat = models.getModel('chat')
//for SSR
import staticPath from '../build/asset-manifest.json'
import { renderToString } from 'react-dom/server'
import csshook from 'css-modules-require-hook/preset' 
import assethook from 'asset-require-hook'
assethook({
  extensions: ['png'],
  name: '[hash].[ext]',
  publicPath: '/'
})

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { StaticRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from '../src/App.js'
//for loader icon
import '../src/config'
import { LoaderCon } from '../src/loader'
//import reducers for server side render
import {reducer} from '../src/redux/reducer'






//body parser and cookie parser for post
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')

//build app

//use the middleware to process data
app.use(cookieparser())
app.use(bodyparser.json())

//run nodemon server/server.js
app.use('/pics/',express.static(path.resolve('pics')))
app.use('/cv/', express.static(path.resolve('CV')))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const userRouter = require('./user')
app.use('/user', userRouter)

//for chat function

let socketId = {}
io.on('connection', function(socket){
	console.log('one user connected', socket.id)
	socket.on('sendMsg', function(data){
		console.log('send Msg')
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
						socket.emit('msgFromSelf', data) 
					}
				})
			} else {
				doc.msgList.push(data)
				chat.findOneAndUpdate({chatId}, {msgList: doc.msgList}, {new: true}, function(err,doc3){
					if (err) { console.log(err) }
					else { 
						if(socketId[to]){
							io.to(socketId[to]).emit('findRecv', data)
						}
						
						socket.emit('msgFromSelf', data)
					}
				})
			}
		})
	})
	//get socket id for accurately sending msg
	socket.on('register', function(data){
		socketId[data] = socket.id
		//additionally get msg list from db
		chat.find({$or:[{'msgList.from': data}, {'msgList.to': data}]}, function(err, doc){
			if(err) { console.log(err) }
			socket.emit('recvMsgList', doc)
		})
	})
	socket.on('updateUnread', function(info){
		const chatId = [info.from, info.to].sort().join('_')
		chat.findOne({chatId}, function(err, doc){
			if(err) {console.log(err)}
			else if (doc) {
				console.log(doc)
				doc.msgList.forEach(v => {
					if(v.from===info.from && v.to===info.to){
						v.unread = false
					}

				})
				console.log(doc)
				chat.findOneAndUpdate({chatId}, {msgList: doc.msgList}, function(err, doc2){
					if(err) {console.log(err)}
					
				})
			}
		})
	})



})

// app.get('/debug', function(req, res){
// 	chat.remove({'msgList.chatId':"5a7a68660c4a26924cdc2ba0_5a7a68660c4a26924cdc2ba0"}, function(err){
// 		if(err){ console.log(err)}
// 	})
// })



app.use(function(req, res, next){
	if(req.url.startsWith('/user/')||req.url.startsWith('/static/')||req.url.startsWith('/pics/')||req.url.startsWith('/cv/')||req.url.startsWith('/debug/')){
		return next()
	}else{
		const store = createStore(reducer, compose(
			applyMiddleware(thunk)
			)
		)
		let context = {}
		const markup = renderToString(
			<Provider store={store}>
				<div className="container">

					<StaticRouter
						location={req.url}
						context={context}
					>
						
						<App />
						

					</StaticRouter>
					<LoaderCon />
				</div>
				
			</Provider>
		)
		const htmlPage = `<!DOCTYPE html>
							<html lang="en">
							  <head>
							    <meta charset="utf-8">
							    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
							    <meta name="theme-color" content="#000000">

							    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
							    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
							    <link rel="stylesheet" href="/${staticPath['main.css']}">
							    <title>React App</title>
							  </head>
							  <body>
							    <noscript>
							      You need to enable JavaScript to run this app.
							    </noscript>
							    <div id="root" style="height:100%">${markup}</div>
							    <script src="/${staticPath['main.js']}"></script>
							  </body>
							</html>`
		console.log('server rinder done')
		res.send(htmlPage)
	}

})
app.use('/', express.static(path.resolve('build')))
//port
const PORT = 3030
http.listen(PORT, function(){
	console.log(`Listening at PORT ${PORT}`)
})
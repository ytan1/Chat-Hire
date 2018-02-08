const express = require('express')

const userRouter = require('./user')

//body parser and cookie parser for post
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')



//build app
const app = express()
//use the middleware to process data
app.use(cookieparser())
app.use(bodyparser.json())

app.use('/pics',express.static('./pics'))
app.use('/cv', express.static('./CV'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/user', userRouter)

//port
const PORT = 3030
app.listen(PORT, function(){
	console.log(`Listening at PORT ${PORT}`)
})
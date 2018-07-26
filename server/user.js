const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
//saltRounds no more than 15 (that's ~3sec/hash)
const saltRounds = 10
const Router = express.Router()

//for mongoose models
const models = require('./model')
const User = models.getModel('user')
const chat = models.getModel('chat')
// const chat = models.getModel('chat')
// Router.get('/debug', function(req, res){
// 	chat.remove({'chatId':"5a7a68cd0c4a26924cdc2ba2_5a7a68cd0c4a26924cdc2ba2"}, function(err,doc){
// 		if(err){ console.log(err)}
// 		else{res.json({code:2, data: doc})}
// 	})
// })

//for parse formdata of pic
const multer = require('multer')
//to see all the user info
Router.get('/userlist', function(req, res){
	const {type} = req.query
	User.find({type}, {'pwd':0}, function(err, doc){
		if(err){
			console.log(err)
		}else{
			 return res.json({code:0, data:doc})
		}
	})
})
//process the register info to db
Router.post('/register', function(req, res){
	console.log(req.body)
	let {user, pwd, type} = req.body.data
	User.findOne({user}, function(err, doc){
		if(err){
			return res.json({code: 1, msg:"Error1 from the database"})
		}
		else if(doc){
			console.log({user})
			return res.json({code: 1, msg:"The name already exists!"})
		}
		else{
			//hash the password !!!!!!!!
			bcrypt.hash(pwd, 10).then((hash) => { 
				pwd = hash;
				const userInstance = new User({user, pwd, type})
				console.log(userInstance)
				const {_id} = userInstance
				userInstance.save(function(errCreate){
					if(errCreate){
				 		return res.json({code: 1, msg:"Error2 from the database!"})
				 	}else{
				 		res.cookie('userid', _id)
				 		return res.json({code: 0, data: {user, type, _id}})
				 	}
				})

			}, (err) => {
				console.log(err)
			})
			
			
		}
	})


})

Router.post('/login', function(req, res){

	const {user, pwd} = req.body.data
	User.findOne({user}, function(err, doc){
		if (err){
			return res.json({code: 1, msg:"Error from database3!"})
		}else{
			if(doc){
				// console.log(doc)
				bcrypt.compare(pwd, doc.pwd)
					.then((resBcrypt) => {
						if(resBcrypt){
							//don't show pwd in res
							doc.pwd = ''
							//use cookie parser
							res.cookie('userid', doc._id)
							return res.json({code: 0, data: doc})
						} else{
							return res.json({code: 1, msg:"Password is wrong"})
						}
					},(err) => {
						console.log(err)
						return res.json({code: 1, msg:err})
					})
			}else {
			return res.json({code: 1, msg:"User not exists!"})
			}
			
		}
	})
})
//store the pic in local disk path by server.js
const storagePic = multer.diskStorage({
	destination: function (req, file, cb) {
                cb(null, './pics/')
         },
	filename: function(req, file, cb){
		//pic is stored in ./pic relative to server.js' path, name is ...png
		//console.log('file is ', file)
                //console.log('req.body ', req.body) 
		cb(null, req.body.filename)
	}
})
const uploadPic = multer({storage:storagePic})



//upload avartar for boss
Router.post('/bossinfo/pic', uploadPic.single('file'), function(req, res){

	const pic = req.file
	const name = req.body.filename
	const user = req.body.user


	if(pic){
		User.findOneAndUpdate({user}, {picName: name}, {new: false}, function(err, doc){
			if(err){
				console.log(err)
				return res.json({code: 1, msg: "Error4 from database"})
			}else if(!doc){
				return res.json({code: 1 })
			}else{
				return res.json({code: 0 })
			}
		})
	}
})
//upload other info
Router.post('/employeeinfo', function(req, res){
	const {user, education, more} = req.body

	User.findOneAndUpdate({user}, { education, more}, function(err, doc){
			if(err){
				console.log(err)
				return res.json({code: 1, msg: "Error4 from database"})
			}else if(!doc){
				return res.json({code: 1 })
			}else{
				return res.json({code: 0 })
			}
	}) 
})

//upload avartar for employee
Router.post('/employeeinfo/pic', uploadPic.single('file'), function(req, res){

	const pic = req.file
	const name = req.body.filename
	const user = req.body.user

	if(pic){
		User.findOneAndUpdate({user}, {picName: name}, {new: false}, function(err, doc){
			if(err){
				console.log(err)
				return res.json({code: 1, msg: "Error4 from database"})
			}else if(!doc){
				return res.json({code: 1 })
			}else{
				console.log('pic upload success')
				return res.json({code: 0 })
			}
		})
	}
})

const storageCV = multer.diskStorage({
	 destination: function (req, file, cb) {
                cb(null, './CV/')
         },
	filename: function(req, file, cb){ 
		
		cb(null, req.body.filename)
	}
})
const uploadCV = multer({storage:storageCV})

//upload CV for employee
Router.post('/employeeinfo/cv', uploadCV.single('file'), function(req, res){

	const cv = req.file
	const user = req.body.user
	

	if(cv){
		User.findOneAndUpdate({user}, {CVName: req.body.filename}, {new: false}, function(err, doc){
			if(err){
				console.log(err)
				return res.json({code: 1, msg: "Error4 from database"})
			}else if(!doc){
				console.log('no such doc')
				return res.json({code: 1 })
			}else{
				console.log('cv upload success')
				return res.json({code: 0 })
			}
		})
	}
})


//upload other info
Router.post('/bossinfo', function(req, res){
	const {user, company, title, more} = req.body
	User.findOneAndUpdate({user}, {title, company, more}, function(err, doc){
			if(err){
				console.log(err)
				return res.json({code: 1, msg: "Error4 from database"})
			}else if(!doc){
				return res.json({code: 1 })
			}else{
				return res.json({code: 0 })
			}
	})
})



//To check if cookie of previous info exists
//if so, res.json({code: 0, data: doc}) will update user's info 
//and not redirect to '/login' 
Router.get('/info', function(req, res){
	//cookie from req
	const {userid} = req.cookies
	if(userid){
		User.findById(userid, {'pwd':0, '__v':0}, function(err, doc){  //a filter not to show pwd and _v
			if(err){
				console.log(err)
				res.json({code:1})
			}
			else{
				if(doc){
					res.json({code: 0, data: doc}) ///res.data.data in front end
				}else{
					console.log('cookie not found')
					res.json({code:1})
				}
			}
		})
	}else{
		res.json({code: 1})
	}
})
//this is for sending data to the renderer server before it render the html to the browser
Router.post('/renderer', function(req, res){
	const {userid} = req.body.data
	if(!userid){
		//no cookie info, return code:1 to the renderer
		res.json({code: 0})
	}else{
		User.findById(userid, {'pwd':0, '__v':0}, function(err, doc){
			if(err){
				console.log(err)
				res.json({code:1})
			}
			else{
				if(doc){
					//if the user exist, get chat info and userlist
					let data = {}

					data.userInfo = doc

					// recursive data query!!
					//first get the usr list
					const queryType = (doc.type === 'Boss') ? 'Employee' : 'Boss'
					User.find({type: queryType}, {'pwd':0}, function(err, usrListDoc){
						if(err){
							console.log(err)
							data.usrListInfo = null
						}
						data.usrListInfo = usrListDoc 
						//if get usr list success, then get the chat info
						chat.find({$or:[{'msgList.from': userid}, {'msgList.to': userid}]}, function(err, chatDoc){
							 if(err) { 
							 	console.log(err) 
							 	data.chatInfo = null
							 }
							 data.chatInfo = chatDoc
							 res.json({code:0, data: data})
						})
						
					})

					
				}else{
					res.json({code:1})
				}
			}
		})
	}
	
})
module.exports = Router

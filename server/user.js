const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
//saltRounds no more than 15 (that's ~3sec/hash)
const saltRounds = 10
const Router = express.Router()

//for mongoose models
const models = require('./model')
const User = models.getModel('user')
// const chat = models.getModel('chat')
// Router.get('/debug', function(req, res){
// 	chat.remove({'chatId':"5a7a68660c4a26924cdc2ba0_5a7a68660c4a26924cdc2ba0"}, function(err,doc){
// 		if(err){ console.log(err)}
// 		else{res.json({code:2, data: doc})}
// 	})
// })

//for parse formdata of pic
const multer = require('multer')
//to see all the user info
Router.get('/userlist', function(req, res){
	const {type} = req.query
	User.find({type}, function(err, doc){
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
	console.log(req.body)
	const {user, pwd} = req.body.data
	User.findOne({user}, function(err, doc){
		if (err){
			return res.json({code: 1, msg:"Error from database3!"})
		}else{
			if(doc){
				console.log(doc)
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
					})
			}else {
			return res.json({code: 1, msg:"User not exists!"})
			}
			
		}
	})
})
//store the pic in local disk path by server.js
const storagePic = multer.diskStorage({
	destination: './pics/',
	filename: function(req, file, cb){
		//pic is stored in ./pic relative to server.js' path, name is ...png
		cb(null, req.body.filename)
	}
})
const uploadPic = multer({storage:storagePic})



//upload avartar for boss
Router.post('/bossinfo/pic', uploadPic.single('file'), function(req, res){

	const pic = req.file
	const name = req.body.filename
	const user = req.body.user
	// console.log(req)

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
	// console.log(req)

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

const storageCV = multer.diskStorage({
	destination: './CV/',
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

module.exports = Router
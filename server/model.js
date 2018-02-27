const mongoose = require('mongoose')
const DB_url = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB_url)

const models = {
	user:{
		user:{type: String, require: true},
		pwd: {type: String, require: true},
		type: {type: String, require: true},

		CVName: {type: String},
		picName: {type: String},
		//some other info about user
		//for employee
		requirement: {type: String},
		title:{type: String},
		//for boss
		company:{type: String},
		more:{type: String},
		education:{type:String}
	},
	chat:{
		chatId:{type: String, require: true},
		msgList:[{
					time: {type: Number, default: Date.now()}, 
				  	from: {type: String, require: true}, 
				  	to: {type: String, require: true}, 
				 	text:{type:String, require: true},
				 	unread: {type: Boolean, default: true}
				 }]
	}
}

let schema = {}
for(let m in models){
	schema[m] = new mongoose.Schema(models[m])
}

module.exports = {
	getModel: function(name){
		return mongoose.model(name, schema[name])
	}
}
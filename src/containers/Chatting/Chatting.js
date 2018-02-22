import React from 'react';
// import {WithRouter} from 'react-router-dom'
import { Input, Button, Icon } from 'semantic-ui-react'
import {connect} from 'react-redux'

import {sendMsg, socketRegister, updateUnread} from '../../redux/chat.redux'
import {updatePersonList} from '../../redux/userlist.redux'
import EmojiGrid from '../../components/EmojiGrid/EmojiGrid'

@connect(
	state => state,
	{sendMsg, socketRegister, updateUnread, updatePersonList}
	)
export default class Chatting extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
    	text: '',
    	msg:[],
    	toggleEmoji:false
    }
    this.sendEmoji = this.sendEmoji.bind(this)
  }

  // componentDidMount(){
  	// const chatId = [this.props.match.params.userid, this.props.auth._id].sort().join('_')
  	// this.props.recvMsgList(chatId)
  // }

  // componentDidMount(){
  // 	console.log(this.props.match.params.userid, this.props.auth._id)
  //   this.props.updateUnread({from: this.props.match.params.userid, to: this.props.auth._id})
  // }

  handleInput(e){
  	this.setState({
  		text: e.target.value
  	})
  }

  toggleEmoji(){
  	this.setState({
  		toggleEmoji: !this.state.toggleEmoji
  	})
  }

  sendMsg(){
  	this.setState({
  		text: ''
  	})
  	this.props.sendMsg({text: this.state.text, from: this.props.auth._id, to: this.props.match.params.userid})
  	
  }

  back(){
  	this.props.history.push(`/${this.props.auth.type.toLowerCase()}`)
  }


  sendEmoji(emoji){
  	this.setState({
  		text: this.state.text + emoji
  	})
  }

  render() {

  	if(!this.props.auth._id){   //careful check user's info is not delivered by the network
  		return null
  	}
  	if(!this.props.userlist.length){
  		this.props.updatePersonList(this.props.auth.type)    
  		return null
  	}
  	let title = this.props.userlist.find(v => v._id===this.props.match.params.userid).user

  

  	console.log(this.props)
  	const chatId = [this.props.match.params.userid, this.props.auth._id].sort().join('_')
  	let chatContent = null
  	// // console.log(chatId)
  	// // let msgList = this.props.chat.find(v => v.chatId === chatId)
  	// // console.log(this.props.chat.find(v => v.chatId === chatId))
  	// // if(msgList){
  	// // 	console.log(msgList)
  	// // 	chatContent = msgList.msg.map((v, index) => (<p key={index}>{v.text}</p>))

  	// // }
  	// // console.log(chatContent)
  	if(this.props.chat.msgList.length){
  		let msgList = this.props.chat.msgList.filter((v) => v.chatId===chatId )
  		chatContent = msgList.map((v, index) => {
	  			let className = '', className2 = '', src = '', urAva = ''
	  			if (v.from === this.props.auth._id){
	  				className = 'my-msg'
	  				className2 = 'my-ava'
	  				src = `/pics/${this.props.auth.picName}`
	  			} else {
	  				className = 'ur-msg'
	  				className2 = 'ur-ava'
	  				urAva = this.props.userlist.find(v => v._id===this.props.match.params.userid).picName
	  				src = `/pics/${urAva}`
	  			}
	  			return  (
	  					<div key={index} className='msg-container clearfix'>
	  						<img className={className2} src={src} />
	  						<div className={className}>
	  							{v.text}
	  						</div>
	  					</div>
	  				)
  			})
  	}

  	this.props.updateUnread({from: this.props.match.params.userid, to: this.props.auth._id})

  	const emoji = '🙂 😁 😂 🤣 😠 ❤️ 🖤 😒 🤨 😍 🙇 🙈 🙉 🙊 💥 🐶 🐱 🦄 🌿 🍇 🍈 🍉 🍌 🍍 🍓 🍆 🍄 🍕 🤷 👾 🚣 🏎️ 🗾 🏞️ 🏠 🏥 🏦 🗽 🎠 🌋 🌋 🚀 🎆 🗿 🇨🇦 🇨🇳 🇨🇿 🇨🇺 🇮🇹 🇷🇺'
  					.split(' ')
  					.filter(v=>v)
  					.map(v => ({text:v}))
  	const contentBottom = this.state.toggleEmoji ? {bottom: 200} : null

    return (
      <div className="container">
      	<div className="header1">
      		<span style={{float:'left', fontSize:16}} onClick={() => this.back()}>Back</span>
      		<span>{title}</span>
      	</div>
      	<div className="chat-content" style={contentBottom}>
      		{chatContent}
      	</div>
      	<div className='chat-input-wrap'>
      		<Input action fluid onChange={(e) => this.handleInput(e)} value={this.state.text}>
	      		<input/>
	      		<Button basic icon='pointing down' onClick={() => this.toggleEmoji()}/>
	      		<Button content='Send' primary onClick={() => this.sendMsg()}/>
      		</Input>

      		{this.state.toggleEmoji ? <EmojiGrid data={emoji} columnNum={8} sendEmoji={this.sendEmoji}/> : null}
			
      	</div>
      </div>
    );
  }
}
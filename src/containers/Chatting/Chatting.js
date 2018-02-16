import React from 'react';
// import {WithRouter} from 'react-router-dom'
import { Input, Button } from 'semantic-ui-react'
import {connect} from 'react-redux'

import {sendMsg, socketRegister} from '../../redux/chat.redux'


@connect(
	state => state,
	{sendMsg, socketRegister}
	)
export default class Chatting extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
    	text: '',
    	msg:[]
    }
  }

  componentDidMount(){
  	// const chatId = [this.props.match.params.userid, this.props.auth._id].sort().join('_')
  	// this.props.recvMsgList(chatId)
  }

  handleInput(e){
  	this.setState({
  		text: e.target.value
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

  render() {

  	let title = this.props.userlist.find(v => v._id===this.props.match.params.userid).user



  	console.log(this.props.chat)
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





    return (
      <div className="container">
      	<div className="header1">
      		<span style={{float:'left', fontSize:16}} onClick={() => this.back()}>Back</span>
      		<span>{title}</span>
      	</div>
      	<div className="chat-content">
      		{chatContent}
      	</div>
      	<div className='chat-input-wrap'>
      		<Input action={<Button content='Send' primary onClick={() => this.sendMsg()}/>} fluid onChange={(e) => this.handleInput(e)} value={this.state.text}/>
      	</div>
      </div>
    );
  }
}
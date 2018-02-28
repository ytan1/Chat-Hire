import React from 'react';
// import {WithRouter} from 'react-router-dom'
import { Input, Button } from 'semantic-ui-react'
import {connect} from 'react-redux'

import {sendMsg, socketRegister, updateUnread} from '../../redux/chat.redux'
import {updatePersonList} from '../../redux/userlist.redux'
import EmojiGrid from '../../components/EmojiGrid/EmojiGrid'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

//use reselect to memoize calculations via state  
import isEqual from 'lodash/isEqual'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { store } from '../../store'
const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
)
const makeMoemoizeFunc = () => {
	return createDeepEqualSelector(
		(state, props) => ({
				auth:state.auth,
				userlist: state.userlist,
				msgList: state.chat.msgList,
				urId: props.match.params.userid
			}),
		obj => {
			const {auth, userlist, msgList, urId} = obj
					let renderNull = false, title = '',chatContent = null
					if(!auth._id){
						renderNull = true
						return {title, chatContent, renderNull, auth}
					}
					if(!userlist.length){
						store.dispatch(updatePersonList(auth.type))    
						renderNull = true
						return {title, chatContent, renderNull, auth}
					}else{
						title = userlist.find(v => v._id===urId).user
					}
				  	

				  	const chatId = [urId, auth._id].sort().join('_')
				  	// let chatContent = null

				  	if(msgList.length){
				  		let newMsgList = msgList.filter((v) => v.chatId===chatId )
				  		chatContent = newMsgList.map((v, index) => {
					  			let className = '', className2 = '', src = '', urAva = ''
					  			if (v.from === auth._id){
					  				className = 'my-msg'
					  				className2 = 'my-ava'
					  				src = `/pics/${auth.picName}`
					  			} else {
					  				className = 'ur-msg'
					  				className2 = 'ur-ava'
					  				urAva = userlist.find(v => v._id===urId).picName
					  				src = `/pics/${urAva}`
					  			}
					  			return  (
					  				<CSSTransition classNames="fade" timeout={300} key={index}>
					  					<div className='msg-container clearfix'>
					  						<img className={className2} src={src} alt='Avatar'/>
					  						<div className={className}>
					  							{v.text}
					  						</div>
					  					</div>
					  				</CSSTransition>
					  				)
				  			})
				  	}
			return {title, chatContent, renderNull, auth}
		}
	)
}
const makeMapStateToProps = () => {
	const memoizeFunc = makeMoemoizeFunc()
	const mapStateToProps = (state, props) => {
		return memoizeFunc(state, props)
	} 
	return mapStateToProps
}

@connect(
	// state => state,
	makeMapStateToProps,
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
  	if(!this.state.text){
  		return 
  	}
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

  componentDidMount(){
  	if(!this.props.renderNull){
  		this.chatContent.scrollTop = this.chatContent.scrollHeight
  	}
  }
  componentDidUpdate(){
  	if(!this.props.renderNull){
  		this.chatContent.scrollTop = this.chatContent.scrollHeight
  	}
  }

  componentWillUnmount(){
  	this.props.updateUnread({from: this.props.match.params.userid, to: this.props.auth._id})
  }
  render() {
  	if(this.props.renderNull){
  		return null
  	}

  	// if(!this.props.auth._id){   //careful check user's info is not delivered by the network
  	// 	return null
  	// }
  	// if(!this.props.length){
  	// 	this.props.updatePersonList(this.props.auth.type)    
  	// 	return null
  	// }

  	// let title = this.props.userlist.find(v => v._id===this.props.match.params.userid).user

  
  	// const chatId = [this.props.match.params.userid, this.props.auth._id].sort().join('_')
  	// let chatContent = null
  	// // console.log(chatId)
  	// // let msgList = this.props.chat.find(v => v.chatId === chatId)
  	// // console.log(this.props.chat.find(v => v.chatId === chatId))
  	// // if(msgList){
  	// // 	console.log(msgList)
  	// // 	chatContent = msgList.msg.map((v, index) => (<p key={index}>{v.text}</p>))

  	// // }
  	// // console.log(chatContent)
  	// if(this.props.chat.msgList.length){
  	// 	let msgList = this.props.chat.msgList.filter((v) => v.chatId===chatId )
  	// 	chatContent = msgList.map((v, index) => {
	  // 			let className = '', className2 = '', src = '', urAva = ''
	  // 			if (v.from === this.props.auth._id){
	  // 				className = 'my-msg'
	  // 				className2 = 'my-ava'
	  // 				src = `/pics/${this.props.auth.picName}`
	  // 			} else {
	  // 				className = 'ur-msg'
	  // 				className2 = 'ur-ava'
	  // 				urAva = this.props.userlist.find(v => v._id===this.props.match.params.userid).picName
	  // 				src = `/pics/${urAva}`
	  // 			}
	  // 			return  (
	  // 					<div key={index} className='msg-container clearfix'>
	  // 						<img className={className2} src={src} />
	  // 						<div className={className}>
	  // 							{v.text}
	  // 						</div>
	  // 					</div>
	  // 				)
  	// 		})
  	// }

  	//can also put in componentWillUnmount
  	// this.props.updateUnread({from: this.props.match.params.userid, to: this.props.auth._id})

  	const emoji = '🙂 😁 😂 🤣 😠 ❤️ 🖤 😒 🤨 😍 🙇 🙈 🙉 🙊 💥 🐶 🐱 🦄 🌿 🍇 🍈 🍉 🍌 🍍 🍓 🍆 🍄 🍕 🤷 👾 🚣 🏎️ 🗾 🏞️ 🏠 🏥 🏦 🗽 🎠 🌋 🌋 🚀 🎆 🗿 🇨🇦 🇨🇳 🇨🇿 🇨🇺 🇮🇹 🇷🇺'
  					.split(' ')
  					.filter(v=>v)
  					.map(v => ({text:v}))
  	const contentBottom = this.state.toggleEmoji ? {bottom: 200} : null

    return (
      <div className="container">
      	<div className="header1">
      		<span style={{float:'left', fontSize:16}} onClick={() => this.back()}>Back</span>
      		<span>{this.props.title}</span>
      	</div>

      	<div className="chat-content" style={contentBottom} ref={(el) => {this.chatContent = el}}>
      		<TransitionGroup>
      			{this.props.chatContent}
      		</TransitionGroup>
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

import io from 'socket.io-client'
//should change if run on local;
// connect directly to the API server 
//should use proxy or not (http-proxy-middleware)
//???????
export const socket = io('ws://35.183.99.224:3030')


const RECV_MSG = 'recv-msg'
const RECV_LIST = 'recv-list'
const UPDATE_UNREAD_REDUX = 'update-unread-redux'
const RECV_MSG_FROM_SELF = 'recv-msg-from-self'


// const initState = []

// export const chat = (state=initState, action) => {
// 	switch (action.type) {
// 		case RECV_MSG:
// 			const {from, to, text, time} = action.payload
// 			let chatId = [from, to].sort().join('_')
// 			let newState = state 
// 			let msgGroup = newState.find(v => v.chatId === chatId)
// 			if (!msgGroup) {
// 				 msgGroup = {}
// 		         msgGroup.chatId = chatId
// 		         msgGroup.msg = [action.payload]
// 		         newState.push(msgGroup)
// 			} 	else {
// 				newState.find(v => v.chatId === chatId).msg.push(action.payload)

// 			}
// 			return newState
// 		default:
// 			return state

// 	}
// }


const initState = {
	unread:0,
	msgList: []
}

export const chat = (state=initState, action) => {
	switch (action.type) {
		case RECV_MSG:
			const {from, to } = action.payload
			const chatId = [from, to].sort().join('_')

			return {...state, unread: state.unread + 1, msgList: [...state.msgList, {...action.payload, chatId, unread: true}]}
		case RECV_MSG_FROM_SELF:
			const from2 = action.payload.from, to2 = action.payload.to
			const chatId2 = [from2, to2].sort().join('_')

			return {...state,  msgList: [...state.msgList, {...action.payload, chatId: chatId2, unread: true}]}
			
		case RECV_LIST:
			//convert the msgList from db to the msgList structure in the redux state
			//structure of db {chatId: ...., msgList:[...]} for one doc
			//structure of redux state.chat {[chatId:..., from:..., to:..., text:...]} for one doc
			let list = []
			action.payload.forEach(v => {
				let subList = v.msgList.map(v2 => {
					return { chatId: v.chatId, ...v2 }
				})
				list = [...list, ...subList]
			})
			//count total unread msgs
			let unread = list.filter(v => v.unread && v.from!==action.myId).length
			return {...state, unread, msgList: list}
		case UPDATE_UNREAD_REDUX:
			let newState = state
			let count = 0
			newState.msgList.forEach(v => {
				if(v.unread && v.from === action.payload.from && v.to === action.payload.to){
					v.unread = false;
					count++;
				}
			})
			//get total unread msgs by reducing 'count'
			newState.unread = newState.unread - count
			console.log(newState)
			return newState
		default:
			return state

	}
}


export const sendMsg = (data) => {
	return dispatch => {
		socket.emit('sendMsg', data)
	}
}

export const socketRegister = (data) => {
	return dispatch => {
		if(!socket.hasListeners('findRecv')){
			socket.emit('register', data)
			socket.on('findRecv', (text) => {     
				dispatch(recvMsg(text))
			})
			socket.on('msgFromSelf', (text) => {
				dispatch(recvMsgFromSelf(text))
			})
			socket.on('recvMsgList', (doc) => {
				dispatch(recvList(doc, data))    //msgList from db and myId in callback
			})
			console.log('socket register in redux success')
		}
		

	}
}

export const logoutSocket = () => {
	return dispatch => {
		socket.off('findRecv')
		socket.off('msgFromSelf')
		socket.off('recvMsgList')
	}
	
}


const recvMsg = (data) => {
	return {
		type: RECV_MSG,
		payload: data   //{from, to ,text, time}
	}
}

const recvMsgFromSelf = (data) => {
	return {
		type: RECV_MSG_FROM_SELF,
		payload: data   //{from, to ,text, time}
	}
}

export const recvList = (data, myId) => {
	return {
		type: RECV_LIST,
		payload: data,
		myId: myId
	}
}

export const updateUnread = (info) => {
	return dispatch => {
		socket.emit('updateUnread', info) 
		dispatch(updateUnreadRedux(info))

	}
}
const updateUnreadRedux = (info) => {
	return {
		type: UPDATE_UNREAD_REDUX,
		payload: info
	}
}
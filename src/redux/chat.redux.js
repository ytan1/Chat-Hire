
import io from 'socket.io-client'
export const socket = io('ws://localhost:3030')

const SEND_MSG = "send-msg"
const RECV_MSG = 'recv-msg'




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
			const {from, to, text, time} = action.payload
			let chatId = [from, to].sort().join('_')
			return {...state, msgList: [...state.msgList, {...action.payload, chatId}]}
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
		socket.emit('register', data)
		socket.on('findRecv', (text) => {
			dispatch(recvMsg(text))
		})

	}
}

const recvMsg = (data) => {
	return {
		type: RECV_MSG,
		payload: data   //{from, to ,text, time}
	}
}


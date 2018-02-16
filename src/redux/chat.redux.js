
import io from 'socket.io-client'
export const socket = io('ws://localhost:3030')

const SEND_MSG = "send-msg"
const RECV_MSG = 'recv-msg'
const RECV_LIST = 'recv-list'
const UPDATE_UNREAD_REDUX = 'update-unread-redux'



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
			let chatId = [from, to].sort().join('_')

			return {...state, unread: state.unread + 1, msgList: [...state.msgList, {...action.payload, chatId}]}
		case RECV_LIST:
			//convert the msgList from db to the msgList structure in the redux state
			let list = []
			action.payload.forEach(v => {
				let subList = v.msgList.map(v2 => {
					return { chatId: v.chatId, ...v2 }
				})
				list = [...list, ...subList]
			})
			//count total unread msgs
			let unread = list.filter(v => v.unread).length
			return {...state, unread, msgList: list}
		case UPDATE_UNREAD_REDUX:
			let newState = state
			let count = 0
			newState.msgList.forEach(v => {
				if(v.unread && v.from === action.payload.from && v.to === action.payload.to){
					v.unread = false
					count++
				}
			})
			//get total unread msgs by reducing 'count'
			newState.unread = newState.unread - count
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
		socket.emit('register', data)
		socket.on('findRecv', (text) => {
			dispatch(recvMsg(text))
		})
		socket.on('recvMsgList', (doc) => {
			dispatch(recvList(doc))
		})

	}
}

const recvMsg = (data) => {
	return {
		type: RECV_MSG,
		payload: data   //{from, to ,text, time}
	}
}

const recvList = (data) => {
	return {
		type: RECV_LIST,
		payload: data
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
import { combineReducers } from 'redux'
import { auth } from './register.redux'
import { loaderActive } from './loader.redux'
import {userlist} from './userlist.redux'
import { chat } from './chat.redux'

export const reducer = combineReducers({ auth, loaderActive, userlist, chat })
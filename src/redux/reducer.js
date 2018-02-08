import { combineReducers } from 'redux'
import { auth } from './register.redux'
import { loaderActive } from './loader.redux'
import {userlist} from './userlist.redux'

export const reducer = combineReducers({ auth, loaderActive, userlist })
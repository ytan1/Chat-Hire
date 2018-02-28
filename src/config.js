import axios from 'axios'
//use store to dispach the action to change loaderActive , because there is no component
import {store} from './store'
import { toggle } from './redux/loader.redux'
axios.interceptors.request.use(function(config){
	store.dispatch(toggle(true))
	// console.log(store.getState())
	return config
})

axios.interceptors.response.use(function(res){
	// setTimeout(() => {
		store.dispatch(toggle(false));
		// console.log(store.getState());
	// }, 2000)
	
	return res
})
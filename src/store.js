import { createStore, applyMiddleware,compose } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
//import reducers
import {reducer} from './redux/reducer'

//configure the axiosInstance
const axiosInstance = axios.create({
     baseURL: '/api'
})
/* START HACK */
if (!process.env.BROWSER) {
  global.window = {}; // Temporarily define window for server-side
}
/* END HACK */
export const store = createStore(reducer, 
    window.INITIAL_STATE, 
    compose(
    	applyMiddleware(thunk.withExtraArgument(axiosInstance)),
    	window.devToolsExtension ? window.devToolsExtension() : f => f    //store appears in MessageCenter.js causing crach in server when SSR
	)
)


import { createStore, applyMiddleware,compose } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
//import reducers
import {reducer} from '../../src/redux/reducer'


export default (req) => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3030/',   //url of api server
        headers: {
            cookies: req.cookies || ''
        }
    })
    const store = createStore(reducer, {}, compose(
        applyMiddleware(thunk.withExtraArgument(axiosInstance))
        )
    )
    return store
}

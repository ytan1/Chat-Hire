import { createStore, applyMiddleware,compose } from 'redux'
import React from 'react'
import ReactDom from 'react-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './main.css'
//for loader

import './config'
import { LoaderCon } from './loader'
import 'semantic-ui-css/semantic.min.css'
//for login component
import Login from './components/login'
import Register from './components/register'
import AuthRoute from './components/authroute/AuthRoute'
import Bossinfo from './containers/Bossinfo/Bossinfo'
import Employeeinfo from './containers/Employeeinfo/Employeeinfo'
import Dashboard from './containers/Dashboard/Dashboard'
import Chatting from './containers/Chatting/Chatting'





//import reducers
import {reducer} from './redux/reducer'
//create store and use devTool for redux
export const store = createStore(reducer, compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : () => {}
	)
)

// const init = store.getState()
// console.log(init)


function render(){
	ReactDom.render(
		(<Provider store={store}>
			<div className="container">

				<BrowserRouter>
					<div className="container">
					<AuthRoute />
					<Switch>
						
						<Route path="/login" component={Login}></Route>
						<Route path="/register" component={Register}></Route>
						<Route path="/bossinfo" component={Bossinfo}></Route>
						<Route path="/employeeinfo" component={Employeeinfo}></Route>
						<Route path="/chatting/:userid" component={Chatting}></Route>
						<Route component={Dashboard}></Route>
						
					</Switch>
					</div>
				</BrowserRouter>
				<LoaderCon />
			</div>
		
					
		</Provider>),
		document.getElementById('root'))
}
render()


// store.subscribe(listen)


// function listen(){
// 	console.log(store.getState())
// }

// store.subscribe(render)


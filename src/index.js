
import React from 'react'
import ReactDom from 'react-dom'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './main.css'
import './reactTransitionGroup.css'

//for loader

import './config'
import { LoaderCon } from './loader'
import 'semantic-ui-css/semantic.min.css'

import { store } from './store'
import App from './App'



function render(){
	ReactDom.hydrate(
		(<Provider store={store}>
			<div className="container">

				<BrowserRouter>

					<App />

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


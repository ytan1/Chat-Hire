import React from 'react'
import { Route, Switch } from 'react-router-dom'




import Login from './components/login'
import Register from './components/register'
import AuthRoute from './components/authroute/AuthRoute'
import Bossinfo from './containers/Bossinfo/Bossinfo'
import Employeeinfo from './containers/Employeeinfo/Employeeinfo'
import Dashboard from './containers/Dashboard/Dashboard'
import Chatting from './containers/Chatting/Chatting'





 export default class App extends React.Component{
 	constructor(props){
 		super(props)
 		this.state={
 			hasError:false
 		}
 	}
 	componentDidCatch(err, info){
 		console.log(err, info)
 		this.setState({
 			hasError:true
 		})
 	}
	render(){
		return this.state.hasError ? <h2 style={{textAlign: 'center'}}>{'404 :('}</h2> : (
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
		)
	}
}
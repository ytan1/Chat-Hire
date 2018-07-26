import React from 'react'
import axios from 'axios'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUserInfo } from '../../redux/register.redux'
import { socketRegister } from '../../redux/chat.redux'

@withRouter
@connect(
	state => state.auth,
	{updateUserInfo, socketRegister}
	)
export default class AuthRoute extends React.Component{
	componentDidMount(){
		//not necessary do it in render instead
		// const pathname = this.props.history.location.pathname
		// const pathList = ['/login', '/register']
		// if(pathList.indexOf(pathname) > -1){
		// 	return null
		// }

		// still necessary for browser hydrate store state
		//check if there's cookie in response in backend server , process in Router.get('/info',...)
		axios.get('/api/user/info')
			.then((res) => {
				if(res.status === 200){
					console.log(res.data)
					if(res.data.code === 0){
						this.props.updateUserInfo(res.data.data)
						this.props.socketRegister(res.data.data._id)
					}
					else{
						console.log('jump to /login')
						this.props.history.push('/login')
					}
				}else{
					console.log(res.status)
				}
			},err => {
				console.log(err)
			})
	}	
	render(){
		const pathname = this.props.history.location.pathname
		const pathList = ['/login', '/register']
		if(pathList.indexOf(pathname) > -1){
			return <div></div>
		}
		let redirect = null
		if(!this.props.user){
			redirect = <Redirect to="/login" />
		}
		return <div>{redirect}</div>
	}
}
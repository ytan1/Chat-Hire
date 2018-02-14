import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUserInfo } from '../../redux/register.redux'
import { socketRegister } from '../../redux/chat.redux'

@withRouter
@connect(
	null,
	{updateUserInfo, socketRegister}
	)
export default class AuthRoute extends React.Component{
	componentDidMount(){
		
		const pathname = this.props.history.location.pathname
		const pathList = ['/login', '/register']
		if(pathList.indexOf(pathname) > -1){
			return null
		}


		//check if there's cookie in response in backend server , process in Router.get('/info',...)
		axios.get('/user/info')
			.then((res) => {
				if(res.status === 200){
					console.log(res.data)
					if(res.data.code === 0){
						this.props.updateUserInfo(res.data.data)
						
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
		return <div></div>
	}
}
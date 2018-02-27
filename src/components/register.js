import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Divider, Segment, Input } from 'semantic-ui-react'
import CheckBox from './checkBox/checkBox'
import {connect} from 'react-redux'

import { registerInfo } from '../redux/register.redux'
import { socketRegister } from '../redux/chat.redux'
@connect(
    state => state.auth,
    {registerInfo, socketRegister}
  )
export default class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //these state only for input 
      user:'',
      pwd: '',
      repeatPwd: '',
      isBoss: true
    }
    // this.handleName = this.handleName.bind(this)   not necessary if used in arrow function as below
    this.checkPosition = this.checkPosition.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleRegister(){
    console.log(this.state)
    this.props.registerInfo({user: this.state.user, pwd: this.state.pwd, repeatPwd: this.state.repeatPwd, type: this.state.isBoss?'Boss':'Employee'})
  }
  checkPosition(e){
    this.setState({
      isBoss: e.target.innerHTML==='Boss'
    })
  }
  handleName(key, e){
    this.setState({
      [key]: e.target.value
    })

  }
  render() {

    //if register success this.props._id exists socketRegister before redirect
    if(this.props._id){
      this.props.socketRegister(this.props._id)
    }

    return (
      <div id="register">
        {this.props.redirect && <Redirect to={this.props.redirect}></Redirect>}
      	<Segment basic>
	      	<Input fluid label={{basic: true, content:"Name"}} onChange={(e) => this.handleName('user', e)} value={this.state.user} /> 
          <Divider hidden />
          <Input fluid label={{basic: true, content:"Password"}} type='password' onChange={(e) => this.handleName('pwd', e)} value={this.state.pwd} />
          <Divider hidden />
          <Input fluid label={{basic: true, content:" Confirm "}} type='password' onChange={(e) => this.handleName('repeatPwd', e)} value={this.state.repeatPwd} />
          <Divider hidden />
        {/*can not use synthetic event on component? pass onClick as a prop*/}
          <CheckBox onClick={this.checkPosition} isBoss={this.state.isBoss} />
	      	<Divider horizontal />
	      	<Button secondary fluid onClick={this.handleRegister}>Sign Up Now</Button>
          <Divider hidden />
          { this.props.msg&&this.props.errorPage==='register' ? <div className='error-msg'>{this.props.msg}</div> : null}
	    </Segment>
      </div>
    );
  }
}
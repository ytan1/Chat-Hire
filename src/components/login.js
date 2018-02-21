import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Divider, Segment, Input } from 'semantic-ui-react'
import { Logo } from './logo/logo'
import { connect } from 'react-redux'
import { loginInfo } from '../redux/register.redux'
import { socketRegister } from '../redux/chat.redux'

@connect(
    state => state.auth,
    {loginInfo, socketRegister}
  )
export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pwd: ''
    }
    this.register = this.register.bind(this);
    // this.login = this.login.bind(this) not necessary if use () =>login
  }
  register(){
  	this.props.history.push('/register')
  }
  login(){
    this.props.loginInfo(this.state)
  }
  handleChange(item, e){
    this.setState({
      [item]: e.target.value
    })
  }
  render() {
    //if log In success this.props._id exists socketRegister before redirect
    if(this.props._id){
      this.props.socketRegister(this.props._id)
    }
    return (
      <div>
        {this.props.redirect && <Redirect to={this.props.redirect}></Redirect>}
      	<Logo />
      	<Segment basic>
      		<Input fluid label={{basic: true, content:"Name"}} onChange={(e) => this.handleChange('user', e)} value={this.state.user}/> 
      		<Divider hidden />
			     <Input fluid label={{basic: true, content:"Password"}} onChange={(e) => this.handleChange('pwd', e)} value={this.state.pwd}/> 
			     <Divider hidden />
	      	<Button primary fluid onClick={() => this.login()}>Login</Button>
	      	<Divider horizontal>OR</Divider>
	      	<Button secondary fluid onClick={this.register}>Sign Up Now</Button>
	    </Segment>
      </div>
    );
  }
}
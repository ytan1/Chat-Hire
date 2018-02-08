import React from 'react';
import {connect} from 'react-redux'
import { Card, Image, Button, Modal, Divider } from 'semantic-ui-react'
import cookies from 'browser-cookies'
import { Redirect } from 'react-router-dom'
import {logout} from '../../redux/register.redux'




@connect(
	state => state.auth,
	{logout}
)
export default class Myinfo extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
    	open: false
    }

  }

  triggerModal(){

  	this.setState({
  		open: true
  	})
  }
  closeModal(){
  	this.setState({
  		open: false
  	})
  }

  logout(){
  	this.setState({
  		open: false
  	})
  	//use a package to erase the cookie
  	cookies.erase('userid')

  	 this.props.logout()

  }

  render() {
  	const title = this.props.type==='Boss'?`Looking for ${this.props.title}`:null

    return (
      <div style={{padding:20}}>
      	<Card centered fluid>
      		<Image src={`/pics/${this.props.picName}`} />
      		<Card.Content>
      			<Card.Header style={{textAlign:'center'}}>{this.props.user}</Card.Header>
      			<Card.Meta style={{textAlign:'center'}}>{this.props.type==='Boss'?this.props.company:this.props.education}</Card.Meta>
      			<Card.Meta>{title}</Card.Meta>
      			<Card.Description>{this.props.more}</Card.Description>
      			
      		</Card.Content>
      		<Card.Content extra>
      			{this.props.CVName ? <a href={`http://localhost:3030/cv/${this.props.CVName}`} download >My CV</a> : null }
      		</Card.Content>

      	</Card>
      	<Divider hidden />
      	<Divider hidden />
      	<Button fluid content='Log Out' onClick={() => this.triggerModal()}/>
      	<Modal size='small' open={this.state.open} onClose={this.closeModal}>
      		<Modal.Header>
      			Do you want to log out?
      		</Modal.Header>
      		<Modal.Actions>
      			<Button negative onClick={() => this.closeModal()}>Nope</Button>
      			<Button positive icon='checkmark' onClick={() => this.logout()} content='Yes' />
      		</Modal.Actions>
      	</Modal>
      </div>


    ) ;
  }
}
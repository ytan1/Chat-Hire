import React from 'react';
import {connect} from 'react-redux'
import {Route,Redirect,Switch} from 'react-router-dom'
import { Menu, Label, Icon } from 'semantic-ui-react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

import PersonList from '../../components/list/personList'
import Myinfo from '../Myinfo/Myinfo'
import MessageCenter from '../MessageCenter/MessageCenter'


const Boss = () => 
	(<PersonList type='Boss' />)
const Employee = () =>
	(<PersonList type='Employee' />)



@connect(
	state => ({...state.auth, unread: state.chat.unread}),
	null
)
export default class Dashboard extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
    	activeItem:''
    }
    
    this.Constant = {
    	pageList: [
	    	{
	    		title: 'Employer List',
	    		icon: 'users',
	    		type: ['Employee'],
	    		name: 'Employers',
	    		path: '/employee',
	    		component: Employee

	    	},
	    	{
	    		title: 'Employee List',
	    		icon: 'users',
	    		type: ['Boss'],
	    		name: 'Employees',
	    		path: '/boss',
	    		component: Boss

	    	},
	    	{
	    		title: 'Message',
	    		icon: 'comment',
	    		type: ['Boss', 'Employee'],
	    		name: 'Message',
	    		path: '/message',
	    		component: MessageCenter

	    	},
	    	{
	    		title: 'My Info',
	    		icon: 'id card outline',
	    		type: ['Boss', 'Employee'],
	    		name: 'My Info',
	    		path: '/myinfo',
	    		component:Myinfo

	    	}

	    ]
	};
	

  }
  ///seems a bug, cannot receive props in constructor or componentDidMount
  // componentDidUpdate(){                       //use this.props.location.pathname to render
  // 	if(!this.state.activeItem){
	 //  	this.setState({
		// 	activeItem: this.props.type.toLowerCase()
		// })
  // 	}
  // 	console.log(this.state.activeItem)     //this part is alternated by the code in the front of render
  														//fix bug when refreshing every redux prop is undefined
  // }

  // componentDidMount(){
 	// //for get all messages sent or received by this user and record socketId in server
  // 	this.props.socketRegister(this.props._id) //cannot do this cause socket Register repeatly
  // }
	

  navClick(data){
  	this.props.history.push(data)


  }

  render() {
  	const pathname = this.props.location.pathname
  	

  	//check if type is passed in as prop
	if(!this.props.type && this.props.isLogout===0){
		return <div></div>
	}else if(this.props.isLogout===-1){
			return <div><Redirect to='/login' /></div>
	}
	

  	const pageList = this.Constant.pageList.filter( v => v.type.indexOf(this.props.type) > -1 )
  	console.log(pageList)
  	const currentPage =  pageList.find(v => (v.path===pathname))
  	//if the pathname doesn't match any
  	if(!currentPage) { return <Redirect to={this.props.redirect} />}
  	const title = currentPage.title

  	const unreadColor = this.props.unread ? 'teal' : 'grey'

    return (
      <div className='container'>
 		 {/*check if personal info complete*/}
      	{this.props.redirect && (this.props.redirect==='/bossinfo' || this.props.redirect==='/employeeinfo')? <Redirect to={this.props.redirect} /> : null}
      	<div className='header1'>{title}</div>
      	
      	<div style={{marginTop:'60px'}}>
      		<TransitionGroup><CSSTransition key={this.props.location.key} classNames="fade" timeout={300}><Switch location={this.props.location}>
      		{pageList.map(v => <Route key={v.path} path={v.path} component={v.component} />)}
      		</Switch></CSSTransition></TransitionGroup>
      	</div>

  		<Menu fluid className='footer' widths={3}>
  			{pageList.map(v => (<Menu.Item name={v.name} key={v.name} active={v.path===pathname} onClick={()=>this.navClick(v.path)}>

  					<Icon name={v.icon} />
  					{v.name}
  					{v.name==='Message' ? <Label color={unreadColor}>{this.props.unread}</Label> : null}	
  					
  				</Menu.Item>)
  				
  			)}
 
  		</Menu>
  	
      </div>
    ) ;
  }
}



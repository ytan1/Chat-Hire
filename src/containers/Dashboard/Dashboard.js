import React from 'react';
import {connect} from 'react-redux'
import {Route,Redirect} from 'react-router-dom'
import { Segment, Menu, Icon } from 'semantic-ui-react'
import PersonList from '../../components/list/personList'
// import MessageCenter from '../MessageCenter/MessageCenter'
import Myinfo from '../Myinfo/Myinfo'

const MessageCenter = () => {
	return <div>Test </div>
}

const Boss = () => 
	(<PersonList type='Boss' />)
const Employee = () =>
	(<PersonList type='Employee' />)



@connect(
	state => state.auth,
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
  // 	console.log(this.state.activeItem)
  	
  // }

	

  navClick(data){
  	this.props.history.push(data)


  }

  render() {
  	const pathname = this.props.location.pathname
  	

  	//check if type is passed in as prop
	if(!this.props.type && this.props.isLogout===0){
		return null
	}else if(this.props.isLogout===-1){
			return <Redirect to='/login' />
	}
	

  	const pageList = this.Constant.pageList.filter( v => v.type.includes(this.props.type) )
  	console.log(pageList)
  	const currentPage =  pageList.find(v => (v.path===pathname))
  	//if the pathname doesn't match any
  	if(!currentPage) { return <Redirect to={this.props.redirect} />}
  	const title = currentPage.title
  	const {activeItem} = this.state
  	

    return (
      <div className='container'>
 		 {/*check if personal info complete*/}
      	{this.props.redirect && (this.props.redirect==='/bossinfo' || this.props.redirect==='/employeeinfo')? <Redirect to={this.props.redirect} /> : null}
      	<div className='header1'>{title}</div>
      	
      	<div style={{marginTop:'60px'}}>
      		{pageList.map(v => <Route key={v.path} path={v.path} component={v.component} />)}
      	</div>

  		<Menu fluid className='footer' widths={3}>
  			{pageList.map(v => <Menu.Item name={v.name} key={v.name} active={v.path===pathname} icon={{name: v.icon}} onClick={()=>this.navClick(v.path)} />)}
  		</Menu>
  	
      </div>
    ) ;
  }
}



import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Segment, Input, Divider, TextArea, Button, Image } from 'semantic-ui-react'

import Avatar from '../../components/avatar/avatar'
import { storePic } from '../../redux/register.redux'

@connect(
	state => state.auth,
	{storePic}
	)
export default class Bossinfo extends React.Component{
	constructor(props){
		super(props)
		this.state = {

			file:'',
			filename:'',
			company:'',
			title: '',
			more:''
		}
		this.handlePicChange = this.handlePicChange.bind(this)
		this.complete = this.complete.bind(this)
	}

	handlePicChange(e){
		let file = e.target.files[0]

		let reader = new FileReader()
		if(!file){
			this.setState({
				imgURL: '',  //for preview
				file: ''
			})
			return
		}
		reader.onloadend = () => {
			this.setState({
				imgURL: reader.result,
				file: file,  
				picName:'Pic_' + this.props.user + '.' + file.type.match(/\/(\w+)$/)[1]
			})
		}
		reader.readAsDataURL(file)

	}

	handleTextChange(key, e){
		
		this.setState({
			[key]: e.target.value
		})
		e.preventDefault()
	}

	complete(){	
		console.log(this.state)
		this.props.storePic({...this.state, user: this.props.user, type: this.props.type})
	}

	render(){


		//check if redirect
		let redirect = null
		if(this.props.redirect && this.props.location.pathname!==this.props.redirect){
			redirect = <Redirect to={this.props.redirect}></Redirect>
		}


		return (
			<Segment basic >

				{redirect}

				{/*choose an avatar and preview using this.state.imgURL*/}
				<Avatar handlePicChange={this.handlePicChange} imgURL={this.state.imgURL} />
				<Divider hidden />
				<Input fluid label={{basic: true, content: 'Company'}} onChange={(e) => this.handleTextChange('company', e)} value={this.state.company} />
				<Divider hidden />
				<Input fluid label={{basic: true, content: 'Title'}}  onChange={(e) => this.handleTextChange('title', e)} value={this.state.title} />
				<Divider horizontal >Your requirement</Divider>
				<TextArea style={{width: '100%', border: 'none', padding: '6px'}} placeholder="Tell us more" rows={10} onChange={(e) => this.handleTextChange('more', e)} value={this.state.more} />
				<Divider hidden />
				<Button primary fluid onClick={this.complete}>Complete</Button>

			</Segment>
			)
	}
}
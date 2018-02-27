import React from 'react';
import { Image } from 'semantic-ui-react'
import './avatar.css'


export default class Avatar extends React.Component {


  render() {
  	let imagePreview = null
  	if(this.props.imgURL){
  		imagePreview = (

  				<Image src={this.props.imgURL} alt="avatar" size='tiny' floated='right' rounded/>

  			)
  	}
    return (
      <div>
      	<div className='unit'>
      		<p>Please choose your picture</p>
      		<input type="file" onChange={this.props.handlePicChange} className='input'/>
      	</div>
      	<div className='unit'>
      		{imagePreview}
      	</div>
      </div>
    );
  }
}
import * as url from './logo.png'
import React from 'react'
import { Image } from 'semantic-ui-react'
import './logo.css'

export const Logo = () => {
	return (
			<div className="logo-container">
				<Image src={url} rounded fluid/>
			</div>
		)
}
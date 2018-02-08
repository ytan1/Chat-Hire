import React from 'react'
import './checkBox.css'

export default class CheckBox extends React.Component {

	//use the props.isBoss delivered from father component to change the color
	render(){
		let classNameLeft = 'halfCheckBox left', classNameRight = 'halfCheckBox right', bossClass, workerClass
		if(this.props.isBoss){
			bossClass = classNameLeft + ' highlight'
			workerClass = classNameRight
		} else{
			bossClass = classNameLeft 
			workerClass = classNameRight + ' highlight'
		}
		return (
				<div className="checkbox" onClick={this.props.onClick}>
					<div className={bossClass}>Boss</div>
					<div className={workerClass}>Employee</div>
				</div>
			)

	}
}
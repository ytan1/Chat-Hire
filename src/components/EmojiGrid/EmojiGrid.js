import React from 'react';
import { Grid } from 'semantic-ui-react'

import './emojiGrid.css'




export default class EmojiGrid extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };

  render() {
  	const columnNum = this.props.columnNum
  	const data = this.props.data
  	const dataRow = []

  	for (var j = 0; j < data.length; j++){
  		if(!dataRow[Math.floor(j/columnNum)]) {dataRow[Math.floor(j/columnNum)]=[]}
  		dataRow[Math.floor(j/columnNum)].push(data[j])	
  	}

  	const content = dataRow.map((v, i) => (
  		<Grid.Row key={i} className='row'>
  			{v.map((w, k) => (
  				<Grid.Column key={k} onClick={(el) => this.props.sendEmoji(w.text)}>{w.text}</Grid.Column>
  			))}
  		</Grid.Row>
  	))

  	

    return (
      <Grid columns={columnNum} className='emojiContainer'>
      	{content}
      </Grid>
    );
  }
}
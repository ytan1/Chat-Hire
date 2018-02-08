import React from 'react';
import {connect} from 'react-redux'
import {Card, Image, Segment} from 'semantic-ui-react'
import {updatePersonList} from '../../redux/userlist.redux'
@connect(
	state => ({userlist: state.userlist}),
	{updatePersonList}
)

export default class PersonList extends React.Component {


  constructor(props) {
    super(props);
  }
  componentWillMount(){	

  	//requesting users' data from redux axios to this.props.userlist
  	this.props.updatePersonList(this.props.type)

  	
  }

  render() {

  	console.log(this.props.type)
  	if(!this.props.userlist.length){
  		return null
  	}
  	console.log(this.props.userlist)

    return (
      <div className='cardsContainer'>
      	<Card.Group itemsPerRow={1}>
      		{this.props.userlist.map(v => 
      			{	
      				const meta = this.props.type!=='Boss' ? `${v.title}, ${v.company}` : v.education

      				return (<Card key={v.user}>
			      				<Card.Content>
				      			    <Image floated='right' size='small' src={`/pics/${v.picName}`} alt='avatar' />
				      			    <Card.Header>{v.user}</Card.Header>
				      			    <Card.Meta>{meta}</Card.Meta>
				      			    <Card.Description>{v.more}</Card.Description>
				      			</Card.Content>
				      			<Card.Content extra>
				      				{v.CVName ? (<a href={`http://localhost:3030/cv/${v.CVName}`} download >{`${v.user}\'s CV`}</a>) : null}
				      			</Card.Content>
	      					</Card>)}
      		)}
      	</Card.Group>

      </div>
    );
  }
}
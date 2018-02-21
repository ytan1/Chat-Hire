import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'



@withRouter
@connect(
	state => state,
	null
)
export default class MessageCenter extends React.Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
  constructor(props) {
    super(props)
  }
  render() {
  	
  	if(!this.props.chat.msgList.length) {
  		return <div style={{fontSize: 12, textAlign: 'center'}}>There is no message yet!</div>
  	}
    //get all messages send or recv by this user 
  	let list = [], msgList = this.props.chat.msgList
  
	for (var w =0; w< msgList.length; w++) {
		for (var v=0; v< list.length; v++){
			if( msgList[w].chatId===list[v].chatId ) {
				if( msgList[w].time>list[v].time ){
					list[v] = {...list[v], ...msgList[w]}
                    if(msgList[w].unread && msgList[w].to===this.props.auth._id)  { list[v].unreadCount++; console.log(list[v].unreadCount)}
					break
				} else {
                    if(msgList[w].unread && msgList[w].to===this.props.auth._id)  { list[v].unreadCount++; console.log(list[v].unreadCount) }
					break
				}
			}
		}
		if(v === list.length){
			list.push(msgList[w])
            list[v].unreadCount = 0
            if(msgList[w].unread && msgList[w].to===this.props.auth._id)  { list[v].unreadCount++; console.log(list[v].unreadCount)}
		}
	}
  	//in time order
	list.sort((a,b) => b.time-a.time)
	
	console.log(list)
	list.forEach(v => {

		let urId = v.from!==this.props.auth._id ? v.from : v.to
		console.log(urId)
		let you = this.props.userlist.find(w => w._id===urId) //crash if jump to msgcenter page initially
		v.user = you.user                                //because userlist not updated until jump to personlist after login , need to fix?
		v.picName = you.picName

		

	})





    return (

      <div className='message-center'>
      	<Card.Group itemsPerRow={1}>
	      	{
	      		list.map((v, index) => (
	      			<Card key={index}>
	      				<Card.Content>
	      					<Image floated='left' size='mini' src={`/pics/${v.picName}`} />
	      					<Card.Header>{v.user}</Card.Header>
	      					<Card.Meta>{v.time}</Card.Meta>
                            <Card.Description>{v.text}<span className='unread'>{v.unreadCount}</span></Card.Description>
	      				</Card.Content>
	      			</Card>
	      		))
	      	}
      	</Card.Group>
      </div>
    );
  }
}
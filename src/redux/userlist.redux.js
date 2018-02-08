
import axios from 'axios'
const UPDATE_SUCCESS = 'update-success'


export const userlist = (state=[], action) =>{
	switch (action.type) {
		case UPDATE_SUCCESS:
			return action.payload
		default:
			return state
	}
}

const updateSuccess = (data) => {
	return {
		type: UPDATE_SUCCESS,
		payload: data
	}
}


export const updatePersonList = (usertype) => {
	return dispath => {
		const type = usertype==='Boss' ? 'Employee' : 'Boss'
		axios.get(`/user/userlist?type=${type}`)
			.then(res => {
				if(res.status===200){
					dispath(updateSuccess(res.data.data))
				}else{
					console.log(res.status)
				}
			}, err => {console.log(err)})
	}
}
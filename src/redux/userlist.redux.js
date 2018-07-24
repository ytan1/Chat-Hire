
// import axios from 'axios' use customized axios for proxy from store.js
const UPDATE_SUCCESS = 'update-success'


export const userlist = (state=[], action) =>{
	switch (action.type) {
		case UPDATE_SUCCESS:
			return action.payload
		default:
			return state
	}
}

export const updateSuccess = (data) => {
	return {
		type: UPDATE_SUCCESS,
		payload: data
	}
}


export const updatePersonList = (usertype) => {
	return (dispath,getState, axios) => {
		const type = usertype==='Boss' ? 'Employee' : 'Boss'
		const request = axios.get(`/user/userlist?type=${type}`)
		return 	request.then(res => {
					if(res.status===200){
						dispath(updateSuccess(res.data.data))
					}else{
						console.log(res.status)
					}
				}, err => {console.log(err)})
	}
}
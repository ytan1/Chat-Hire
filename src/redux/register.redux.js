import axios from 'axios'
import { getRedirect } from '../util.js'
const LOGIN_ERROR = 'login-error'
const LOGIN_SUCCESS = 'login-success'

const UPDATE_USERINFO = 'update-userinfo'
const LOGOUT = 'logout'

const initState = {
	user: '',
	pwd: '',
	type: '',
	msg: '',
	redirect:'',
	isLogout: 0
}
export const auth = (state=initState, action) =>{
	switch (action.type){
		case LOGIN_SUCCESS:
			return {...state, isLogout: 1, ...action.payload, redirect:getRedirect(action.payload)}
		case LOGIN_ERROR:
			return {...state, msg: action.msg, errorPage: action.errorPage}
		case UPDATE_USERINFO:
			return {...state, isLogout: 1,...action.payload, redirect:getRedirect(action.payload)}
		case LOGOUT: 
			return {...initState, isLogout: -1}
		default: 
			return state
	}
}

export const loginInfo = (info) => {
	return (dispatch) => {
		let { user, pwd } = info
		if(!user || !pwd) {
			dispatch(loginError({msg: "Info not completed", errorPage: 'login'}))
		}else{
			axios.post('user/login', {data: info})
				.then(res => {
					if(res.status===200 && res.data.code === 0){
						dispatch(loginSuccess(res.data.data))
					}
					else{
						dispatch(loginError({msg: res.data.msg, errorPage: 'login'}))
					}
				})
		}
	}
}

export const storePic = (info) => {
	return (dispatch) => {
		let { user, type, file, picName, company, title, more, education, CV } = info
		let picData = new FormData(), CVData = new FormData()

		if(!file){
			dispatch((loginError({msg: "Please upload your avatar!", errorPage:'info'})))
			return false
		}
		if(type==='Employee' && (!CV)) {
			dispatch((loginError({msg: "Please upload a file for your CV!", errorPage:'info'})))
			return false
		}
		
		//filename field should be in front of file field , 
		//otherwise diskstorage cannot get req.body.filename
		let CVName = ''
		if(CV){
			CVName = user + '.' + CV.name.match(/\.(\w+)$/)[1]
			CVData.append('user', user)
			CVData.append('filename', CVName)
			CVData.append('file', CV)
		}
			

		picData.append('user', user)
		picData.append('filename', picName)
		picData.append('file', file)
		
		// picData.append('imgURL', imgURL)

		
		function passCVData(){
			if(!CV){ return null}
			return axios.post('/user/employeeinfo/cv', CVData)
		}

		function passPicData(){
			
			return type==='Boss'?axios.post('/user/bossinfo/pic', picData):axios.post('/user/employeeinfo/pic', picData)
		}
		function passData(){
			return type==='Boss'?axios.post('/user/bossinfo', {user, company, title, more}):axios.post('/user/employeeinfo', {user, education, more})
		}

		let axiosArr = [passPicData(), passData()]
		if(CV) {axiosArr.push(passCVData())}

		Promise.all(axiosArr)
			.then((res) => {
				console.log(res[2])
				if(res[0].data.code === 0 && res[1].data.code === 0 && (res[2]?res[2].data.code===0:true)){

					dispatch(updateUserInfo({...info, CVName}))
				}else{
					dispatch(loginError({msg: "Error when store pic and other info!", errorPage: 'info'}))
				}
			}, err => {
				console.log(err)
			})
	}
}

//for check if is previous user using cookie
export const updateUserInfo = (data) => {
	return {
		type: UPDATE_USERINFO,
		payload: data
	}
}

const loginError = ({msg, errorPage}) => {
	return {
		msg,
		errorPage,  //for register or login
		type: LOGIN_ERROR
	}
}

const loginSuccess = (data) => {
	return {
		type: LOGIN_SUCCESS,
		payload: data
	}
}

export const registerInfo = ({user, pwd, repeatPwd, type}) =>{

	return (dispatch) => {
		//if validate info
		if(!user || !pwd || !repeatPwd){
			dispatch(loginError({msg: "Info not completed!", errorPage: 'register'}))
		}
		else if(pwd !== repeatPwd ){
			dispatch(loginError({msg: "Please input same password!",  errorPage: 'register'}))
		}
		else if(pwd.length < 6){
			dispatch(loginError({msg: "Password too short!",  errorPage: 'register'}))
		}
		else if(pwd.search(/\d/)===-1 || pwd.search(/[a-z]/)===-1 || pwd.search(/[A-Z]/)===-1){
			dispatch(loginError({msg: "Password should be more complex! Please include number, lowercase & uppercase...",  errorPage: 'register'}))
		}else{
			//pass info to server localhost:3030/user/info
			axios.post('/user/register',
					{data: {user, pwd, type}}
				)
			.then((res) => {
				if(res.status===200 && res.data.code===0){
					dispatch(loginSuccess({...res.data.data, pwd:''}))
				}
				else{
					dispatch(loginError({msg: res.data.msg, errorPage: 'register'}))
				}
			})
		}
		
	}
}

export const logout = () => {
	return {
		type: LOGOUT
	}
}

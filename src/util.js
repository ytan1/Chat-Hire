export const getRedirect = ({type, picName}) =>{
	let url = (type==='Boss')?'/boss' : '/employee'
	if(!picName){
		url += 'info'


	}
	return url
}


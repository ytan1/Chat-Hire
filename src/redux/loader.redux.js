const TOGGLE_LOADER = 'toggle-loader'
let count = 0

export function loaderActive (state=false, action){
	switch (action.type ){
		case TOGGLE_LOADER:
		if(action.isActive){
			count++
		}else{
			count--
		}
		if(count > 0){
			return true
		}else{
			return false
		}
		
		
		default: 
			return state
	}
}

export function toggle(boo){
	return {type: TOGGLE_LOADER, isActive: boo }
}
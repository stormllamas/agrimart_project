import { SET_MOBILE_MENU } from '../actions/types'

const initialState = {
  profileOpened: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_MOBILE_MENU:
      return {
        ...state,
        profileOpened: action.payload
      }
    
    default:
      return state
  }
}
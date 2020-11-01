import { CONTACTING, CONTACTED } from '../../actions/types'

const initialState = {
  contacting: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case CONTACTING:
      return {
        ...state,
        contacting: true,
      }

    case CONTACTED:
      return {
        ...state,
        contacting: false,
      }
    
    default:
      return state
  }
}
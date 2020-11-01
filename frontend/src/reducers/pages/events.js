import { GET_EVENT, EVENT_LOADING, EVENT_ERROR } from '../../actions/types'

const initialState = {
  eventLoading: true,
  data: null,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case EVENT_LOADING:
      return {
        ...state,
        eventLoading: true,
      }

    case GET_EVENT:
      return {
        ...state,
        data: action.payload,
        eventLoading: false,
      }

    case EVENT_ERROR:
      return {
        ...state,
        data: null,
        eventLoading: false,
      }
    
    default:
      return state
  }
}
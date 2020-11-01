import { GET_SERVICES, SERVICE_LOADING, SERVICE_ERROR } from '../../actions/types'

const initialState = {
  serviceLoading: true,
  data: null,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SERVICE_LOADING:
      return {
        ...state,
        serviceLoading: true,
      }

    case GET_SERVICES:
      return {
        ...state,
        data: action.payload,
        serviceLoading: false,
      }

    case SERVICE_ERROR:
      return {
        ...state,
        data: null,
        serviceLoading: false,
      }
    
    default:
      return state
  }
}
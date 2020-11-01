import { SITE_LOADING, SITE_LOADED, HIDE_SITE_MESSAGE } from '../actions/types'

const initialState = {
  siteInfo: null,
  siteInfoLoading: true,
  showSiteMessage: true,
  
  // appLoading: true,
  // currentVersion: 'v.4.9',
  // version: null,
  // maintenanceMode: false,
  // betaMode: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SITE_LOADING:
      return {
        ...state,
        siteInfoLoading: true,
      }

    case SITE_LOADED:
      return {
        ...state,
        siteInfoLoading: false,
        siteInfo: action.payload
      }

    case HIDE_SITE_MESSAGE:
      return {
        ...state,
        showSiteMessage: false,
      }
    
    default:
      return state
  }
}
import { SET_MOBILE_MENU } from './types'

export const setMobileMenu = bool => {
  return {
    type: SET_MOBILE_MENU,
    payload: bool
  }
}
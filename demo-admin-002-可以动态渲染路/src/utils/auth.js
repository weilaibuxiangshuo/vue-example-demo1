import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const flagKey = 'flag'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getFlag() {
  return Cookies.get(flagKey)
}

export function setFlag(flag) {
  return Cookies.set(flagKey, flag)
}

export function removeFlag() {
  return Cookies.remove(flagKey)
}


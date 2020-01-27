import Cookies from 'js-cookie'

const TokenKey = 'authorization'
const stopoff='isstopoff'
const usernameKey="usernamecookies"


export function getToken() {
  return Cookies.get(TokenKey)
}


export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getStopOff(){
  return Cookies.get(stopoff)
}

export function setStopOff(value){
  return Cookies.set(stopoff,value)
}

export function removeStopOff(value){
  return Cookies.remove(stopoff)
}

export function setName(value){
  return Cookies.set(usernameKey,value)
}

export function getName(){
  return Cookies.get(usernameKey)
}

export function removeName(){
  return Cookies.remove(usernameKey)
}

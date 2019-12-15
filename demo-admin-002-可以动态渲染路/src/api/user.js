import request from '@/utils/request'
import { removeToken } from '@/utils/auth'
export function login(data) {
  return request({
    url: '/api/login/',
    method: 'post',
    data
  })
}


// export function login() {
//   return request({
//     url: 'api/login/',
//     method: 'get',
//   })
// }

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout/',
    method: 'post'
  })
}

import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncCeshiRoutes } from '@/router'
import router from '@/store'
import Layout from '@/layout'
import { constantRoutes } from '../../router'
import store from '../index'

// import router from './router'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log(response, "返回的response")
        const data = response
        commit('SET_TOKEN', data.authorization)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        setToken(data.authorization)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    commit('SET_TOKEN', '')
    removeToken()
    router.getters.routers
    // return new Promise((resolve, reject) => {
    //   // logout(state.token).then(() => {
    //   //   commit('SET_TOKEN', '')
    //   //   removeToken()
    //   //   resetRouter()
    //   //   resolve()
    //   // }).catch(error => {
    //   //   reject(error)
    //   // })
    // })
  },




  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}




export default {
  namespaced: true,
  state,
  mutations,
  actions
}


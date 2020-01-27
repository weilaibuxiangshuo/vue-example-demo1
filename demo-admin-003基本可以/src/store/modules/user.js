import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken,setName,removeName} from '@/utils/auth'
import { resetRouter} from '@/router'
import store from '../../store'
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(username, password)
    return new Promise((resolve, reject) => {
      console.log('开始请求之前')
      login({ username: username.trim(), password: password }).then(response => {
        console.log('请求的结果', response)
        const { data } = response
        commit('SET_TOKEN', data.authorization)
        setToken(data.authorization)
        setName(data.name)
        // setStopOff(0)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
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
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        store.commit('permissions/SET_STOPSHOW',0)
        removeToken()
        resetRouter()
        removeName()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
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


import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import router from '../../router/index'
import Layout from '@/layout'
import {constantRoutes} from '../../router'
import store from '..'

// import router from './router'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  routers: constantRoutes,
  addRouters:[],
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
  SET_ROUTERS:(state,routers)=>{
    state.addRouters=routers
    state.routers=constantRoutes.concat(routers)
  }
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
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  ceshishow111({commit}) {
    let _temp=[
      {
        path: '/form',
        component: Layout,
        children: [
          {
            path: 'index',
            name: 'Form',
            component: () => import('@/views/form/index'),
            meta: { title: 'Form', icon: 'form' }
          }
        ]
      },
      {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
      },
    ]
    commit('SET_ROUTERS',_temp)
    console.log("stor里的调用")


    // router.addRoutes(router.options.routes)
    // router.addRoutes([
    //   {
    //     path: '/',
    //     component: Layout,
    //     redirect: '/dashboard',
    //     children: [{
    //       path: 'dashboard',
    //       name: 'Dashboard',
    //       component: () => import('@/views/dashboard/index'),
    //       meta: { title: 'Dashboard', icon: 'dashboard' }
    //     }]
    //   },
    //   { path: '*', redirect: '/404', hidden: true }
    // ])
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


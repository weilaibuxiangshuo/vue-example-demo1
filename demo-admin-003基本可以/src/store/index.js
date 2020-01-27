import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

//配合第一种
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permissions from './modules/permissions'
import usermessages from './modules/usermessages'

Vue.use(Vuex)
//第一种
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permissions,
    usermessages,
  },
  getters
})


// //第二种
// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)

// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

// const store= new Vuex.Store({
//   modules,
//   getters
// })

export default store

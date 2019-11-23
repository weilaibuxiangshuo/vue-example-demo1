import router from './router'
// import {constantRoutes} from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        if (store.getters.addRouters.length===0) {
          // get user info
          console.log("获取权限")
          store.dispatch('user/ceshishow111').then(() => {
            console.log('store.getters')
            router.addRoutes(store.getters.addRouters)
            router.options.routes = store.getters.routers
            console.log(router.options.routes, '入会费入会费')
            console.log(store.getters.routers, '入会费入会费2')
            // console.log(to.path,'跳那里')
            // next()
          })
          // store.dispatch('user/ceshishow111')
          // router.addRoutes(store.getters.addRouters)
          // router.options.routes=store.getters.routers
          // router.options.routes.push({
          //   path:"/hello",component:() => import('@/views/form/index')
          // })
          // console.log(router.options.routes,'入会费入会费')
          // console.log(store.getters.routers,'入会费入会费2')
          console.log('88888')
          console.log(to.path,'跳那里')
          next()
        }else(
          next()
        )
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

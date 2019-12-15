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
        // console.log('login上面的topath',to.path)
        // console.log('login执行了几次',store.getters.routers.length)
        // console.log('login执行了几次',store.getters.routers)
        if (store.getters.addRouters.length===0) {
          // console.log('login上面的topath',to.path)
          store.dispatch('permissions/ceshishow111').then(() => {
            router.addRoutes(store.getters.addRouters)
            router.options.routes = store.getters.routers
          })
          // let temp01=[
          //   {
          //     path: '/',
          //     component: Layout,
          //     redirect: '/adminhome',
          //     children: [
          //       {
          //         path: 'adminhome',
          //         name: 'Adminhome',
          //         component: () => import('@/views/dashboard/index'),
          //         meta: { title: 'adminhome', icon: 'dashboard',permission:['m1-m2'] },
          //       },          
          //     ]
          //   }
          // ]
          // router.addRoutes(temp01)
          // next(to)
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

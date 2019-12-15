import { constantRoutes,asyncCeshiRoutes} from '../../router'
import store from '../index'
import { nextTick } from 'q'


const state = {
    routers: constantRoutes,
    addRouters: [],
}
const mutations = {
    SET_ROUTERS: (state, routers) => {
        state.addRouters = routers
        state.routers = constantRoutes.concat(routers)
    }
}


const actions = {
    ceshishow111({ commit }) {
        // console.log('同意')
        let _temp = [store.getters.name]
        // console.log(store.getters.name, '目前登陆者')
        if (_temp.includes('SuperAdmin')) {
            commit('SET_ROUTERS', asyncCeshiRoutes)
            // console.log("stor里的调用")
        } else {
            let allFilterRoutes=filterAsyncRoutes(asyncCeshiRoutes)
            // console.log('allFilterRoutes',allFilterRoutes)
            commit('SET_ROUTERS', allFilterRoutes)
            // filterAsyncRoutes(state.routers)
        }
    },
    wuliao(){
        console.log('同意')
    }
}


var controlRoutes=1


function hasPermission(tmp) {
    if (tmp.meta && tmp.meta.roles) {
        controlRoutes=0
        return false
    } else {
        return true
    }
}


export function filterAsyncRoutes(routes) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        // console.log('tem',tmp)
        const isTemp=hasPermission(tmp)
        // console.log('boole的值isTemp',isTemp)
        if (isTemp) {
            // console.log('route-是否执行',route.path)
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children)
            }
            res.push(tmp)
            if (controlRoutes===0){
                res.pop(tmp)
                controlRoutes=1
            }
        }
    })
    // console.log(res,'res')
    return res
}



export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
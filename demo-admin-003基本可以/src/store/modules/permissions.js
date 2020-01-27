import {constantRoutes,asyncConstantRoutes} from '@/router'
import {getName} from '@/utils/auth'
import {getUserPermissionInfo,getCeshiData} from '@/api/usermessages'
import {deepcloneRole} from '@/utils/userpublic.js'
import path from 'path'

import Layout from '@/layout';

const state={
    newaddrouters:[],
    newrouters:constantRoutes,
    stopshow:0,
}

const mutations={
    SET_ROUTERS:(state,temp)=>{
        state.newaddrouters=temp
        state.newrouters=constantRoutes.concat(temp)
    },
    SET_STOPSHOW:(state,kkk)=>{
        state.stopshow=kkk
    }
}



//生成路由
export function ceshiData(data,basePath="/"){
      let allData=[]
      for(let temp of data){
        if(temp.ismenu !== true){continue}
        const tempUrl1=temp.url.substring(0,1)
        const tempUrl=null
        if (tempUrl1==="/"){
          tempUrl=temp.url.substring(1)
        }else{
          tempUrl=temp.url
        }
        let tempPath=path.resolve(basePath,tempUrl)
        let dict1={
          meta:{title:temp.title,icon:temp.icon}          
        }
        if (temp.level===1){
          dict1.path=temp.url
          dict1.component=Layout
        }else{
          dict1.path=temp.url.substring(1)
          console.log('tempath',tempPath)
          dict1.component=()=>import(`@/views${tempPath}`)
          // dict1.component=resolve => require([`@/views${tempPath}`],resolve)
          // console.log("888",dict1.component)
        }
        if(temp.children){
          if(temp.children.length>=1){
            dict1.children=ceshiData(temp.children,tempPath)
          }
          if(temp.children.length===0){
            delete dict1.meta
            dict1.children=[{
              path:"index",
              component:()=>import(`@/views${tempPath}/index`),
              meta:{title:temp.title,icon:temp.icon} 
            }]
          }
        }
        allData.push(dict1)
      }
      // console.log('alldata',allData)
      return allData
    }

export function filterRoleRouters(conFilemRoutes, basePath, getRouteList) {
    const dataRoutes = [];
    for (let route of conFilemRoutes) {
      if (route.hidden) {
        continue;
      }
      const routePath = path.resolve(basePath, route.path);
      const data = route;
      if (route.children) {
        data.children = filterRoleRouters(
          route.children,
          (basePath = routePath),
          getRouteList
        );
      }

      if (
        getRouteList.includes(routePath) ||
        (data.children && data.children.length > 0)
      ) {
        dataRoutes.push(data);
      }
    }
    return dataRoutes;
  }

const actions={
    newaddrouters({commit}){
        let mmm= new Promise(resolve=>{
            let username=getName()
            let accessedRoutes
            if(username==="admin"){
                // let showUlr=ceshiData(response.ceshi)
                // console.log('showurl',showUlr)
                getCeshiData().then(response=>{
                  console.log('初始化数据',response.ceshi)
                  let showUlr=ceshiData(response.ceshi)
                  console.log('初始化数据2',showUlr)
                  accessedRoutes=asyncConstantRoutes.concat(showUlr)
                  console.log('所有',accessedRoutes)
                  commit('SET_ROUTERS',accessedRoutes)
                  resolve(accessedRoutes)
                })

            }else{
                getUserPermissionInfo(username).then(response=>{
                        console.log(response,'username')
                        let tempRoutes=deepcloneRole(asyncConstantRoutes)
                        let basePath="/"
                        let getUserPer=response.userper
                        let filterRoutes=filterRoleRouters(tempRoutes,basePath,getUserPer)
                        accessedRoutes=filterRoutes
                        commit('SET_ROUTERS',filterRoutes)                        
                        resolve(accessedRoutes)
                    })
            }
        })
        console.log('kljsldfklmmm',mmm)
        return mmm
    },
}


export default {
    namespaced:true,
    state,mutations,actions
}
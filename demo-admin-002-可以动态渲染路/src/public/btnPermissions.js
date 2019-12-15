import Vue from 'vue'

const has=Vue.directive('has',{
    inserted:function(el,binding,vnode){
        // console.log('vnode',vnode)
        let btnPermissions=vnode.context.$route.meta.btnPermissions
        let btnShow=vnode.data.attrs.showname
        // console.log('$route',btnPermissions)
        // console.log('$route',typeof (btnPermissions))
        if(!Vue.prototype.$_has(btnPermissions,btnShow)){
            // console.log('el',vnode.data.attrs.showname)
            // console.log('el',typeof(el))
            el.parentNode.removeChild(el)
        }
    }
})

Vue.prototype.$_has=function(value,btnShow){
    let isExit=false
    let btnPermissionsStr = btnShow;
    // console.log('btnPermissionsStr',btnPermissionsStr)
    // console.log('value',value)
    if(btnPermissionsStr===undefined || btnPermissionsStr===null){
        return false
    }else{
        if(value.indexOf(btnPermissionsStr)>-1){
            isExit=true
        }
        return isExit
    }

}


export {has}
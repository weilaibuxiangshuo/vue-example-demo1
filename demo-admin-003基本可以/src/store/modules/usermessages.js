import {getUserApi} from '@/api/usermessages'

const state={
    alluserinfo:[],
    totalcount:'',
}

const mutations={
    SET_ALLUSERS:(state,data)=>{
        state.alluserinfo=data
    },
    SET_COUNT:(state,count)=>{
        state.totalcount=count
    }
}

const actions={
    async getUserApiStore({commit},data){
        await getUserApi(data).then(res=>{
            commit('SET_ALLUSERS',res.data)
            commit('SET_COUNT',res.count)
        })
    }
}


export default {
    state,mutations,actions,namespaced:true,   
}
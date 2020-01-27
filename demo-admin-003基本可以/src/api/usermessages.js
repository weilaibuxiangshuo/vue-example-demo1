import request from '@/utils/request'


export function addUserInfo(data) {
    return request({
        url: `/usercontrol/`,
        data: data,
        method: "post"
    })
}


export async function editUserInfo(data) {
    return await request({
        url: `/usercontrol/`,
        data: data,
        method: "put"
    })
}

export async function getUserApi(page,size,searchmap) {
    return await request({
        url: `/userinfo/${page}/${size}/`,
        method: "get",
    })
}


export function deleteUserApi(data){
    return request({
        url: `/usercontrol/`,
        method: "delete",
        data:data
    })
}



export async function roleControlApi(data){
    return await request({
        url:"/rolecontrol/",
        method:"post",
        data:data
    })
}


export function getroleinfoApi(page,size,search){
    return request({
        url:`/roleinfo/${page}/${size}/`,
        method:"get",
        params:search,
    })
}


export function getRoleEditApi(data){
    return request({
        url:"/rolecontrol/",
        method:"get",
        params:data
    })
}


export async function deleteRoleEditApi(data){
    return await request({
        url:"/rolecontrol/",
        method:"delete",
        data:data
    })
}


export function getUserPermissionInfo(data){
    return  request({
        url:"/userpermission/",
        method:"post",
        data:data
    })
}


export function getCeshiData(){
    return request({
        url:"/ceshidata/",
        method:"get",
    })
}
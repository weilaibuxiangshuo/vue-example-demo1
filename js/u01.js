//数据&绑定
var app=new Vue({
    el:'#vue-app',
    data:{
        name:'管理员',
        world:'工作是就是一天再过一天',
    },
    methods:{
        greet:function(obj){
            return '百度每一天'+obj+this.name
        }
    }
})

/* 
el:element 需要获取取的元素，一定是html中的根据容器元素
data:用于数据的存储
*/



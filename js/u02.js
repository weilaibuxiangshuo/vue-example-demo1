//属性绑定
var app=new Vue({
    el:'#vue-app',
    data:{
        name:'管理员',
        world:'工作是就是一天再过一天',
        webhref:'http://www.baidu.com',
        newname:'世界中瞄准',
        websitetag:'<a href="http://qq.com">qq</a>'
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
methods:用于存储各种方法
data-binding:给属性绑定对应的值
*/
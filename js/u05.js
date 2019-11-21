//键盘事件及键值修饰符
var app=new Vue({
    el:'#vue-app',
    data:{
        name:"",
        age:"",
    },
    methods:{
        logname:function(){
            console.log('你正在输入你的名字：'+this.name)
        },
        logage:function(){
            console.log('你正在输入你的年龄：')
        }
    }
})
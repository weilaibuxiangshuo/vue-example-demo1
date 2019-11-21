//动态绑定css样式
var app=new Vue({
    el:'#vue-app',
    data:{
        changecolor:false,
        changelength:false,
    },
    methods:{
    },
    computed:{
        compclasses:function(){
            return {
                changecolor:this.changecolor,
                changelength:this.changelength,                
            }
        }
    }
})
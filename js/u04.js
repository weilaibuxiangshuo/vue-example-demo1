//双向数据绑定
var app=new Vue({
    el:'#vue-app',
    data:{
        name:"",
        age:"",
    },
    methods:{
        logname:function(){
            // console.log(this.$refs)
            // this.name=this.$refs.name.value

        },
        logage:function(){
            this.age=this.$refs.age.value
        }
    }
})
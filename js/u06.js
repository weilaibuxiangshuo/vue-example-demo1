//计算属性computed
//只有耗时或者进行大量操作的时候，才会使用计算属性，其它时候使用methods
var app=new Vue({
    el:'#vue-app',
    data:{
        age:20,
        a:0,
        b:0,
    },
    methods:{
/*         addtoa:function(){
            console.log("Add to A")
            return this.a+this.age
        },
        addtob:function(){
            console.log("Add to B")
            return this.b+this.age
        } */
    },
    computed:{
        addtoa:function(){
            console.log("Add to A")
            return this.a+this.age
        },
        addtob:function(){
            console.log("Add to B")
            return this.b+this.age
        }
    }
})
//实例化多vue对象
var one=new Vue({
    el:'#vue-app-one',
    data:{
        title:"app one内容"
    },
    methods:{
    },
    computed:{
        greet:function(){
            return 'hello app one'
        }
    }
})

var two=new Vue({
    el:'#vue-app-two',
    data:{
        title:"app two内容"
    },
    methods:{
        changetitle:function(){
            one.title="已经改名了"
        }
    },
    computed:{
        greet:function(){
            return 'hello app two'
        }
    }
})

two.title="最原先的变化"
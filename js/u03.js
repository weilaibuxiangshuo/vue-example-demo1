//属性绑定
var app=new Vue({
    el:'#vue-app',
    data:{
        age:30,
        x:0,
        y:0,
    },
    methods:{
        add:function(obj){
            this.age += obj
        },
        reduce:function(obj){
            this.age -= obj
        },
        updateXY:function(event){
            // console.log(event);
            this.x=event.offsetX;
            this.y=event.offsetY;
        },
        stopmouse:function(event){
            event.stopPropagation()
        },
        alert:function(){
            alert('hello world')
        }
    }
})
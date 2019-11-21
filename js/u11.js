//初识vue组件
Vue.component("greet",{
    template:`
    <p>大家好，我是{{name}}好人你信吗？
    <button v-on:click="changename">改名</button>
    </p>
    `,
    data:function(){
        return {
            name:"路函"
        }
    },
    methods:{
        changename:function(){
            this.name="Herry";
        },
        ceshi:function(){
            return "哈罗"
        }
    }
})

Vue.component("to-item",{
    props:['todo'],
    template:`<li>{{todo.id+1}}---{{ todo.text }}</li>`,    
})


new Vue({
    el:'#vue-app-one',
    data:{
        groceryList:[
            { id: 0, text: '蔬菜' },
            { id: 1, text: '奶酪' },
            { id: 2, text: '随便其它什么人吃的东西' }
        ]
    }
})

new Vue({
    el:'#vue-app-two',
})
//引入vue
import Vue from 'vue';
//引入vue-router
import VueRouter from 'vue-router';
//第三方库需要use一下才能用
Vue.use(VueRouter)
//引用page1页面
import blocks  from './blocks.vue';
import block  from './block.vue';

import transaction from './transaction.vue'
import addresses from './addresses.vue'
import overview from './overview.vue'
import send from './send.vue'
import receive from './receive.vue'
import mytransaction from './mytransaction.vue'
import issueassets from './issueassets.vue'
import myassets from './myassets.vue'
import sendassets from './sendassets.vue'
//定义routes路由的集合，数组类型
const routes=[
    //单个路由均为对象类型，path代表的是路径，component代表组件
    {path:'/overview/:walletname?',component:overview},
    {path:"/blocks/",component:blocks},
	{path:"/block",component:block},
    {path:"/send/:walletname?",component:send},
    {path:"/receive/:walletname?",component:receive},
    {path:"/transaction",component:transaction},
    {path:'/addresses/:walletname?',component: addresses},
    {path:'/mytransaction/',component: mytransaction},
    {path:'/issueassets/',component:issueassets},
    {path:'/myassets/',component: myassets},
    {path:'/sendassets/',component: sendassets},
    {path:'/',redirect:'blocks/'},

	//{path:"",component:blocks}
]

//实例化VueRouter并将routes添加进去
const router=new VueRouter({
//ES6简写，等于routes：routes
    routes
});

//抛出这个这个实例对象方便外部读取以及访问
export default router
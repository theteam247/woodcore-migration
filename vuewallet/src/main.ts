import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
import locale from '../node_modules/element-ui/lib/locale/lang/en'
import './main.css'
// @ts-ignore
import router from './router'
import {rpc,SERVICE_URL} from './config'
Vue.prototype.SERVICE_URL = SERVICE_URL;
Vue.prototype.rpc = rpc;
// @ts-ignore
import util from './util'

Vue.use(ElementUI,{locale})
Vue.use(util)
Vue.use(VueAxios, axios)

Vue.config.ignoredElements = ['ion-label','ion-chip','ion-list','ion-row','ion-icon','ion-item','ion-col','ion-grid','ion-note','transaction-details','transaction-list','block-summary','transaction-summary']

Vue.config.productionTip = false
// @ts-ignore
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 在请求接口之前，需要全局配置 axios 包
import axios from 'axios'
// 配置请求根路径/接口基准路径（在API接口文档中）
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 把 axios 包挂载到 Vue 的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

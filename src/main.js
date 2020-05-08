import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 在请求接口之前，需要全局配置 axios 包
import axios from 'axios'

// 配置请求根路径/接口基准路径（在API接口文档中）
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 这个 request 是个请求拦截器，通过 use 函数挂载一个回调函数
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})

// 把 axios包 挂载到 Vue 的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

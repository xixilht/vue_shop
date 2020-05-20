import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入 NProgress 进度条的包
import NProgress from 'nprogress'

// 在请求接口之前，需要全局配置 axios 包
import axios from 'axios'

// 配置请求根路径/接口基准路径（在API接口文档中）
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 这个 request 是个请求拦截器，通过 use 函数挂载一个回调函数
在 request 拦截器中，展示进度条 NProgress.start() */
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 把 axios包 挂载到 Vue 的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 在全局定义了一个格式化时间的过滤器，名字为 dataFormat，每个组件都可以调用它
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  /* 思路：月份不足两位时，在前面补个0，天数同理
  月数从0开始，需要加1，再加字符串空格，转换成字符串
  padStart(2, '0') ES6字符串新方法 - 填充，只有字符串能调用
  第一个参数，数值，代表字符串总长度为多少位，
  第二个参数，字符串，如果不足多少位，用哪个字符串来进行填充 */
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

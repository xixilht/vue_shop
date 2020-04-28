import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message 和其他组件不同，它需要全局挂载为 Vue 原型中的一个属性，这样每个 Vue 组件可通过 this 访问到 $message
// 这里的 $message 是自定义属性，可自己改名
Vue.prototype.$message = Message

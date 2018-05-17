import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import '@/assets/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

import nw from '@/mixins/nw'

import * as components from './components'
import * as directives from './directives'
import * as filters from './filters'

const isDebug = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug
Vue.config.devtools = isDebug
Vue.config.productionTip = isDebug

Vue.use(Element, { size: 'medium' })
Vue.use(components.Vuepro, {
  components,
  directives,
  filters
})
Vue.mixin(nw)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

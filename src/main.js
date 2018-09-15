// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'
import App from './App'
import router from './router'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import 'uikit/dist/css/uikit.min.css'
import store from './store'
import './assets/sass/main.sass'

Vue.config.productionTip = false

UIkit.use(Icons)

Vue.use(VueResource)
Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

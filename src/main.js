import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from './store'
import {routes} from './router/index.js'
import moment from 'moment'
import VueRouter from 'vue-router'

import { BootstrapVue } from 'bootstrap-vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import vSelect from "vue-select";

Vue.component("v-select", vSelect);
Vue.use(BootstrapVue)
Vue.use(moment)
Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
                                                                                                                                                                                                                                                                                                                                                                              
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import store from './vuex/user'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import BaiduMap from 'vue-baidu-map'
import {BmlMarkerClusterer} from 'vue-baidu-map'



Vue.config.productionTip = false;

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'wF6SqGwQcveLVmM3jtL8MIGxpaxb3obR'
});
Vue.component('bml-marker-cluster', BmlMarkerClusterer);
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  el        : '#app',
  router,
  store,
  components: {App},
  template  : '<App/>'
});

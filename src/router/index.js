import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home'
import login from '../views/login'
import reg from '../views/reg'
import profile from '../views/profile'
import plans from '../views/plans'
import plan from '../views/plan'
import store from "../vuex/user";

Vue.use(Router);

let routes = [
  {
    path     : '/',
    name     : '',
    component: home,
    meta     : {requiresAuth: true}
  },
  {
    path     : '/reg',
    name     : 'reg',
    component: reg,
    meta     : {requiresNotAuth: true}
  },
  {
    path     : '/login',
    name     : 'login',
    component: login,
    meta     : {requiresNotAuth: true}
  },
  {
    path     : '/home',
    name     : 'home',
    component: home,
    meta     : {requiresAuth: true}
  },
  {
    path     : '/profile',
    name     : 'profile',
    component: profile,
    meta     : {requiresAuth: true}
  },
  {
    path     : '/plans',
    name     : 'plans',
    component: plans,
    meta     : {requiresAuth: true}
  },
  {
    path     : '/plan',
    name     : 'plan',
    component: plan,
    meta     : {requiresAuth: true}
  },

];

const router = new Router({
  mode  : 'history',
  routes: routes
});

// 登录中间验证，页面需要登录,而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next({
          path: '/home'
        });
      }
    } else {
      if (store.getters.isLogin) {
        next();
      } else {
        next({
          path : '/login',
          query: {redirect: to.fullPath}
        });
      }
    }
  } else if (to.matched.some(record => record.meta.requiresNotAuth)) {
    if (store.getters.isLogin) {
      next({
        path: '/home'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

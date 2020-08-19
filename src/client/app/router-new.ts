/***********************
 * @desc use vue-router
 * @todo 原先的vitepress 并未加上vue-router 功能
 * @author Jo.gel
 * @date 2020/8/18 0018
 ***********************/
import { createRouter, createWebHistory } from 'vue-router'
// import theme from '/@theme/index'

export const routerNew = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('../theme-default/layouts/Layout.vue')
    },
    {
      name: 'NotFound',
      path: '/*',
      component: () => '404 Not Found'
    }
  ]
})

// todo import {router}  from 'vue-router'
// todo app.use(router)

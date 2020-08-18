/***********************
 * @desc use vue-router
 * @todo 原先的vitepress 并未加上vue-router 功能
 * @author Jo.gel
 * @date 2020/8/18 0018
 ***********************/
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  strict: true, //?
  routes: []
})

// todo import {router}  from 'vue-router'
// todo app.use(router)

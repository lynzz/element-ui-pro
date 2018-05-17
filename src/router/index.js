import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'

import navConfig from './nav.config'
const routes = []

const processRoutes = (data, parent) => {
  data.forEach(item => {
    const name = item.name
    if (name) {
      let prefix = parent ? `/${parent}` : ''
      item.path = `${prefix}/${name}`
      item.components = require(`../views${prefix}/${name}/${name}`)
      item.meta = item.meta || {}
      item.meta.title = item.label
      routes.push(item)
    }

    if (item.children) {
      processRoutes(item.children, item.groupName)
    }
  })
}

processRoutes(navConfig)

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'analysis'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ].concat(routes)
})

export default router

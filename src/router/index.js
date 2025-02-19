import { createRouter, createWebHistory } from 'vue-router'
import { isMobile } from '@/utils/device'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/m/admin',
    component: () => import('../views/mobile/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'orders'
      },
      {
        path: 'orders',
        name: 'MobileAdminOrders',
        component: () => import(/* webpackChunkName: "admin-orders" */ '@/views/mobile/admin/Orders.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'menu',
        name: 'MobileAdminMenu',
        component: () => import(/* webpackChunkName: "admin-menu" */ '@/views/mobile/admin/Menu.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'stats',
        name: 'MobileAdminStats',
        component: () => import(/* webpackChunkName: "admin-stats" */ '@/views/mobile/admin/Stats.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'withdraw',
        name: 'AdminWithdraw',
        component: () => import(/* webpackChunkName: "admin-withdraw" */ '@/views/mobile/admin/Withdraw.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'withdraw/history',
        name: 'AdminWithdrawHistory',
        component: () => import('../views/mobile/admin/WithdrawHistory.vue')
      },
      {
        path: 'order-history',
        component: () => import('@/views/mobile/admin/OrderHistory.vue'),
        meta: {
          title: '历史订单'
        }
      },
      {
        path: 'traffic',
        name: 'MobileTrafficMonitor',
        component: () => import('../views/mobile/admin/TrafficMonitor.vue'),
        meta: { keepAlive: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 需要登录但未登录，重定向到登录页
  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && token) {
    next('/m/admin/orders')
    return
  }

  next()
})

export default router 
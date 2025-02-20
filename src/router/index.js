import { createRouter, createWebHashHistory } from 'vue-router'
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
        path: 'profile',
        name: 'MobileAdminProfile',
        component: () => import(/* webpackChunkName: "admin-profile" */ '@/views/mobile/admin/Profile.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'profile/withdraw',
        name: 'AdminWithdraw',
        component: () => import(/* webpackChunkName: "admin-withdraw" */ '@/views/mobile/admin/Withdraw.vue'),
        meta: { title: '提现管理' }
      },
      {
        path: 'profile/withdraw/history',
        name: 'AdminWithdrawHistory',
        component: () => import('@/views/mobile/admin/WithdrawHistory.vue'),
        meta: { title: '提现记录' }
      },
      {
        path: 'profile/bank-accounts',
        name: 'AdminBankAccounts',
        component: () => import('@/views/mobile/admin/BankAccounts.vue'),
        meta: { title: '收款账户' }
      },
      {
        path: 'profile/security',
        name: 'AdminSecurity',
        component: () => import('@/views/mobile/admin/Security.vue'),
        meta: { title: '安全设置' }
      },
      {
        path: 'profile/notifications',
        name: 'AdminNotifications',
        component: () => import('@/views/mobile/admin/Notifications.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: 'profile/window',
        name: 'AdminWindow',
        component: () => import('@/views/mobile/admin/WindowManage.vue'),
        meta: { title: '窗口管理' }
      },
      {
        path: 'profile/business-time',
        name: 'AdminBusinessTime',
        component: () => import('@/views/mobile/admin/BusinessTime.vue'),
        meta: { title: '营业时间' }
      },
      {
        path: 'profile/printer',
        name: 'AdminPrinter',
        component: () => import('@/views/mobile/admin/PrinterSettings.vue'),
        meta: { title: '打印机设置' }
      },
      {
        path: 'profile/help',
        name: 'AdminHelp',
        component: () => import('@/views/mobile/admin/Help.vue'),
        meta: { title: '帮助中心' }
      },
      {
        path: 'profile/about',
        name: 'AdminAbout',
        component: () => import('@/views/mobile/admin/About.vue'),
        meta: { title: '关于我们' }
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
      },
      {
        path: 'reviews',
        name: 'MobileAdminReviews',
        component: () => import('@/views/mobile/admin/Reviews.vue'),
        meta: { 
          keepAlive: true,
          title: '评价管理'
        }
      },
      {
        path: 'reviews/reply/:id',
        name: 'review-reply',
        component: () => import('@/views/mobile/admin/ReviewReply.vue'),
        meta: {
          title: '回复评价'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  base: process.env.NODE_ENV === 'production'
    ? '/Smart-canteen-mobile/'
    : '/',
  routes
})

router.beforeEach(async (to, from, next) => {
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

  // 根路径重定向到登录页
  if (to.path === '/' && !token) {
    next('/login')
    return
  }

  next()
})

export default router 
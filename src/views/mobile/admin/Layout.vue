import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue'

<template>
  <div class="mobile-admin-layout">
    <!-- 页面内容区域 -->
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 底部导航栏 -->
    <div class="tabbar">
      <div 
        v-for="tab in tabs" 
        :key="tab.path"
        class="tab-item"
        :class="{ active: isActive(tab.path) }"
        @click="handleTabClick(tab.path)">
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.name }}</span>
        <el-badge 
          v-if="tab.path === '/m/admin/orders' && pendingOrders > 0"
          :value="pendingOrders" 
          class="order-badge" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onActivated, onDeactivated, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Document, Menu as MenuIcon, TrendCharts, Setting, SwitchButton, Money, Edit, Plus, Delete, Location, Timer, ChatDotSquare, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 处理订单数量
const pendingOrders = ref(0)

// 底部导航菜单
const tabs = [
  {
    name: '订单管理',
    path: '/m/admin/orders',
    icon: Document
  },
  {
    name: '菜单管理',
    path: '/m/admin/menu',
    icon: MenuIcon
  },
  {
    name: '评价管理',
    path: '/m/admin/reviews',
    icon: ChatDotSquare
  },
  {
    name: '营业统计',
    path: '/m/admin/stats',
    icon: TrendCharts
  },
  {
    name: '个人中心',
    path: '/m/admin/profile',
    icon: User
  }
]

// 判断当前激活的标签
const isActive = (path) => {
  return route.path === path
}

// 处理标签点击
const handleTabClick = (path) => {
  router.push(path)
}

// 获取待处理订单数量
const fetchPendingOrders = async () => {
  try {
    // TODO: 调用API获取待处理订单数量
    // const response = await api.getPendingOrdersCount()
    // pendingOrders.value = response.data
  } catch (error) {
    console.error('获取待处理订单数量失败', error)
  }
}

// 定时更新待处理订单数量
let timer = null
onMounted(() => {
  fetchPendingOrders()
  
  // 每30秒更新一次待处理订单数量
  timer = setInterval(fetchPendingOrders, 30000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 缓存页面状态
onActivated(() => {
  // 恢复页面状态
})

onDeactivated(() => {
  // 保存页面状态
})
</script>

<style scoped>
.mobile-admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  color: #2c3e50;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
}

.page-content > div {
  width: 100%;
  min-height: 100%;
  background: #f8f9fa;
}

.tabbar {
  height: 56px;
  display: flex;
  background: #fff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.02);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: rgba(0,0,0,0.65);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.tab-item.active {
  color: #e17b00;
  font-weight: 500;
}

.tab-item .el-icon {
  font-size: 24px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
}

.tab-item:active {
  opacity: 0.7;
}

.order-badge {
  position: absolute;
  top: 0;
  right: 22%;
  transform: translate(50%, -30%);
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  min-width: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tabbar {
    height: calc(56px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .page-content {
    padding-bottom: calc(76px + env(safe-area-inset-bottom));
  }
}
</style> 
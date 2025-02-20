<template>
  <div class="notifications-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">消息通知</span>
      <el-button class="read-all-button" link @click="handleReadAll">
        全部已读
      </el-button>
    </div>

    <!-- 消息类型切换 -->
    <div class="message-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.type"
        class="tab-item"
        :class="{ active: activeTab === tab.type }"
        @click="activeTab = tab.type">
        {{ tab.name }}
        <el-badge 
          v-if="tab.unread > 0" 
          :value="tab.unread" 
          class="tab-badge" />
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" v-if="filteredMessages.length > 0">
      <div 
        v-for="message in filteredMessages" 
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.isRead }"
        @click="handleReadMessage(message)">
        <div class="message-icon">
          <el-icon :class="message.type">
            <component :is="getMessageIcon(message.type)" />
          </el-icon>
        </div>
        <div class="message-content">
          <div class="message-title">{{ message.title }}</div>
          <div class="message-desc">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
        <div class="message-status" v-if="!message.isRead">
          <div class="unread-dot"></div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty 
      v-else 
      description="暂无消息" 
      :image-size="120">
    </el-empty>

    <!-- 消息详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentMessage?.title"
      width="90%"
      :close-on-click-modal="false"
      class="message-detail-dialog">
      <div class="message-detail">
        <div class="detail-time">{{ formatTime(currentMessage?.time) }}</div>
        <div class="detail-content">{{ currentMessage?.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  Bell,
  ShoppingCart,
  Money,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()

// 消息类型
const tabs = [
  { name: '全部', type: 'all', unread: 5 },
  { name: '订单', type: 'order', unread: 2 },
  { name: '系统', type: 'system', unread: 3 },
  { name: '活动', type: 'activity', unread: 0 }
]

const activeTab = ref('all')

// 消息列表数据
const messages = ref([
  {
    id: 1,
    type: 'order',
    title: '新订单通知',
    content: '您有一个新的订单待处理，订单号：2024032001',
    time: '2024-03-20 14:30:00',
    isRead: false
  },
  {
    id: 2,
    type: 'system',
    title: '系统维护通知',
    content: '系统将于今晚24:00-次日凌晨2:00进行例行维护，请提前做好准备。',
    time: '2024-03-20 10:00:00',
    isRead: false
  },
  {
    id: 3,
    type: 'activity',
    title: '活动提醒',
    content: '您的店铺已被选中参加本周末的美食节活动，请及时确认参与。',
    time: '2024-03-19 16:20:00',
    isRead: true
  },
  {
    id: 4,
    type: 'order',
    title: '退款申请',
    content: '订单2024031902申请退款，请及时处理。',
    time: '2024-03-19 15:30:00',
    isRead: false
  },
  {
    id: 5,
    type: 'system',
    title: '账户安全提醒',
    content: '检测到您的账户在新设备上登录，如非本人操作，请及时修改密码。',
    time: '2024-03-19 14:20:00',
    isRead: false
  }
])

// 根据类型筛选消息
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') {
    return messages.value
  }
  return messages.value.filter(msg => msg.type === activeTab.value)
})

// 当前查看的消息
const currentMessage = ref(null)
const detailVisible = ref(false)

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理全部已读
const handleReadAll = () => {
  messages.value.forEach(msg => {
    msg.isRead = true
  })
  updateUnreadCount()
  ElMessage.success('已全部标记为已读')
}

// 处理阅读消息
const handleReadMessage = (message) => {
  currentMessage.value = message
  detailVisible.value = true
  if (!message.isRead) {
    message.isRead = true
    updateUnreadCount()
  }
}

// 更新未读数量
const updateUnreadCount = () => {
  tabs.forEach(tab => {
    if (tab.type === 'all') {
      tab.unread = messages.value.filter(msg => !msg.isRead).length
    } else {
      tab.unread = messages.value.filter(msg => msg.type === tab.type && !msg.isRead).length
    }
  })
}

// 获取消息图标
const getMessageIcon = (type) => {
  const icons = {
    order: ShoppingCart,
    system: Warning,
    activity: Bell
  }
  return icons[type] || Bell
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const messageTime = dayjs(time)
  const now = dayjs()
  
  if (messageTime.isSame(now, 'day')) {
    return messageTime.format('HH:mm')
  } else if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天 ' + messageTime.format('HH:mm')
  } else if (messageTime.isSame(now, 'year')) {
    return messageTime.format('MM-DD HH:mm')
  } else {
    return messageTime.format('YYYY-MM-DD HH:mm')
  }
}
</script>

<style scoped>
.notifications-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.back-button {
  font-size: 20px;
  height: 44px;
  color: #2c3e50;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.read-all-button {
  font-size: 14px;
  color: #909399;
  position: absolute;
  right: 12px;
}

.message-tabs {
  background: #fff;
  padding: 12px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 44px;
  z-index: 10;
}

.tab-item {
  position: relative;
  padding: 8px 16px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item.active {
  color: #e17b00;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #e17b00;
  border-radius: 1px;
}

.tab-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.message-list {
  padding: 12px;
}

.message-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.message-item:active {
  opacity: 0.8;
}

.message-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-icon .el-icon {
  font-size: 20px;
}

.message-icon .order {
  color: #409EFF;
}

.message-icon .system {
  color: #E6A23C;
}

.message-icon .activity {
  color: #67C23A;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.message-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-time {
  font-size: 12px;
  color: #c0c4cc;
}

.message-status {
  padding-top: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #e17b00;
}

.message-detail-dialog :deep(.el-dialog__header) {
  padding-bottom: 12px;
  margin-bottom: 0;
  border-bottom: 1px solid #f0f0f0;
}

.message-detail-dialog :deep(.el-dialog__body) {
  padding-top: 16px;
}

.message-detail .detail-time {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.message-detail .detail-content {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.6;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

:deep(.el-badge__content) {
  transform: scale(0.8);
}
</style> 
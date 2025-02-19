<template>
  <div class="order-history">
    <!-- 顶部导航 -->
    <div class="page-header">
      <el-button link @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <span class="header-title">历史订单</span>
      <div style="width: 40px"></div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        :shortcuts="dateShortcuts"
        @change="handleDateChange"
      />
      <el-select
        v-model="filterStatus"
        placeholder="订单状态"
        size="small"
        clearable
        @change="handleFilter"
      >
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
    </div>

    <!-- 统计信息 -->
    <div class="stats-cards">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">¥{{ stats.totalRevenue }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">{{ stats.completionRate }}%</div>
            <div class="stat-label">完成率</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <div class="history-list">
      <div v-for="(group, date) in groupedOrders" :key="date" class="order-group">
        <div class="date-header">
          <span class="date-text">{{ formatDate(date) }}</span>
          <span class="order-count">{{ group.orders.length }}个订单</span>
        </div>

        <el-card 
          v-for="order in group.orders" 
          :key="order.id" 
          class="order-card"
          @click="showOrderDetail(order)">
          <div class="order-card-header">
            <div class="order-basic-info">
              <div class="order-info">
                <span class="order-no">订单号：{{ order.orderNo }}</span>
                <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
              </div>
              <div class="order-meta">
                <span class="order-time">{{ formatTime(order.createTime) }}</span>
                <span class="order-amount">¥{{ order.total }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="90%"
      class="detail-dialog">
      <div class="detail-content" v-if="selectedOrder">
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <div class="detail-item">
            <span class="label">订单号</span>
            <span class="value">{{ selectedOrder.orderNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">下单时间</span>
            <span class="value">{{ formatDateTime(selectedOrder.createTime) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">订单状态</span>
            <span class="value">
              <el-tag :type="getStatusType(selectedOrder.status)">
                {{ selectedOrder.status }}
              </el-tag>
            </span>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">菜品信息</div>
          <div class="order-items">
            <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
              <span class="item-price">¥{{ item.price }}</span>
            </div>
          </div>
          <div class="order-total">
            <span>总计</span>
            <span class="total-price">¥{{ selectedOrder.total }}</span>
          </div>
        </div>

        <div class="detail-section" v-if="selectedOrder.remark">
          <div class="section-title">备注</div>
          <div class="order-remark">{{ selectedOrder.remark }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const dateRange = ref([])
const filterStatus = ref('')
const detailVisible = ref(false)
const selectedOrder = ref(null)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  }
]

// 统计数据
const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  completionRate: 0
})

// 模拟历史订单数据
const orders = ref([
  {
    id: 1,
    orderNo: 'DD20240320001',
    status: '已完成',
    createTime: '2024-03-20 14:30:00',
    total: 35.5,
    items: [
      { id: 1, name: '红烧肉', quantity: 1, price: 15 },
      { id: 2, name: '米饭', quantity: 1, price: 2 }
    ],
    remark: '不要辣'
  },
  // ... 更多订单数据
])

// 按日期分组的订单
const groupedOrders = computed(() => {
  const filtered = orders.value.filter(order => {
    if (filterStatus.value && order.status !== filterStatus.value) return false
    if (dateRange.value && dateRange.value.length === 2) {
      const orderDate = dayjs(order.createTime)
      return orderDate.isAfter(dateRange.value[0]) && 
             orderDate.isBefore(dateRange.value[1])
    }
    return true
  })

  const groups = {}
  filtered.forEach(order => {
    const date = dayjs(order.createTime).format('YYYY-MM-DD')
    if (!groups[date]) {
      groups[date] = { orders: [] }
    }
    groups[date].orders.push(order)
  })
  return groups
})

// 格式化日期显示
const formatDate = (date) => {
  const today = dayjs().startOf('day')
  const orderDate = dayjs(date)
  
  if (orderDate.isSame(today, 'day')) {
    return '今天'
  } else if (orderDate.isSame(today.subtract(1, 'day'), 'day')) {
    return '昨天'
  }
  return orderDate.format('YYYY年MM月DD日')
}

const formatTime = (time) => {
  return dayjs(time).format('HH:mm:ss')
}

const formatDateTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const getStatusType = (status) => {
  const types = {
    '已完成': 'success',
    '已取消': 'info'
  }
  return types[status] || 'default'
}

// 处理日期变化
const handleDateChange = () => {
  updateStats()
  // TODO: 重新获取订单数据
}

// 处理筛选
const handleFilter = () => {
  updateStats()
  // TODO: 重新获取订单数据
}

// 显示订单详情
const showOrderDetail = (order) => {
  selectedOrder.value = order
  detailVisible.value = true
}

// 更新统计数据
const updateStats = () => {
  const filteredOrders = Object.values(groupedOrders.value)
    .flatMap(group => group.orders)
  
  stats.value = {
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
    completionRate: Math.round(filteredOrders.filter(o => o.status === '已完成').length / 
                   filteredOrders.length * 100) || 0
  }
}

// 初始化
updateStats()
</script>

<style scoped>
.order-history {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 44px;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.filter-toolbar {
  padding: 12px;
  background: #fff;
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats-cards {
  padding: 0 12px;
  margin-bottom: 12px;
}

.stat-card {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.history-list {
  padding: 12px;
}

.order-group {
  margin-bottom: 16px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  margin-bottom: 8px;
}

.date-text {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.order-count {
  font-size: 12px;
  color: #909399;
}

.order-card {
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-card:active {
  transform: scale(0.98);
}

.order-basic-info {
  width: 100%;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.order-no {
  font-size: 14px;
  color: #303133;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.order-amount {
  font-weight: 500;
  color: #f56c6c;
}

/* 详情弹窗样式 */
.detail-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item .label {
  color: #909399;
}

.order-items {
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-quantity {
  color: #909399;
  font-size: 13px;
}

.item-price {
  color: #f56c6c;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.total-price {
  font-size: 16px;
  font-weight: 500;
  color: #f56c6c;
}

.order-remark {
  color: #909399;
  font-size: 13px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style> 
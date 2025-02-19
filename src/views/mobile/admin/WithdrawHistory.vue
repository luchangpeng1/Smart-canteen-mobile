<template>
  <div class="withdraw-history-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <el-button link @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <span class="header-title">提现记录</span>
      <div style="width: 40px"></div><!-- 占位，保持标题居中 -->
    </div>

    <!-- 记录列表 -->
    <div class="history-list">
      <el-empty v-if="records.length === 0" description="暂无提现记录" />
      
      <div v-else class="record-items">
        <!-- 日期分组标题 -->
        <template v-for="(group, date) in groupedRecords" :key="date">
          <div class="date-divider">{{ date }}</div>
          
          <div 
            v-for="record in group" 
            :key="record.id" 
            class="record-item"
            @click="showRecordDetail(record)">
            <div class="record-main">
              <div class="record-info">
                <div class="record-amount">¥ {{ record.amount.toFixed(2) }}</div>
                <div class="record-status" :class="record.status">
                  {{ getStatusText(record.status) }}
                </div>
              </div>
              <div class="record-detail">
                <div class="record-account">{{ record.bankInfo }}</div>
                <div class="record-time">{{ formatTime(record.createTime) }}</div>
              </div>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </template>
      </div>
    </div>

    <!-- 记录详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="提现详情"
      width="90%"
      class="detail-dialog">
      <div class="detail-content" v-if="selectedRecord">
        <div class="detail-item">
          <span class="label">提现金额</span>
          <span class="value amount">¥ {{ selectedRecord.amount.toFixed(2) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">提现状态</span>
          <span class="value status" :class="selectedRecord.status">
            {{ getStatusText(selectedRecord.status) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">提现账户</span>
          <span class="value">{{ selectedRecord.bankInfo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间</span>
          <span class="value">{{ formatDateTime(selectedRecord.createTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">预计到账</span>
          <span class="value">1-3个工作日</span>
        </div>
        <div class="detail-item" v-if="selectedRecord.status === 'failed'">
          <span class="label">失败原因</span>
          <span class="value error">{{ selectedRecord.failReason || '未知原因' }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()

// 模拟数据
const records = ref([
  {
    id: 1,
    amount: 1000,
    status: 'success',
    bankInfo: '工商银行 (8888)',
    createTime: '2024-03-20 14:30:00'
  },
  {
    id: 2,
    amount: 2000,
    status: 'pending',
    bankInfo: '支付宝 (8888)',
    createTime: '2024-03-20 16:20:00'
  },
  {
    id: 3,
    amount: 500,
    status: 'failed',
    bankInfo: '微信 (8888)',
    createTime: '2024-03-19 09:15:00',
    failReason: '银行卡信息有误'
  }
])

// 按日期分组的记录
const groupedRecords = computed(() => {
  const groups = {}
  records.value.forEach(record => {
    const date = dayjs(record.createTime).format('YYYY-MM-DD')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
  })
  return groups
})

// 状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    success: '提现成功',
    pending: '处理中',
    failed: '提现失败'
  }
  return statusMap[status] || status
}

// 格式化时间
const formatTime = (date) => {
  return dayjs(date).format('HH:mm')
}

const formatDateTime = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 记录详情相关
const detailVisible = ref(false)
const selectedRecord = ref(null)

const showRecordDetail = (record) => {
  selectedRecord.value = record
  detailVisible.value = true
}
</script>

<style scoped>
.withdraw-history-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 44px;
  margin: -15px;
}

.page-header {
  position: fixed;
  top: 80px;
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

.history-list {
  padding: 8px;
  padding-top: 52px;
}

.date-divider {
  font-size: 13px;
  color: #909399;
  padding: 6px 8px;
  margin-top: 4px;
}

.record-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.record-item:active {
  background-color: #f5f7fa;
}

.record-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.el-empty) {
  padding: 32px 0;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .history-list {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }
}

.record-main {
  flex: 1;
}

.record-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.record-amount {
  font-size: 16px;
  font-weight: 500;
}

.record-status {
  font-size: 14px;
}

.record-status.success {
  color: #67c23a;
}

.record-status.pending {
  color: #e6a23c;
}

.record-status.failed {
  color: #f56c6c;
}

.record-detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

/* 详情弹窗样式 */
.detail-content {
  padding: 8px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: #909399;
  font-size: 14px;
}

.detail-item .value {
  font-size: 14px;
  color: #303133;
}

.detail-item .value.amount {
  font-size: 20px;
  font-weight: 500;
  color: #303133;
}

.detail-item .value.error {
  color: #f56c6c;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

/* 优化返回按钮样式 */
:deep(.el-button.is-link) {
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

:deep(.el-button.is-link .el-icon) {
  margin-right: 2px;
}
</style> 
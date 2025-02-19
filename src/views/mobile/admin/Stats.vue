<template>
  <div class="mobile-stats">
    <div class="page-header">
      <h2>营业统计</h2>
      <el-date-picker
        v-model="selectedDate"
        type="date"
        :size="'small'"
        :placeholder="'选择日期'"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :disabled-date="disableFutureDate"
        @change="handleDateChange"
      />
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-card v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
          <div class="stat-trend" :class="{ 'up': stat.trend > 0, 'down': stat.trend < 0 }">
            <el-icon><component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
            {{ Math.abs(stat.trend) }}%
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <el-card class="chart-card">
      <template #header>
        <div class="chart-header">
          <span>营业趋势</span>
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button :value="'week'">周</el-radio-button>
            <el-radio-button :value="'month'">月</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="trendChart" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const timeRange = ref('week')
const trendChart = ref(null)
let chartInstance = null

const selectedDate = ref(new Date().toISOString().split('T')[0])
const stats = ref([])

const disableFutureDate = (date) => {
  return date > new Date()
}

const handleDateChange = async (date) => {
  if (!date) {
    date = new Date().toISOString().split('T')[0]
  }
  await fetchStatsData(date)
}

const fetchStatsData = async (date) => {
  try {
    const mockData = {
      revenue: Math.floor(Math.random() * 10000),
      orders: Math.floor(Math.random() * 200),
      customers: Math.floor(Math.random() * 1500),
      averageOrder: Math.floor(Math.random() * 100)
    }

    stats.value = [
      {
        title: `${date === selectedDate.value ? '今日' : ''}营业额`,
        value: `¥${mockData.revenue.toFixed(2)}`,
        trend: 12.5
      },
      {
        title: `${date === selectedDate.value ? '今日' : ''}订单数`,
        value: mockData.orders.toString(),
        trend: 8.2
      },
      {
        title: `${date === selectedDate.value ? '今日' : ''}客流量`,
        value: mockData.customers.toString(),
        trend: -3.5
      },
      {
        title: '平均客单价',
        value: `¥${mockData.averageOrder.toFixed(2)}`,
        trend: 5.8
      }
    ]
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initChart = () => {
  if (!trendChart.value) return
  
  chartInstance = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ]
  }
  
  chartInstance.setOption(option)
}

onMounted(async () => {
  await fetchStatsData(selectedDate.value)
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

<style scoped>
.mobile-stats {
  padding: 12px;
  background-color: #f5f7fa;
  min-height: 100vh;
  margin-top: -15px;
}

.page-header {
  margin: 8px 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 20px;
  margin: 0;
  color: #303133;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 0 -8px 20px;
  padding: 0 8px;
}

.stat-card {
  border-radius: 12px;
  overflow: hidden;
}

.stat-card :deep(.el-card__body) {
  padding: 12px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.stat-trend {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

.stat-trend.up {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.stat-trend.down {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.chart-card {
  border-radius: 12px;
  margin: 0 -8px;
}

.chart-card :deep(.el-card__header) {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.chart {
  height: 260px;
  padding: 8px 0;
}

:deep(.el-date-picker) {
  width: 140px;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
}
</style> 
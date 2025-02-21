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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const timeRange = ref('week')
const trendChart = ref(null)
let chartInstance = null

const selectedDate = ref(new Date().toISOString().split('T')[0])
const stats = ref([])

const disableFutureDate = (date) => {
  return date > new Date()
}

// 获取周期范围内的日期数组
const getDateRange = computed(() => {
  const currentDate = new Date(selectedDate.value)
  if (timeRange.value === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // 从周一开始
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  } else {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }
})

// 模拟获取每日营业数据
const getDailyRevenue = (date) => {
  // 这里应该替换为实际的API调用
  return {
    revenue: Math.floor(Math.random() * 10000),
    orders: Math.floor(Math.random() * 200),
    customers: Math.floor(Math.random() * 1500),
    averageOrder: Math.floor(Math.random() * 100)
  }
}

const handleDateChange = async (date) => {
  if (!date) {
    date = new Date().toISOString().split('T')[0]
  }
  selectedDate.value = date
  await fetchStatsData(date)
  updateChart()
}

const fetchStatsData = async (date) => {
  try {
    const currentData = getDailyRevenue(new Date(date))
    const prevData = getDailyRevenue(subDays(new Date(date), 1))
    
    // 计算周期总收入
    const periodRevenue = getDateRange.value.reduce((total, date) => {
      return total + getDailyRevenue(date).revenue
    }, 0)
    
    // 计算环比增长
    const prevPeriodRevenue = getDateRange.value.reduce((total, date) => {
      return total + getDailyRevenue(subDays(date, 7)).revenue
    }, 0)
    
    const periodTrend = ((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue * 100).toFixed(1)

    stats.value = [
      {
        title: '今日营业额',
        value: `¥${currentData.revenue.toFixed(2)}`,
        trend: ((currentData.revenue - prevData.revenue) / prevData.revenue * 100).toFixed(1)
      },
      {
        title: '今日订单数',
        value: currentData.orders.toString(),
        trend: ((currentData.orders - prevData.orders) / prevData.orders * 100).toFixed(1)
      },
      {
        title: timeRange.value === 'week' ? '本周营业额' : '本月营业额',
        value: `¥${periodRevenue.toFixed(2)}`,
        trend: Number(periodTrend)
      },
      {
        title: '平均客单价',
        value: `¥${currentData.averageOrder.toFixed(2)}`,
        trend: ((currentData.averageOrder - prevData.averageOrder) / prevData.averageOrder * 100).toFixed(1)
      }
    ]
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const updateChart = () => {
  if (!trendChart.value) return
  
  const dates = getDateRange.value
  const data = dates.map(date => getDailyRevenue(date).revenue)
  const labels = dates.map(date => 
    timeRange.value === 'week' 
      ? format(date, 'EEE', { locale: zhCN }) 
      : format(date, 'd日')
  )
  
  chartInstance = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const [param] = params
        return `${format(dates[param.dataIndex], 'yyyy-MM-dd')}<br/>
                营业额: ¥${param.value.toFixed(2)}`
      }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: {
          color: '#e5e6eb'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#86909c'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#e5e6eb',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#86909c',
        formatter: (value) => `¥${value}`
      }
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#165DFF'
        },
        lineStyle: {
          width: 3,
          color: '#165DFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(22,93,255,0.15)'
            }, {
              offset: 1,
              color: 'rgba(22,93,255,0.01)'
            }]
          }
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

// 监听时间范围变化
watch(timeRange, () => {
  updateChart()
})

onMounted(async () => {
  await fetchStatsData(selectedDate.value)
  updateChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

<style scoped>
.mobile-stats {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
  margin-top: -15px;
}

.page-header {
  margin: 0 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: #1d2129;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.stat-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 13px;
  color: #86909c;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 500;
  color: #1d2129;
  line-height: 1.2;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: normal;
  transition: all 0.3s ease;
  width: fit-content;
}

.stat-trend.up {
  background-color: #e8f7ed;
  color: #00b578;
}

.stat-trend.down {
  background-color: #ffece8;
  color: #ff4d4f;
}

.stat-trend :deep(.el-icon) {
  margin-right: 2px;
  font-size: 12px;
}

.chart-card {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: none;
  margin-top: 8px;
}

.chart-card :deep(.el-card__header) {
  padding: 14px 16px;
  border-bottom: 1px solid #f2f3f5;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header span {
  font-size: 15px;
  font-weight: 500;
  color: #1d2129;
}

.chart {
  height: 280px;
  padding: 12px 0;
}

:deep(.el-date-picker) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  height: 32px;
}

:deep(.el-input__inner) {
  font-size: 13px;
  color: #4e5969;
}

:deep(.el-radio-group) {
  background: #f2f3f5;
  padding: 2px;
  border-radius: 6px;
}

:deep(.el-radio-button__inner) {
  border: none !important;
  background: transparent;
  box-shadow: none !important;
  height: 28px;
  line-height: 28px;
  padding: 0 12px;
  font-size: 13px;
  color: #4e5969;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #fff;
  color: #1d2129;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 4px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 4px;
}

@media (max-width: 375px) {
  .mobile-stats {
    padding: 12px;
  }
  
  .stat-cards {
    gap: 8px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
</style> 
<template>
  <div class="mobile-traffic-monitor">
    <el-card class="traffic-card">
      <template #header>
        <div class="card-header">
          <span>实时客流量</span>
          <el-button type="primary" link @click="refreshData">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </template>

      <!-- 客流量列表 -->
      <div class="traffic-list">
        <div 
          v-for="item in trafficData" 
          :key="item.id"
          class="traffic-item">
          <el-card 
            :body-style="{ padding: '10px' }"
            :class="['status-card', getCrowdLevel(item).class]">
            <h4>{{ item.canteenName }}</h4>
            <div class="status">
              <el-progress
                :percentage="Math.round(item.currentCount / item.capacity * 100)"
                :status="getCrowdLevel(item).status"
              />
              <span class="count">{{ item.currentCount }}/{{ item.capacity }}</span>
            </div>
            <div class="level-tag">
              <el-tag :type="getCrowdLevel(item).type" size="small">
                {{ getCrowdLevel(item).label }}
              </el-tag>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>

    <!-- 趋势图表 -->
    <el-card class="chart-card">
      <div class="chart-container" ref="chartRef"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import http from '@/utils/request'
import { ElMessage } from 'element-plus'

const chartRef = ref(null)
const chart = ref(null)

// 复用 PC 端的数据和方法
const trafficData = ref([
  {
    id: 1,
    canteenName: '第一食堂',
    currentCount: 150,
    capacity: 300,
    updateTime: new Date()
  },
  {
    id: 2,
    canteenName: '第二食堂',
    currentCount: 280,
    capacity: 400,
    updateTime: new Date()
  }
])

// 获取拥挤程度
const getCrowdLevel = (item) => {
  const ratio = item.currentCount / item.capacity
  if (ratio < 0.5) {
    return {
      type: 'success',
      label: '空闲',
      status: 'success',
      class: 'status-free'
    }
  } else if (ratio < 0.8) {
    return {
      type: 'warning',
      label: '较忙',
      status: 'warning',
      class: 'status-busy'
    }
  } else {
    return {
      type: 'danger',
      label: '拥挤',
      status: 'exception',
      class: 'status-crowded'
    }
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart.value = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '今日客流量趋势',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10
      }
    },
    series: trafficData.value.map(item => ({
      name: item.canteenName,
      type: 'line',
      smooth: true,
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * item.capacity))
    }))
  }
  
  chart.value.setOption(option)
}

// 刷新数据
const refreshData = async () => {
  try {
    // 实际项目中应该调用后端 API
    // const response = await http.get('/api/traffic/current')
    // trafficData.value = response.data
    
    // 模拟数据更新
    trafficData.value = trafficData.value.map(item => ({
      ...item,
      currentCount: Math.floor(Math.random() * item.capacity),
      updateTime: new Date()
    }))
    
    // 更新图表
    initChart()
    ElMessage.success('数据已更新')
  } catch (error) {
    console.error('刷新数据失败:', error)
    ElMessage.error('刷新数据失败')
  }
}

// 自动刷新定时器
let refreshTimer = null

onMounted(() => {
  initChart()
  // 每5分钟自动刷新一次
  refreshTimer = setInterval(refreshData, 5 * 60 * 1000)
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart.value?.resize()
  })
})

onUnmounted(() => {
  clearInterval(refreshTimer)
  chart.value?.dispose()
  window.removeEventListener('resize', () => {
    chart.value?.resize()
  })
})
</script>

<style scoped>
.mobile-traffic-monitor {
  padding: 10px;
}

.traffic-card {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.traffic-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.traffic-item {
  margin-bottom: 10px;
}

.status-card {
  transition: all 0.3s ease;
}

.status-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.status {
  margin: 10px 0;
}

.count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.level-tag {
  text-align: right;
}

.chart-card {
  margin-top: 15px;
}

.chart-container {
  height: 300px;
}

/* 状态卡片样式 */
.status-free {
  border-left: 4px solid var(--el-color-success);
}

.status-busy {
  border-left: 4px solid var(--el-color-warning);
}

.status-crowded {
  border-left: 4px solid var(--el-color-danger);
}
</style> 
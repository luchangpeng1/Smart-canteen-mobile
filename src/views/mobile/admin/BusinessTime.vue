<template>
  <div class="business-time-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">营业时间</span>
    </div>

    <div class="time-settings">
      <!-- 营业状态开关 -->
      <div class="status-card">
        <div class="status-info">
          <div class="status-title">营业状态</div>
          <div class="status-desc">{{ businessStatus ? '营业中' : '已打烊' }}</div>
        </div>
        <el-switch
          v-model="businessStatus"
          active-text="营业"
          inactive-text="打烊"
          @change="handleStatusChange"
          class="status-switch"
          :style="{
            '--el-switch-on-color': '#07c160',
            '--el-switch-off-color': 'rgba(0,0,0,0.25)'
          }"
        />
      </div>

      <!-- 时间段设置 -->
      <div class="time-periods-card">
        <div class="card-header">
          <div class="card-title">营业时间段</div>
          <el-button 
            type="primary" 
            link 
            :disabled="timePeriods.length >= 3"
            @click="addPeriod">
            <el-icon><Plus /></el-icon>
            添加时间段
          </el-button>
        </div>

        <div class="periods-list">
          <div 
            v-for="(period, index) in timePeriods" 
            :key="index"
            class="period-item">
            <div class="period-time">
              <el-time-picker
                v-model="period.startTime"
                format="HH:mm"
                placeholder="开始时间"
                :disabled="!businessStatus"
                @change="validatePeriods"
              />
              <span class="time-separator">至</span>
              <el-time-picker
                v-model="period.endTime"
                format="HH:mm"
                placeholder="结束时间"
                :disabled="!businessStatus"
                @change="validatePeriods"
              />
            </div>
            <el-button 
              v-if="timePeriods.length > 1"
              type="danger" 
              circle
              :disabled="!businessStatus"
              @click="removePeriod(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="period-tips">
          <el-alert
            title="提示"
            type="info"
            :closable="false"
            show-icon>
            <template #default>
              <p>1. 最多可添加3个营业时间段</p>
              <p>2. 时间段之间不能重叠</p>
              <p>3. 修改后需点击保存才能生效</p>
            </template>
          </el-alert>
        </div>
      </div>

      <!-- 自动营业设置 -->
      <div class="auto-business-card">
        <div class="card-header">
          <div class="card-title">自动营业</div>
          <el-switch
            v-model="autoBusinessEnabled"
            @change="handleAutoBusinessChange"
          />
        </div>
        <div class="card-desc">
          开启后，系统将按照设置的营业时间自动开启/关闭营业状态
        </div>
      </div>
    </div>

    <div class="action-bar">
      <el-button 
        type="primary" 
        class="save-button"
        :loading="loading"
        @click="handleSave">
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()

// 营业状态
const businessStatus = ref(true)
const autoBusinessEnabled = ref(false)
const loading = ref(false)

// 时间段数据
const timePeriods = ref([
  {
    startTime: new Date(2000, 0, 1, 10, 30),
    endTime: new Date(2000, 0, 1, 13, 30)
  }
])

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理营业状态切换
const handleStatusChange = async (value) => {
  try {
    await ElMessageBox.confirm(
      `确定要${value ? '开始营业' : '打烊'}吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: value ? 'success' : 'warning'
      }
    )
    
    // TODO: 调用API更新营业状态
    ElMessage.success(`已${value ? '开始营业' : '打烊'}`)
  } catch {
    // 取消操作，回滚状态
    businessStatus.value = !value
  }
}

// 处理自动营业设置
const handleAutoBusinessChange = (value) => {
  if (value) {
    ElMessage.warning('请确保已设置正确的营业时间段')
  }
}

// 添加时间段
const addPeriod = () => {
  if (timePeriods.value.length >= 3) {
    ElMessage.warning('最多只能添加3个时间段')
    return
  }
  
  timePeriods.value.push({
    startTime: new Date(2000, 0, 1, 10, 0),
    endTime: new Date(2000, 0, 1, 22, 0)
  })
}

// 删除时间段
const removePeriod = (index) => {
  timePeriods.value.splice(index, 1)
}

// 验证时间段
const validatePeriods = () => {
  const periods = timePeriods.value
  
  // 检查每个时间段
  for (const period of periods) {
    if (!period.startTime || !period.endTime) {
      ElMessage.warning('请填写完整的营业时间')
      return false
    }
    
    if (period.endTime <= period.startTime) {
      ElMessage.warning('结束时间必须晚于开始时间')
      return false
    }
  }
  
  // 检查时间段重叠
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      if (
        (periods[i].startTime <= periods[j].endTime && periods[i].endTime >= periods[j].startTime) ||
        (periods[j].startTime <= periods[i].endTime && periods[j].endTime >= periods[i].startTime)
      ) {
        ElMessage.warning('营业时间段不能重叠')
        return false
      }
    }
  }
  
  return true
}

// 保存设置
const handleSave = async () => {
  if (!validatePeriods()) return
  
  try {
    loading.value = true
    
    // 格式化时间段
    const formattedPeriods = timePeriods.value.map(period => ({
      startTime: `${period.startTime.getHours().toString().padStart(2, '0')}:${period.startTime.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${period.endTime.getHours().toString().padStart(2, '0')}:${period.endTime.getMinutes().toString().padStart(2, '0')}`
    }))
    
    // TODO: 调用API保存设置
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('设置已保存')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.business-time-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: calc(76px + env(safe-area-inset-bottom));
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

.time-settings {
  padding: 12px;
}

.status-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.status-desc {
  font-size: 13px;
  color: #909399;
}

.time-periods-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.periods-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.period-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-time {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-separator {
  color: #909399;
  flex-shrink: 0;
}

:deep(.el-time-picker) {
  flex: 1;
  min-width: 0;
}

:deep(.el-time-picker .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.period-tips {
  margin-top: 16px;
}

.period-tips :deep(.el-alert__title) {
  font-size: 14px;
  font-weight: 500;
}

.period-tips p {
  margin: 4px 0;
  font-size: 13px;
  color: #909399;
}

.auto-business-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.card-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -1px 2px rgba(0,0,0,0.05);
  z-index: 100;
}

.save-button {
  width: 100%;
}

:deep(.el-switch__label) {
  color: rgba(0,0,0,0.65);
  font-size: 12px;
}

:deep(.el-switch__label.is-active) {
  color: #e17b00;
}
</style> 
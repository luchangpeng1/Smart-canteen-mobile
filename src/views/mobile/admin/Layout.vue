import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue'

<template>
  <div class="mobile-admin-layout">
    <!-- 顶部导航栏，只在订单管理页面显示 -->
    <div class="header" v-if="isOrdersPage">
      <div class="window-info">
        <!-- 餐厅位置信息和营业时间 -->
        <div class="header-top">
          <div class="location-info clickable" @click="handleEditLocation">
            <el-icon><Location /></el-icon>
            <span class="canteen-name">{{ windowInfo.canteen.name }}</span>
            <el-divider direction="vertical" />
            <span class="floor-info">{{ windowInfo.floor }}层</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
          <div class="operation-time clickable" @click="handleEditTime">
            <el-icon><Timer /></el-icon>
            <span>{{ windowInfo.operatingHours }}</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
        </div>
        
        <!-- 窗口名称和状态 -->
        <div class="header-bottom">
          <span class="window-name clickable" @click="handleEditName">
            {{ windowInfo.name }}
            <el-icon class="edit-icon"><Edit /></el-icon>
          </span>
          <div class="status-controls">
            <el-tag size="small" :type="windowInfo.status === 'open' ? 'success' : 'danger'">
              {{ windowInfo.status === 'open' ? '营业中' : '已打烊' }}
            </el-tag>
            <el-switch
              v-model="windowStatus"
              active-text="营业"
              inactive-text="打烊"
              @change="handleStatusChange"
              class="status-switch"
              :style="{
                '--el-switch-on-color': '#07c160',
                '--el-switch-off-color': 'rgba(0,0,0,0.25)'
              }"
            />
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button size="small" type="primary" plain>
                <el-icon><Setting /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="editWindow">
                    <el-icon><Edit /></el-icon>编辑窗口
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面内容区域 -->
    <div class="page-content" :class="{ 'has-header': isOrdersPage }">
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

    <!-- 窗口编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑窗口信息"
      width="90%"
      class="window-edit-dialog"
      :close-on-click-modal="false">
      <el-form :model="editForm" label-width="4.5em" class="window-edit-form">
        <el-form-item label="图片">
          <el-upload
            class="window-image-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleImageSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="window-image" />
            <div v-else class="upload-placeholder">
              <el-icon class="window-uploader-icon"><Plus /></el-icon>
              <span>点击上传图片</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="餐厅">
          <el-select 
            v-model="editForm.canteenId" 
            placeholder="请选择餐厅"
            class="full-width-input">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select
            v-model="editForm.floor"
            placeholder="请选择楼层"
            class="full-width-input"
            :disabled="!editForm.canteenId">
            <el-option
              v-for="floor in availableFloors"
              :key="floor"
              :label="`${floor}层`"
              :value="floor"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input 
            v-model="editForm.name"
            class="full-width-input"
            placeholder="请输入窗口名称" />
        </el-form-item>
        <el-form-item label="时间">
          <div class="time-periods-container">
            <div 
              v-for="(period, index) in editForm.operatingPeriods" 
              :key="index" 
              class="time-period">
              <div class="time-pickers">
                <el-time-picker
                  v-model="period.startTime"
                  format="HH:mm"
                  placeholder="开始时间"
                  :clearable="false"
                  class="time-picker"
                />
                <span class="time-separator">至</span>
                <el-time-picker
                  v-model="period.endTime"
                  format="HH:mm"
                  placeholder="结束时间"
                  :clearable="false"
                  class="time-picker"
                />
              </div>
              <el-button 
                v-if="editForm.operatingPeriods.length > 1"
                type="danger" 
                circle 
                size="small"
                class="delete-time-btn"
                @click="removePeriod(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button 
              v-if="editForm.operatingPeriods.length < 3"
              type="primary" 
              link
              size="small"
              class="add-time-btn"
              @click="addPeriod">
              <el-icon><Plus /></el-icon>添加时间段
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveWindow">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onActivated, onDeactivated, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Document, Menu as MenuIcon, TrendCharts, Setting, SwitchButton, Money, Edit, Plus, Delete, Location, Timer } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 窗口信息
const windowInfo = ref({
  name: '大荤窗口',
  status: 'open',
  canteen: {
    id: 1,
    name: '中央食堂'
  },
  floor: 1,
  operatingHours: '10:30-13:30, 16:30-19:00',
  type: '大荤窗口'
})

const windowStatus = ref(windowInfo.value.status === 'open')

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
    name: '营业统计',
    path: '/m/admin/stats',
    icon: TrendCharts
  },
  {
    name: '提现管理',
    path: '/m/admin/withdraw',
    icon: Money
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

// 处理窗口营业状态切换
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
    
    // TODO: 调用API更新窗口状态
    windowInfo.value.status = value ? 'open' : 'closed'
    ElMessage.success(`已${value ? '开始营业' : '打烊'}`)
  } catch {
    // 取消操作，回滚状态
    windowStatus.value = !value
  }
}

// 获取窗口信息
const fetchWindowInfo = async () => {
  try {
    // TODO: 调用API获取窗口信息
    // const response = await api.getWindowInfo()
    // windowInfo.value = response.data
  } catch (error) {
    ElMessage.error('获取窗口信息失败')
  }
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
  fetchWindowInfo()
  fetchPendingOrders()
  
  // 每30秒更新一次待处理订单数量
  timer = setInterval(fetchPendingOrders, 30000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  if (command === 'editWindow') {
    editDialogVisible.value = true
    // 解析当前的营业时间字符串为时间段数组
    const periods = windowInfo.value.operatingHours.split(',').map(period => {
      const [start, end] = period.trim().split('-')
      const [startHour, startMinute] = start.split(':').map(Number)
      const [endHour, endMinute] = end.split(':').map(Number)
      
      return {
        startTime: new Date(2000, 0, 1, startHour, startMinute),
        endTime: new Date(2000, 0, 1, endHour, endMinute)
      }
    })
    
    editForm.value = {
      canteenId: windowInfo.value.canteen.id,
      floor: windowInfo.value.floor,
      name: windowInfo.value.name,
      image: windowInfo.value.image,
      address: windowInfo.value.address,
      operatingPeriods: periods
    }
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 清除登录信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 跳转到登录页
      router.push('/login')
      ElMessage.success('已退出登录')
    } catch {
      // 用户取消退出
    }
  }
}

// 缓存页面状态
onActivated(() => {
  // 恢复页面状态
})

onDeactivated(() => {
  // 保存页面状态
})

// 添加窗口编辑对话框的数据
const editDialogVisible = ref(false)
const editForm = ref({
  canteenId: '',
  floor: '',
  name: '',
  image: '',
  address: '',
  operatingPeriods: [
    { 
      startTime: new Date(2000, 0, 1, 10, 30),
      endTime: new Date(2000, 0, 1, 13, 30)
    }
  ]
})

// 添加窗口图片上传相关
const imageUrl = ref('')
const handleImageSuccess = (response) => {
  imageUrl.value = response.url
  editForm.value.image = response.url
}

// 添加时间验证方法
const validateTimes = () => {
  const periods = editForm.value.operatingPeriods
  
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

// 添加保存窗口信息的方法
const handleSaveWindow = async () => {
  if (!validateTimes()) {
    return
  }
  
  try {
    // 格式化营业时间
    const operatingHours = editForm.value.operatingPeriods
      .map(period => {
        const startTime = `${period.startTime.getHours().toString().padStart(2, '0')}:${period.startTime.getMinutes().toString().padStart(2, '0')}`
        const endTime = `${period.endTime.getHours().toString().padStart(2, '0')}:${period.endTime.getMinutes().toString().padStart(2, '0')}`
        return `${startTime}-${endTime}`
      })
      .join(', ')
    
    const updateData = {
      ...editForm.value,
      operatingHours
    }
    
    // TODO: 调用API保存窗口信息
    // await api.updateWindowInfo(updateData)
    
    ElMessage.success('窗口信息更新成功')
    editDialogVisible.value = false
    await fetchWindowInfo() // 重新获取窗口信息
  } catch (error) {
    ElMessage.error('更新窗口信息失败')
  }
}

// 添加时间段
const addPeriod = () => {
  editForm.value.operatingPeriods.push({
    startTime: new Date(2000, 0, 1, 10, 0),
    endTime: new Date(2000, 0, 1, 22, 0)
  })
}

// 删除时间段
const removePeriod = (index) => {
  editForm.value.operatingPeriods.splice(index, 1)
}

// 在 script setup 中添加餐厅和楼层的数据
const canteens = [
  { id: '1', name: '中央食堂', floors: 3 },
  { id: '2', name: '沁园餐厅', floors: 2 },
  { id: '3', name: '馨园餐厅', floors: 1 },
  { id: '4', name: '仲园餐厅', floors: 3 },
  { id: '5', name: '雅园餐厅', floors: 1 },
  { id: '6', name: 'F区服务点', floors: 1 },
  { id: '7', name: 'A区服务点', floors: 1 }
]

// 计算当前选中餐厅的楼层数组
const availableFloors = computed(() => {
  const selectedCanteen = canteens.find(c => c.id === editForm.value.canteenId)
  if (!selectedCanteen) return []
  return Array.from({ length: selectedCanteen.floors }, (_, i) => i + 1)
})

// 监听餐厅变化，重置楼层选择
watch(() => editForm.value.canteenId, (newVal) => {
  const selectedCanteen = canteens.find(c => c.id === newVal)
  if (selectedCanteen && editForm.value.floor > selectedCanteen.floors) {
    editForm.value.floor = 1
  }
})

// 判断是否为订单管理页面
const isOrdersPage = computed(() => {
  return route.path === '/m/admin/orders'
})

// 添加编辑处理函数
const handleEditLocation = () => {
  editDialogVisible.value = true
  // 使用 nextTick 确保对话框完全打开后再聚焦
  nextTick(() => {
    // 这里可以添加逻辑来聚焦餐厅选择框
    const canteenSelect = document.querySelector('.window-edit-form .el-select')
    if (canteenSelect) {
      canteenSelect.click()
    }
  })
}

const handleEditName = () => {
  editDialogVisible.value = true
  nextTick(() => {
    // 聚焦名称输入框
    const nameInput = document.querySelector('.window-edit-form input[placeholder="请输入窗口名称"]')
    if (nameInput) {
      nameInput.focus()
    }
  })
}

const handleEditTime = () => {
  editDialogVisible.value = true
  nextTick(() => {
    // 滚动到时间选择区域
    const timeSection = document.querySelector('.time-periods-container')
    if (timeSection) {
      timeSection.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
</script>

<style scoped>
.mobile-admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  color: #2c3e50;
}

.header {
  min-height: 56px; /* 减小高度 */
  padding: 12px 16px; /* 减小内边距 */
  background: linear-gradient(135deg, #ffd000, #ffbb00);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px; /* 减小间距 */
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info {
  font-size: 12px; /* 减小字体 */
  padding: 4px 10px; /* 减小内边距 */
  display: flex;
  align-items: center;
  color: rgba(0,0,0,0.85);
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.location-info .el-icon {
  margin-right: 4px;
  font-size: 14px;
  color: #e17b00;
}

.canteen-name {
  font-weight: 600;
  color: rgba(0,0,0,0.9);
}

.window-name {
  font-size: 18px; /* 稍微减小字体 */
  padding: 2px 8px; /* 减小内边距 */
  font-weight: 600;
  color: rgba(0,0,0,0.95);
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(255,255,255,0.2);
  border-radius: 8px;
}

.operation-time {
  font-size: 12px; /* 减小字体 */
  padding: 4px 10px; /* 减小内边距 */
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(0,0,0,0.85);
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  width: fit-content;
}

.operation-time .el-icon {
  color: #e17b00;
}

/* Remove nested structure and keep only the flattened selectors */
.status-switch :deep(.el-switch__label) {
  color: rgba(0,0,0,0.65);
  font-size: 12px;
}

.status-switch :deep(.el-switch__label.is-active) {
  color: #e17b00;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
  margin-top: 64px;
}

.page-content.has-header {
  padding-top: 80px;
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
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.actions :deep(.el-button) {
  background: rgba(255,255,255,0.95);
  border: none;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}

.actions :deep(.el-switch) {
  --el-switch-on-color: #07c160;
  --el-switch-off-color: rgba(0,0,0,0.25);
}

.window-image-uploader {
  border: 1px dashed rgba(0,0,0,0.15);
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  transition: all 0.3s ease;
}

.window-image-uploader:hover {
  border-color: #ffa600;
  background: #fffbf0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(0,0,0,0.45);
  transition: transform 0.2s ease;
}

.window-image-uploader:hover .upload-placeholder {
  transform: scale(1.05);
  color: #e17b00;
}

.window-uploader-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.window-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.window-image:hover {
  transform: scale(1.02);
}

.full-width-input {
  width: 100%;
}

.time-periods-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-period {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.time-period:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.time-pickers {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-picker {
  flex: 1;
  min-width: 0;
}

.time-picker :deep(.el-input__wrapper) {
  background: #f8f9fa;
}

.time-separator {
  color: rgba(0,0,0,0.65);
  flex-shrink: 0;
  font-weight: 500;
}

.delete-time-btn {
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.delete-time-btn:hover {
  transform: scale(1.1);
  color: #ff4d4f;
}

.add-time-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #e17b00;
}

.add-time-btn:hover {
  background: #fff7e6;
  color: #d17100;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

@media screen and (max-width: 480px) {
  .window-edit-dialog :deep(.el-dialog) {
    width: 92% !important;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .window-edit-dialog :deep(.el-dialog__header) {
    padding: 20px 20px 12px;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .window-edit-dialog :deep(.el-dialog__title) {
    font-weight: 600;
    font-size: 16px;
  }
  
  .time-period {
    flex-direction: column;
    align-items: stretch;
  }
  
  .delete-time-btn {
    align-self: flex-end;
  }
  
  .time-pickers {
    flex-wrap: wrap;
  }
  
  .time-picker {
    width: calc(50% - 4px);
  }
  
  .time-separator {
    width: 100%;
    text-align: center;
    margin: 8px 0;
    opacity: 0.7;
  }
}

.window-edit-dialog :deep(.el-dialog__body) {
  padding: 24px 20px;
}

.window-edit-form {
  margin: 0;
}

/* 全局组件样式优化 */
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background: #e17b00;
  border-color: #e17b00;
  color: #fff;
}

:deep(.el-button--primary:hover) {
  background: #d17100;
  border-color: #d17100;
  color: #fff;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-time-picker) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.15) inset;
}

:deep(.el-input__inner) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  color: #606266;
  background-color: #f5f7fa;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: #e17b00;
}

:deep(.el-input-number__decrease.is-disabled),
:deep(.el-input-number__increase.is-disabled) {
  color: #c0c4cc;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select:hover),
:deep(.el-time-picker:hover) {
  box-shadow: 0 0 0 1px #e17b00 inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select.is-focus),
:deep(.el-time-picker.is-focus) {
  box-shadow: 0 0 0 1px #e17b00 inset !important;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border: none;
  font-weight: 500;
}

:deep(.el-tag--success) {
  background: #f6ffed;
  color: #389e0d;
}

:deep(.el-tag--danger) {
  background: #fff1f0;
  color: #cf1322;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}

:deep(.el-select-dropdown__item) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.el-select-dropdown__item.selected) {
  color: #e17b00;
  font-weight: 600;
}

:deep(.el-input-number__input) {
  color: #2c3e50;
  font-weight: 500;
  text-align: center;
}

:deep(.el-dialog__title) {
  color: #1a1a1a;
  font-weight: 600;
}

:deep(.el-message-box__title) {
  color: #1a1a1a;
  font-weight: 600;
}

:deep(.el-message-box__content) {
  color: #2c3e50;
  font-weight: 500;
}

/* 滚动条美化 */
.page-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-track {
  background: transparent;
}

.clickable {
  cursor: pointer;
  position: relative;
  padding-right: 24px;
  transition: all 0.2s ease;
}

.clickable:hover {
  background: rgba(255, 255, 255, 0.2);
}

.edit-icon {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.clickable:hover .edit-icon {
  opacity: 0.7;
}

.status-switch :deep(.el-switch__label) {
  color: rgba(0,0,0,0.65);
  font-size: 12px;
}

.status-switch :deep(.el-switch__label.is-active) {
  color: #e17b00;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
}

:deep(.el-dropdown-menu__item:hover) {
  color: #e17b00;
  background: #fff7e6;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 4px;
  font-size: 16px;
}
</style> 
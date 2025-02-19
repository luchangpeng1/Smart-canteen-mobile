import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

<template>
  <div class="mobile-admin-layout">
    <!-- 顶部导航栏，只在订单管理页面显示 -->
    <div class="header" v-if="isOrdersPage">
      <div class="window-info">
        <div class="location-info">
          <span class="canteen-name">{{ windowInfo.canteen.name }}</span>
          <el-divider direction="vertical" />
          <span class="floor-info">{{ windowInfo.floor }}层</span>
        </div>
        <div class="window-detail">
          <span class="window-name">{{ windowInfo.name }}</span>
          <span class="operation-time">{{ windowInfo.operatingHours }}</span>
        </div>
        <el-tag size="small" :type="windowInfo.status === 'open' ? 'success' : 'danger'">
          {{ windowInfo.status === 'open' ? '营业中' : '已打烊' }}
        </el-tag>
      </div>
      <div class="actions">
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
        <el-switch
          v-model="windowStatus"
          active-text="营业"
          inactive-text="打烊"
          @change="handleStatusChange"
        />
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
import { ref, computed, onMounted, onUnmounted, onActivated, onDeactivated, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Document, Menu as MenuIcon, TrendCharts, Setting, SwitchButton, Money, Edit, Plus, Delete } from '@element-plus/icons-vue'

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

// 添��窗口图片上传相关
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
</script>

<style scoped>
.mobile-admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.header {
  height: auto;
  min-height: 60px;
  padding: 10px 15px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.location-info .el-divider {
  margin: 0 8px;
  height: 12px;
}

.canteen-name {
  font-weight: 500;
}

.window-detail {
  display: flex;
  align-items: center;
  gap: 8px;
}

.window-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.operation-time {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
  margin-top: 60px;
}

/* 当页面有顶部导航栏时添加上边距 */
.page-content.has-header {
  padding-top: 80px;
}

.tabbar {
  height: 50px;
  display: flex;
  background: #fff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.1);
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
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #409EFF;
}

.tab-item .el-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.order-badge {
  position: absolute;
  top: 0;
  right: 20%;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 适配 iPhone 底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tabbar {
    height: calc(50px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .page-content {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown {
  margin-right: 8px;
}

.window-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}

.window-image-uploader:hover {
  border-color: #409EFF;
  background: #f5f7fa;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #909399;
}

.window-uploader-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.window-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  gap: 8px;
  background: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
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

.time-separator {
  color: #909399;
  flex-shrink: 0;
}

.delete-time-btn {
  flex-shrink: 0;
}

.add-time-btn {
  align-self: flex-start;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

@media screen and (max-width: 480px) {
  .window-edit-dialog :deep(.el-dialog) {
    width: 92% !important;
    margin: 0 auto;
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
  }
}

.window-edit-dialog :deep(.el-dialog__body) {
  padding: 20px 16px;
}

.window-edit-form {
  margin: 0;
}
</style> 
<template>
  <div class="profile-container">
    <!-- 头部信息卡片 -->
    <div class="profile-header">
      <div class="merchant-info">
        <el-avatar :size="64" :src="merchantInfo.avatar" class="merchant-avatar">
          {{ merchantInfo.name?.[0]?.toUpperCase() }}
        </el-avatar>
        <div class="merchant-detail">
          <div class="merchant-name">{{ merchantInfo.name }}</div>
          <div class="merchant-id">商家ID: {{ merchantInfo.id }}</div>
        </div>
        <el-button class="edit-profile-btn" type="primary" link @click="handleEditProfile">
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
      
      <!-- 收入概览卡片 -->
      <div class="income-overview">
        <div class="overview-item">
          <div class="item-value">¥{{ merchantInfo.balance.toFixed(2) }}</div>
          <div class="item-label">账户余额</div>
        </div>
        <div class="overview-item">
          <div class="item-value">¥{{ merchantInfo.todayIncome.toFixed(2) }}</div>
          <div class="item-label">今日收入</div>
        </div>
        <div class="overview-item">
          <div class="item-value">¥{{ merchantInfo.monthIncome.toFixed(2) }}</div>
          <div class="item-label">本月收入</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="feature-section">
      <div class="section-title">账户管理</div>
      <div class="feature-grid">
        <div class="feature-item" @click="handleWithdraw">
          <el-icon><Money /></el-icon>
          <span>提现管理</span>
        </div>
        <div class="feature-item" @click="handleBankAccounts">
          <el-icon><CreditCard /></el-icon>
          <span>收款账户</span>
        </div>
        <div class="feature-item" @click="handleSecurity">
          <el-icon><Lock /></el-icon>
          <span>安全设置</span>
        </div>
        <div class="feature-item" @click="handleNotifications">
          <el-icon><Bell /></el-icon>
          <span>消息通知</span>
          <el-badge v-if="unreadCount > 0" :value="unreadCount" class="notification-badge" />
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="section-title">商家服务</div>
      <div class="feature-list">
        <div class="list-item" @click="handleWindowManage">
          <div class="item-left">
            <el-icon><Shop /></el-icon>
            <span>窗口管理</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="handleBusinessTime">
          <div class="item-left">
            <el-icon><Timer /></el-icon>
            <span>营业时间</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="handlePrinterSettings">
          <div class="item-left">
            <el-icon><Printer /></el-icon>
            <span>打印机设置</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="section-title">其他服务</div>
      <div class="feature-list">
        <div class="list-item" @click="handleHelp">
          <div class="item-left">
            <el-icon><QuestionFilled /></el-icon>
            <span>帮助中心</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="handleAbout">
          <div class="item-left">
            <el-icon><InfoFilled /></el-icon>
            <span>关于我们</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <el-button class="logout-button" type="danger" plain @click="handleLogout">退出登录</el-button>

    <!-- 编辑个人信息对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人信息"
      width="90%"
      :close-on-click-modal="false">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-position="top">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <div v-else class="avatar-placeholder">
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <span>点击上传头像</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="商家简介" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入商家简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSaveProfile"
            :loading="loading">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Edit,
  Money,
  CreditCard,
  Lock,
  Bell,
  Shop,
  Timer,
  Printer,
  QuestionFilled,
  InfoFilled,
  ArrowRight,
  Plus
} from '@element-plus/icons-vue'

const router = useRouter()

// 商家信息
const merchantInfo = ref({
  id: 'M88888888',
  name: '大荤窗口',
  avatar: '',
  balance: 1234.56,
  todayIncome: 356.80,
  monthIncome: 12345.67,
  phone: '13800138000',
  description: '主营各类炒菜、炖菜，提供美味可口的大荤菜品。'
})

const unreadCount = ref(2)
const editDialogVisible = ref(false)
const loading = ref(false)
const editFormRef = ref(null)

// 编辑表单
const editForm = reactive({
  avatar: '',
  name: '',
  phone: '',
  description: ''
})

// 表单校验规则
const editRules = {
  name: [
    { required: true, message: '请输入商家名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 处理各种点击事件
const handleEditProfile = () => {
  editDialogVisible.value = true
  editForm.avatar = merchantInfo.value.avatar
  editForm.name = merchantInfo.value.name
  editForm.phone = merchantInfo.value.phone
  editForm.description = merchantInfo.value.description
}

const handleWithdraw = () => {
  router.push('/m/admin/profile/withdraw')
}

const handleBankAccounts = () => {
  router.push('/m/admin/profile/bank-accounts')
}

const handleSecurity = () => {
  router.push('/m/admin/profile/security')
}

const handleNotifications = () => {
  router.push('/m/admin/profile/notifications')
}

const handleWindowManage = () => {
  router.push('/m/admin/profile/window')
}

const handleBusinessTime = () => {
  router.push('/m/admin/profile/business-time')
}

const handlePrinterSettings = () => {
  router.push('/m/admin/profile/printer')
}

const handleHelp = () => {
  router.push('/m/admin/profile/help')
}

const handleAbout = () => {
  router.push('/m/admin/profile/about')
}

const handleLogout = async () => {
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

// 头像上传相关方法
const handleAvatarSuccess = (response) => {
  editForm.avatar = response.url
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 保存个人信息
const handleSaveProfile = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    loading.value = true
    
    // TODO: 调用API保存个人信息
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 更新本地数据
    merchantInfo.value = {
      ...merchantInfo.value,
      avatar: editForm.avatar,
      name: editForm.name,
      phone: editForm.phone,
      description: editForm.description
    }
    
    ElMessage.success('个人信息更新成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('更新个人信息失败：', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 16px;
  padding-bottom: calc(76px + env(safe-area-inset-bottom));
}

.profile-header {
  background: linear-gradient(135deg, #ffd000, #ffbb00);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.merchant-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.merchant-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: #fff;
  color: #e17b00;
  font-weight: 600;
}

.merchant-detail {
  margin-left: 16px;
  flex: 1;
}

.merchant-name {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
}

.merchant-id {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.edit-profile-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: rgba(0, 0, 0, 0.7);
}

.income-overview {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.item-value {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
}

.item-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.feature-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.feature-grid {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
}

.feature-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.feature-item:active {
  background: #f5f7fa;
}

.feature-item .el-icon {
  font-size: 22px;
  color: #e17b00;
}

.feature-item span {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 16px;
}

.feature-list {
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-left .el-icon {
  font-size: 18px;
  color: #e17b00;
}

.item-left span {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.arrow-icon {
  color: rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

.list-item:active .arrow-icon {
  transform: translateX(4px);
}

.logout-button {
  width: 100%;
  margin-top: 24px;
  --el-button-hover-bg-color: #fff1f0;
  --el-button-hover-border-color: #ff4d4f;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .profile-container {
    padding-bottom: calc(92px + env(safe-area-inset-bottom));
  }
}

/* 头像上传样式 */
.avatar-uploader {
  border: 1px dashed rgba(0,0,0,0.15);
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  transition: all 0.3s ease;
}

.avatar-uploader:hover {
  border-color: #ffa600;
  background: #fffbf0;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(0,0,0,0.45);
  transition: transform 0.2s ease;
}

.avatar-uploader:hover .avatar-placeholder {
  transform: scale(1.05);
  color: #e17b00;
}

.avatar-uploader-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.02);
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 12px;
  margin: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 16px;
}

:deep(.el-dialog__body) {
  padding: 24px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 
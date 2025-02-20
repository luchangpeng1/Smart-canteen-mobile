<template>
  <div class="security-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">安全设置</span>
    </div>

    <div class="security-list">
      <!-- 登录密码 -->
      <div class="security-item" @click="handleModifyPassword">
        <div class="item-left">
          <el-icon class="item-icon"><Lock /></el-icon>
          <div class="item-info">
            <div class="item-title">登录密码</div>
            <div class="item-desc">建议定期更换密码，提高账号安全性</div>
          </div>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>

      <!-- 支付密码 -->
      <div class="security-item" @click="handleModifyPayPassword">
        <div class="item-left">
          <el-icon class="item-icon"><Key /></el-icon>
          <div class="item-info">
            <div class="item-title">支付密码</div>
            <div class="item-desc">用于提现等资金操作，请妥善保管</div>
          </div>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>

      <!-- 手机号码 -->
      <div class="security-item" @click="handleModifyPhone">
        <div class="item-left">
          <el-icon class="item-icon"><Iphone /></el-icon>
          <div class="item-info">
            <div class="item-title">手机号码</div>
            <div class="item-desc">已绑定：{{ maskPhone(userInfo.phone) }}</div>
          </div>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>

      <!-- 实名认证 -->
      <div class="security-item" @click="handleVerifyIdentity">
        <div class="item-left">
          <el-icon class="item-icon"><UserFilled /></el-icon>
          <div class="item-info">
            <div class="item-title">实名认证</div>
            <div class="item-desc">{{ userInfo.isVerified ? '已认证' : '未认证' }}</div>
          </div>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      :title="passwordDialogTitle"
      width="90%"
      :close-on-click-modal="false">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="top">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handlePasswordSubmit"
            :loading="loading">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改手机号对话框 -->
    <el-dialog
      v-model="phoneDialogVisible"
      title="修改手机号"
      width="90%"
      :close-on-click-modal="false">
      <el-form
        ref="phoneFormRef"
        :model="phoneForm"
        :rules="phoneRules"
        label-position="top">
        <el-form-item label="新手机号" prop="phone">
          <el-input
            v-model="phoneForm.phone"
            placeholder="请输入新手机号">
            <template #append>
              <el-button 
                type="primary" 
                :disabled="!!countdown"
                @click="handleSendCode">
                {{ countdown ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="phoneForm.code"
            placeholder="请输入验证码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handlePhoneSubmit"
            :loading="loading">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Key,
  Iphone,
  UserFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const userInfo = reactive({
  phone: '13888888888',
  isVerified: true
})

// 密码相关
const passwordDialogVisible = ref(false)
const passwordDialogTitle = ref('')
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码' },
    { min: 6, message: '密码长度不能小于6位' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { min: 6, message: '密码长度不能小于6位' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 手机号相关
const phoneDialogVisible = ref(false)
const phoneFormRef = ref(null)
const phoneForm = reactive({
  phone: '',
  code: ''
})

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
  ],
  code: [
    { required: true, message: '请输入验证码' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
  ]
}

const loading = ref(false)
const countdown = ref(0)
let timer = null

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理修改登录密码
const handleModifyPassword = () => {
  passwordDialogTitle.value = '修改登录密码'
  passwordDialogVisible.value = true
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 处理修改支付密码
const handleModifyPayPassword = () => {
  passwordDialogTitle.value = '修改支付密码'
  passwordDialogVisible.value = true
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 处理修改手机号
const handleModifyPhone = () => {
  phoneDialogVisible.value = true
  if (phoneFormRef.value) {
    phoneFormRef.value.resetFields()
  }
}

// 处理实名认证
const handleVerifyIdentity = () => {
  if (userInfo.isVerified) {
    ElMessage.info('您已完成实名认证')
    return
  }
  router.push('/m/admin/profile/verify')
}

// 处理密码修改提交
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    passwordDialogVisible.value = false
  } catch (error) {
    console.error('密码修改失败：', error)
  } finally {
    loading.value = false
  }
}

// 处理发送验证码
const handleSendCode = async () => {
  try {
    await phoneFormRef.value.validateField('phone')
    
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
  } catch (error) {
    console.error('发送验证码失败：', error)
  }
}

// 处理手机号修改提交
const handlePhoneSubmit = async () => {
  if (!phoneFormRef.value) return
  
  try {
    await phoneFormRef.value.validate()
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userInfo.phone = phoneForm.phone
    ElMessage.success('手机号修改成功')
    phoneDialogVisible.value = false
  } catch (error) {
    console.error('手机号修改失败：', error)
  } finally {
    loading.value = false
  }
}

// 手机号脱敏处理
const maskPhone = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
</script>

<style scoped>
.security-container {
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

.security-list {
  padding: 12px;
}

.security-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.security-item:active {
  opacity: 0.8;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 24px;
  color: #e17b00;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.item-desc {
  font-size: 13px;
  color: #909399;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 16px;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append .el-button) {
  margin: 0;
  border: none;
  height: 32px;
  padding: 0 12px;
}
</style> 
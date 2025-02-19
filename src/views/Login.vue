<template>
  <div class="mobile-login">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 顶部 Logo 区域 -->
    <div class="login-header">
      <div class="logo-wrapper">
        <img src="@/assets/images/logo.png" alt="智慧食堂" class="school-logo">
      </div>
      <h2 class="title">智慧食堂管理系统</h2>
      <p class="subtitle">窗口工作人员端</p>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="账号密码登录" name="account">
          <el-form ref="accountFormRef" :model="accountForm" :rules="accountRules">
            <el-form-item prop="workId">
              <el-input 
                v-model="accountForm.workId"
                placeholder="请输入工号"
                :prefix-icon="User"
                class="custom-input">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="accountForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                class="custom-input">
              </el-input>
            </el-form-item>
          </el-form>
          <el-button 
            type="primary" 
            class="submit-btn"
            :loading="loading"
            @click="handleAccountLogin">
            登录
          </el-button>
          <div class="test-account">
            <el-button 
              link 
              type="info" 
              class="test-btn"
              @click="useTestAccount">
              <el-icon><Warning /></el-icon>
              使用测试账号
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="手机号登录" name="phone">
          <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules">
            <el-form-item prop="phone">
              <el-input 
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
                :prefix-icon="Phone"
                class="custom-input">
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input">
                <el-input 
                  v-model="phoneForm.code"
                  placeholder="请输入验证码"
                  :prefix-icon="Message"
                  class="custom-input">
                </el-input>
                <el-button 
                  type="primary" 
                  :disabled="!!countdown"
                  @click="sendCode"
                  class="code-btn">
                  {{ countdown ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-button 
            type="primary" 
            class="submit-btn"
            :loading="loading"
            @click="handlePhoneLogin">
            登录
          </el-button>
        </el-tab-pane>

        <el-tab-pane label="微信扫码登录" name="wechat">
          <div class="qrcode-container">
            <div class="qrcode-wrapper">
              <img :src="qrCodeUrl" alt="微信扫码" class="qrcode">
            </div>
            <p class="qrcode-tip">请使用微信扫描二维码登录</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部操作区 -->
    <div class="login-footer">
      <el-button link class="footer-btn" @click="showResetDialog">忘记密码</el-button>
    </div>

    <!-- 注册对话框 -->
    <el-dialog
      v-model="registerVisible"
      title="注册账号"
      width="90%"
      :show-close="false"
      class="register-dialog">
      <el-form 
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top">
        <el-form-item label="手机号" prop="phone">
          <div class="code-input">
            <el-input 
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone">
            </el-input>
            <el-button 
              type="primary" 
              :disabled="!!registerCountdown"
              @click="sendRegisterCode">
              {{ registerCountdown ? `${registerCountdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input 
            v-model="registerForm.code"
            placeholder="请输入验证码"
            :prefix-icon="Message">
          </el-input>
        </el-form-item>
        <el-form-item label="工号" prop="workId">
          <el-input 
            v-model="registerForm.workId"
            placeholder="请输入工号"
            :prefix-icon="User">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input 
            v-model="registerForm.name"
            placeholder="请输入姓名"
            :prefix-icon="User">
          </el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input 
            v-model="registerForm.password"
            type="password"
            placeholder="请设置登录密码"
            :prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="registerVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="registerLoading"
            @click="handleRegister">
            注册
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetVisible"
      title="重置密码"
      width="90%"
      :show-close="false"
      class="reset-dialog">
      <el-form 
        ref="resetFormRef"
        :model="resetForm"
        :rules="resetRules"
        label-position="top">
        <el-form-item label="手机号" prop="phone">
          <div class="code-input">
            <el-input 
              v-model="resetForm.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone">
            </el-input>
            <el-button 
              type="primary" 
              :disabled="!!resetCountdown"
              @click="sendResetCode">
              {{ resetCountdown ? `${resetCountdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input 
            v-model="resetForm.code"
            placeholder="请输入验证码"
            :prefix-icon="Message">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input 
            v-model="resetForm.password"
            type="password"
            placeholder="请设置新密码"
            :prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="resetForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="resetLoading"
            @click="handleReset">
            重置密码
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import '@/assets/mobile.css'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Message, Warning } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('account')
const loading = ref(false)

// 账号密码登录表单
const accountFormRef = ref(null)
const accountForm = reactive({
  workId: '',
  password: ''
})

const accountRules = {
  workId: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^\d{8}$/, message: '工号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 手机号登录表单
const phoneFormRef = ref(null)
const phoneForm = reactive({
  phone: '',
  code: ''
})

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
  ]
}

// 倒计时
const countdown = ref(0)
let timer = null

// 发送验证码
const sendCode = async () => {
  try {
    await phoneFormRef.value.validateField('phone')
    
    // TODO: 调用发送验证码接口
    
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

// 测试账号信息
const testAccount = {
  workId: '22005801',
  password: '123456'
}

// 账号密码登录
const handleAccountLogin = async () => {
  if (!accountFormRef.value) return
  
  try {
    await accountFormRef.value.validate()
    loading.value = true
    
    // 测试账号登录逻辑
    if (accountForm.workId === testAccount.workId && 
        accountForm.password === testAccount.password) {
      // 模拟登录成功
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({
        workId: testAccount.workId,
        name: '测试账号',
        role: 'window_admin'
      }))
      
      ElMessage.success('登录成功')
      router.push('/m/admin/orders')
      return
    }
    
    // TODO: 调用实际的登录接口
    ElMessage.error('账号或密码错误')
    
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 手机号登录
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return
  
  try {
    await phoneFormRef.value.validate()
    loading.value = true
    
    // TODO: 调用登录接口
    
    ElMessage.success('登录成功')
    router.push('/m/admin/orders')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 微信扫码登录
const qrCodeUrl = ref('https://example.com/qrcode.png')

// 注册相关
const registerVisible = ref(false)
const registerLoading = ref(false)
const registerFormRef = ref(null)
const registerForm = reactive({
  phone: '',
  code: '',
  workId: '',
  name: '',
  password: '',
  confirmPassword: ''
})

const registerRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
  ],
  workId: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^\d{8}$/, message: '工号格式不正确', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const registerCountdown = ref(0)
let registerTimer = null

const sendRegisterCode = async () => {
  try {
    await registerFormRef.value.validateField('phone')
    
    // TODO: 调用发送验证码接口
    
    registerCountdown.value = 60
    registerTimer = setInterval(() => {
      registerCountdown.value--
      if (registerCountdown.value <= 0) {
        clearInterval(registerTimer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

const showRegisterDialog = () => {
  registerVisible.value = true
  if (registerFormRef.value) {
    registerFormRef.value.resetFields()
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true
    
    // TODO: 调用注册接口
    
    ElMessage.success('注册成功')
    registerVisible.value = false
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    registerLoading.value = false
  }
}

// 重置密码相关
const resetVisible = ref(false)
const resetLoading = ref(false)
const resetFormRef = ref(null)
const resetForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const resetRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const resetCountdown = ref(0)
let resetTimer = null

const sendResetCode = async () => {
  try {
    await resetFormRef.value.validateField('phone')
    
    // TODO: 调用发送验证码接口
    
    resetCountdown.value = 60
    resetTimer = setInterval(() => {
      resetCountdown.value--
      if (resetCountdown.value <= 0) {
        clearInterval(resetTimer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

const showResetDialog = () => {
  resetVisible.value = true
  if (resetFormRef.value) {
    resetFormRef.value.resetFields()
  }
}

const handleReset = async () => {
  if (!resetFormRef.value) return
  
  try {
    await resetFormRef.value.validate()
    resetLoading.value = true
    
    // TODO: 调用重置密码接口
    
    ElMessage.success('密码重置成功')
    resetVisible.value = false
  } catch (error) {
    console.error('重置密码失败:', error)
  } finally {
    resetLoading.value = false
  }
}

// 使用测试账号
const useTestAccount = () => {
  accountForm.workId = testAccount.workId
  accountForm.password = testAccount.password
  ElMessage({
    message: '已填入测试账号，点击登录按钮即可登录',
    type: 'info'
  })
}
</script>

<style scoped>
.mobile-login {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #36D1DC);
  opacity: 0.1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation: float 8s ease-in-out infinite;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: -30px;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  padding-top: 20px;
}

.logo-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: #fff;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.school-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px;
  font-weight: 600;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  color: #606266;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
  color: #409EFF;
}

.custom-input :deep(.el-input__wrapper) {
  background: #f5f7fa;
  border: none;
  border-radius: 12px;
  padding: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover),
.custom-input :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 1px #409EFF;
}

.submit-btn {
  width: 100%;
  margin-top: 30px;
  height: 44px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(45deg, #409EFF, #36D1DC);
  border: none;
  transition: transform 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.login-footer {
  margin-top: 30px;
  position: relative;
  z-index: 1;
}

.footer-btn {
  color: #909399;
  font-size: 14px;
  transition: color 0.3s ease;
  padding: 0;
}

.footer-btn:hover {
  color: #409EFF;
}

/* 适配 iPhone 安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-login {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
}

/* 登录方式标签页样式优化 */
:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  font-size: 14px;
  padding: 0 10px;
}

/* 验证码输入框组样式 */
.code-input {
  display: flex;
  gap: 8px;
}

.code-input .el-input {
  flex: 1;
}

.code-btn {
  width: 100px;
  padding: 0;
  font-size: 12px;
  border-radius: 8px;
}

/* 二维码容器样式 */
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.qrcode-wrapper {
  width: 200px;
  height: 200px;
  padding: 10px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.qrcode-wrapper:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.qrcode {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qrcode-tip {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

/* 移动端优化 */
@media screen and (max-width: 480px) {
  .logo-wrapper {
    width: 100px;
    height: 100px;
    padding: 14px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .qrcode-wrapper {
    width: 180px;
    height: 180px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 13px;
  }
  
  .code-btn {
    width: 90px;
    font-size: 11px;
  }
}

.test-account {
  margin-top: 16px;
  text-align: center;
}

.test-btn {
  color: #909399;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.test-btn:hover {
  color: #409EFF;
}

.test-btn .el-icon {
  font-size: 16px;
}
</style>
<template>
  <div class="bank-accounts-container">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">收款账户</span>
      <el-button class="add-button" link @click="handleAdd">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- 账户列表 -->
    <div class="accounts-list" v-if="accounts.length > 0">
      <div v-for="account in accounts" :key="account.id" class="account-item">
        <div class="account-info">
          <img :src="account.icon" :alt="account.bank" class="bank-icon">
          <div class="account-detail">
            <div class="bank-name">{{ account.bank }}</div>
            <div class="account-number">{{ account.accountNumber }}</div>
          </div>
        </div>
        <div class="account-actions">
          <el-tag 
            v-if="account.isDefault" 
            size="small" 
            type="success"
            class="default-tag">
            默认
          </el-tag>
          <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, account)">
            <el-button type="primary" link>
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-if="!account.isDefault"
                  command="setDefault">
                  设为默认
                </el-dropdown-item>
                <el-dropdown-item command="delete" class="danger">
                  删除账户
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty 
      v-else 
      description="暂无绑定账户" 
      :image-size="120">
      <el-button type="primary" @click="handleAdd">添加账户</el-button>
    </el-empty>

    <!-- 添加账户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="90%"
      :close-on-click-modal="false"
      class="add-account-dialog">
      <div class="account-type-selector" v-if="step === 1">
        <div 
          v-for="type in accountTypes" 
          :key="type.value"
          class="type-item"
          :class="{ active: selectedType === type.value }"
          @click="selectAccountType(type.value)">
          <el-icon class="type-icon" :class="type.value">
            <component :is="type.icon" />
          </el-icon>
          <span class="type-name">{{ type.label }}</span>
        </div>
      </div>

      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top">
        <template v-if="selectedType === 'bank'">
          <el-form-item label="开户银行" prop="bankName">
            <el-select v-model="form.bankName" placeholder="请选择开户银行">
              <el-option
                v-for="bank in bankList"
                :key="bank.code"
                :label="bank.name"
                :value="bank.code">
                {{ bank.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="持卡人姓名" prop="holderName">
            <el-input v-model="form.holderName" placeholder="请输入持卡人姓名" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="accountNumber">
            <el-input v-model="form.accountNumber" placeholder="请输入银行卡号" />
          </el-form-item>
        </template>

        <template v-if="selectedType === 'alipay'">
          <el-form-item label="支付宝账号" prop="alipayAccount">
            <el-input v-model="form.alipayAccount" placeholder="请输入支付宝账号" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="form.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </template>

        <template v-if="selectedType === 'wechat'">
          <div class="wechat-bind-tip">
            <el-alert
              title="请使用微信扫描下方二维码进行账号绑定"
              type="info"
              :closable="false"
              center>
            </el-alert>
            <div class="qrcode-container">
              <el-image 
                :src="wechatQRCode" 
                fit="contain"
                class="qrcode"
                :preview-src-list="[wechatQRCode]">
                <template #error>
                  <div class="qrcode-placeholder">
                    <el-icon :size="40"><Warning /></el-icon>
                    <span>二维码加载失败</span>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </template>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlePrevStep" v-if="step === 2">上一步</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleNextStep"
            :loading="loading">
            {{ step === 1 ? '下一步' : '确认绑定' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  More,
  Money,
  ChatDotRound,
  CreditCard,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()

// 账户列表数据
const accounts = ref([
  {
    id: 1,
    bank: '工商银行',
    accountNumber: '**** **** **** 8888',
    icon: '/icons/icbc.png',
    isDefault: true
  },
  {
    id: 2,
    bank: '支付宝',
    accountNumber: '138****8888',
    icon: '/icons/alipay.png',
    isDefault: false
  }
])

// 账户类型选项
const accountTypes = [
  { label: '银行卡', value: 'bank', icon: 'CreditCard' },
  { label: '支付宝', value: 'alipay', icon: 'Money' },
  { label: '微信', value: 'wechat', icon: 'ChatDotRound' }
]

// 银行列表
const bankList = [
  { code: 'ICBC', name: '工商银行' },
  { code: 'ABC', name: '农业银行' },
  { code: 'BOC', name: '中国银行' },
  { code: 'CCB', name: '建设银行' },
  { code: 'CMB', name: '招商银行' }
]

// 表单数据
const dialogVisible = ref(false)
const step = ref(1)
const selectedType = ref('')
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  bankName: '',
  holderName: '',
  accountNumber: '',
  alipayAccount: '',
  realName: ''
})

const rules = {
  bankName: [{ required: true, message: '请选择开户银行' }],
  holderName: [{ required: true, message: '请输入持卡人姓名' }],
  accountNumber: [
    { required: true, message: '请输入银行卡号' },
    { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号' }
  ],
  alipayAccount: [
    { required: true, message: '请输入支付宝账号' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  realName: [{ required: true, message: '请输入真实姓名' }]
}

const dialogTitle = computed(() => {
  if (step.value === 1) return '添加收款账户'
  return selectedType.value === 'bank' ? '添加银行卡' : 
         selectedType.value === 'alipay' ? '绑定支付宝' : '绑定微信'
})

const wechatQRCode = 'https://example.com/wechat-qr.png'

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理添加账户
const handleAdd = () => {
  step.value = 1
  selectedType.value = ''
  dialogVisible.value = true
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 选择账户类型
const selectAccountType = (type) => {
  selectedType.value = type
}

// 处理下一步
const handleNextStep = async () => {
  if (step.value === 1) {
    if (!selectedType.value) {
      ElMessage.warning('请选择账户类型')
      return
    }
    step.value = 2
    return
  }

  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newAccount = {
      id: Date.now(),
      bank: selectedType.value === 'bank' ? form.bankName : 
            (selectedType.value === 'alipay' ? '支付宝' : '微信'),
      accountNumber: selectedType.value === 'bank' ? 
        `**** **** **** ${form.accountNumber.slice(-4)}` : 
        (form.alipayAccount || ''),
      icon: `/icons/${selectedType.value}.png`,
      isDefault: accounts.value.length === 0
    }
    
    accounts.value.push(newAccount)
    
    ElMessage.success('添加成功')
    dialogVisible.value = false
    step.value = 1
  } catch (error) {
    console.error('添加失败：', error)
  } finally {
    loading.value = false
  }
}

// 处理上一步
const handlePrevStep = () => {
  step.value = 1
}

// 处理账户操作
const handleCommand = async (command, account) => {
  if (command === 'setDefault') {
    accounts.value.forEach(acc => {
      acc.isDefault = acc.id === account.id
    })
    ElMessage.success('设置成功')
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        '确定要删除该账户吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      accounts.value = accounts.value.filter(acc => acc.id !== account.id)
      ElMessage.success('删除成功')
    } catch {
      // 用户取消删除
    }
  }
}
</script>

<style scoped>
.bank-accounts-container {
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

.add-button {
  font-size: 20px;
  height: 44px;
  color: #2c3e50;
  position: absolute;
  right: 4px;
}

.accounts-list {
  padding: 12px;
}

.account-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bank-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.account-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bank-name {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.account-number {
  font-size: 13px;
  color: #909399;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.default-tag {
  font-size: 12px;
  height: 20px;
  padding: 0 6px;
}

.account-type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px;
}

.type-item {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-item.active {
  background: #fff7e6;
}

.type-icon {
  font-size: 32px;
  color: #909399;
}

.type-item.active .type-icon {
  color: #e17b00;
}

.type-item.bank .type-icon {
  color: #409EFF;
}

.type-item.alipay .type-icon {
  color: #1677ff;
}

.type-item.wechat .type-icon {
  color: #07c160;
}

.type-name {
  font-size: 14px;
  color: #606266;
}

.type-item.active .type-name {
  color: #e17b00;
  font-weight: 500;
}

.wechat-bind-tip {
  text-align: center;
  padding: 20px 0;
}

.qrcode-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.qrcode {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  border-radius: 8px;
}

.qrcode-placeholder span {
  margin-top: 8px;
  font-size: 14px;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

:deep(.el-select) {
  width: 100%;
}

.danger {
  color: #f56c6c !important;
}

.danger:hover {
  background: #fff1f0 !important;
}
</style> 
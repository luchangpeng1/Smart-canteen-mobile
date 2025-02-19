<template>
  <div class="withdraw-container">
    <div class="balance-card">
      <div class="balance-info">
        <div class="balance-title">当前余额</div>
        <div class="balance-amount">¥ {{ balance.toFixed(2) }}</div>
      </div>
      <div class="today-income">
        <div class="income-title">今日收入</div>
        <div class="income-amount">¥ {{ todayIncome.toFixed(2) }}</div>
      </div>
    </div>

    <div class="withdraw-form">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item prop="amount" label="提现金额">
          <el-input 
            v-model.number="form.amount" 
            type="number"
            @input="handleAmountInput"
            placeholder="请输入提现金额">
            <template #prefix>¥</template>
            <template #append>
              <el-button type="primary" link @click="setMaxAmount">全部提现</el-button>
            </template>
          </el-input>
        </el-form-item>

        <div class="account-section">
          <div class="section-header">
            <span class="section-title">提现账户</span>
            <div class="bind-account-actions">
              <el-button type="primary" link @click="showBindDialog('alipay')">
                <el-icon><Money /></el-icon>
                绑定支付宝
              </el-button>
              <el-button type="success" link @click="showBindDialog('wechat')">
                <el-icon><ChatDotRound /></el-icon>
                绑定微信
              </el-button>
              <el-button type="warning" link @click="showBindDialog('bank')">
                <el-icon><CreditCard /></el-icon>
                绑定银行卡
              </el-button>
            </div>
          </div>

          <div v-if="bankAccounts.length > 0" class="account-list">
            <el-radio-group v-model="form.bankAccount" class="account-radio-group">
              <el-radio 
                v-for="account in bankAccounts" 
                :key="account.id" 
                :value="account.id"
                class="account-radio-item">
                <div class="account-info">
                  <img :src="account.icon" :alt="account.bank" class="bank-icon">
                  <div class="account-detail">
                    <span class="bank-name">{{ account.bank }}</span>
                    <span class="account-number">{{ account.accountNumber }}</span>
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </div>
          
          <el-empty 
            v-else 
            description="暂无绑定账户" 
            :image-size="60"
            class="no-account-tip">
          </el-empty>
        </div>
      </el-form>

      <div class="withdraw-tips">
        <p>提现说明：</p>
        <ul>
          <li>最低提现金额：100元</li>
          <li>提现到账时间：1-3个工作日</li>
          <li>每日提现次数上限：3次（今日剩余：{{ remainingWithdrawals }}次）</li>
          <li>单笔提现上限：50000元</li>
        </ul>
      </div>

      <el-button 
        type="primary" 
        class="withdraw-button"
        :loading="loading"
        :disabled="!canWithdraw"
        @click="handleWithdraw">
        申请提现
      </el-button>
    </div>

    <div class="withdraw-history">
      <div class="history-header">
        <h3>提现记录</h3>
        <el-button type="primary" link @click="showAllHistory">
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <el-empty v-if="withdrawHistory.length === 0" description="暂无提现记录" />
      
      <div v-else class="history-list">
        <div v-for="record in withdrawHistory" :key="record.id" class="history-item">
          <div class="record-info">
            <div class="record-amount">¥ {{ record.amount.toFixed(2) }}</div>
            <div class="record-status" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
          </div>
          <div class="record-detail">
            <div class="record-account">{{ record.bankInfo }}</div>
            <div class="record-time">{{ formatDate(record.createTime) }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="bindDialogVisible"
      :title="getBindDialogTitle"
      width="90%"
      :show-close="false"
      class="bind-dialog">
      <el-form :model="bindForm" :rules="bindRules" ref="bindFormRef" label-position="top">
        <template v-if="bindType === 'bank'">
          <el-form-item label="开户银行" prop="bankName">
            <el-select v-model="bindForm.bankName" placeholder="请选择开户银行">
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
            <el-input v-model="bindForm.holderName" placeholder="请输入持卡人姓名" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="accountNumber">
            <el-input v-model="bindForm.accountNumber" placeholder="请输入银行卡号" />
          </el-form-item>
        </template>

        <template v-if="bindType === 'alipay'">
          <el-form-item label="支付宝账号" prop="alipayAccount">
            <el-input v-model="bindForm.alipayAccount" placeholder="请输入支付宝账号" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="bindForm.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </template>

        <template v-if="bindType === 'wechat'">
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
          <el-button @click="bindDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleBind" 
            :loading="bindLoading"
            :disabled="bindType === 'wechat'">
            确认绑定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ArrowRight, 
  Money, 
  ChatDotRound, 
  CreditCard, 
  Warning 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const router = useRouter()

const balance = ref(1234.56)
const todayIncome = ref(356.80)
const remainingWithdrawals = ref(2)

const bankAccounts = [
  {
    id: 1,
    bank: '工商银行',
    accountNumber: '**** **** **** 8888',
    icon: '/icons/icbc.png',
    label: '工商银行 (8888)'
  },
  {
    id: 2,
    bank: '支付宝',
    accountNumber: '138****8888',
    icon: '/icons/alipay.png',
    label: '支付宝 (8888)'
  }
]

const form = reactive({
  amount: '',
  bankAccount: ''
})

const rules = {
  amount: [
    { required: true, message: '请输入提现金额' },
    { 
      validator: (rule, value, callback) => {
        if (typeof value !== 'number') {
          callback(new Error('请输入有效的提现金额'))
          return
        }
        if (value < 100) {
          callback(new Error('最低提现金额为100元'))
          return
        }
        if (value > 50000) {
          callback(new Error('单笔提现上限为50000元'))
          return
        }
        if (value > balance.value) {
          callback(new Error('提现金额不能大于余额'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  bankAccount: [
    { required: true, message: '请选择提现账户', trigger: 'change' }
  ]
}

const canWithdraw = computed(() => {
  return remainingWithdrawals.value > 0 && balance.value >= 100
})

const formRef = ref(null)
const loading = ref(false)

const setMaxAmount = () => {
  form.amount = Math.min(balance.value, 50000)
  if (formRef.value) {
    formRef.value.validateField('amount')
  }
}

const withdrawHistory = ref([
  {
    id: 1,
    amount: 1000,
    status: 'success',
    bankInfo: '工商银行 (8888)',
    createTime: '2024-03-20 14:30:00'
  },
  {
    id: 2,
    amount: 2000,
    status: 'pending',
    bankInfo: '支付宝 (8888)',
    createTime: '2024-03-19 16:20:00'
  }
])

const getStatusText = (status) => {
  const statusMap = {
    success: '提现成功',
    pending: '处理中',
    failed: '提现失败'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const showAllHistory = () => {
  router.push('/m/admin/withdraw/history')
}

const handleWithdraw = async () => {
  if (!formRef.value) return
  
  try {
    // 首先检查是否填写了必要信息
    if (!form.amount || !form.bankAccount) {
      ElMessage.warning('请填写完整的提现信息')
      return
    }

    // 然后进行表单验证
    await formRef.value.validate()
    
    loading.value = true
    
    const withdrawAmount = form.amount
    const selectedAccount = bankAccounts.find(acc => acc.id === form.bankAccount)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('提现申请已提交')
    
    withdrawHistory.value.unshift({
      id: Date.now(),
      amount: withdrawAmount,
      status: 'pending',
      bankInfo: selectedAccount?.label || '',
      createTime: new Date().toISOString()
    })
    
    remainingWithdrawals.value--
    
    form.amount = ''
    form.bankAccount = ''
    
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('提现申请失败，请重试')
    }
    console.error('提现失败：', error)
  } finally {
    loading.value = false
  }
}

const bindDialogVisible = ref(false)
const bindType = ref('')
const bindLoading = ref(false)
const bindFormRef = ref(null)

const bankList = [
  { code: 'ICBC', name: '工商银行' },
  { code: 'ABC', name: '农业银行' },
  { code: 'BOC', name: '中国银行' },
  { code: 'CCB', name: '建设银行' },
  { code: 'CMB', name: '招商银行' },
  // ... 其他银行
]

const bindForm = reactive({
  bankName: '',
  holderName: '',
  accountNumber: '',
  alipayAccount: '',
  realName: ''
})

const bindRules = {
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

const getBindDialogTitle = computed(() => {
  const titles = {
    bank: '绑定银行卡',
    alipay: '绑定支付宝',
    wechat: '绑定微信'
  }
  return titles[bindType.value] || '绑定账户'
})

const showBindDialog = (type) => {
  bindType.value = type
  bindDialogVisible.value = true
  if (bindFormRef.value) {
    bindFormRef.value.resetFields()
  }
}

const handleBind = async () => {
  if (!bindFormRef.value) return
  
  try {
    await bindFormRef.value.validate()
    bindLoading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newAccount = {
      id: Date.now(),
      bank: bindType.value === 'bank' ? bindForm.bankName : (bindType.value === 'alipay' ? '支付宝' : '微信'),
      accountNumber: bindType.value === 'bank' ? 
        `**** **** **** ${bindForm.accountNumber.slice(-4)}` : 
        (bindForm.alipayAccount || ''),
      icon: `/icons/${bindType.value}.png`,
      label: `${bindType.value === 'bank' ? bindForm.bankName : (bindType.value === 'alipay' ? '支付宝' : '微信')} (${bindForm.accountNumber.slice(-4)})`
    }
    
    bankAccounts.push(newAccount)
    
    ElMessage.success('绑定成功')
    bindDialogVisible.value = false
  } catch (error) {
    console.error('绑定失败：', error)
  } finally {
    bindLoading.value = false
  }
}

const wechatQRCode = 'https://example.com/wechat-qr.png'

const handleAmountInput = (value) => {
  form.amount = parseFloat(value) || ''
}
</script>

<style scoped>
.withdraw-container {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
  margin: -15px;
}

.balance-card {
  background: linear-gradient(135deg, #409EFF, #36D1DC);
  color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.balance-info, .today-income {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.balance-title, .income-title {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.balance-amount, .income-amount {
  font-size: 28px;
  font-weight: bold;
  margin-top: 0;
  line-height: 1.2;
}

.withdraw-form {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.withdraw-tips {
  margin: 16px 0;
  font-size: 14px;
  color: #909399;
}

.withdraw-tips ul {
  padding-left: 16px;
  margin-top: 6px;
}

.withdraw-tips li {
  margin-bottom: 3px;
}

.withdraw-button {
  width: 100%;
  margin-top: 20px;
}

.withdraw-history {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: env(safe-area-inset-bottom, 0);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.history-item {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.history-item:last-child {
  border-bottom: none;
}

.record-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.record-amount {
  font-size: 16px;
  font-weight: 500;
}

.record-status {
  font-size: 14px;
}

.record-status.success {
  color: #67c23a;
}

.record-status.pending {
  color: #e6a23c;
}

.record-status.failed {
  color: #f56c6c;
}

.record-detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.bank-account-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bank-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.bank-info {
  display: flex;
  flex-direction: column;
}

.bank-name {
  font-size: 14px;
  color: #303133;
}

.account-number {
  font-size: 12px;
  color: #909399;
}

:deep(.el-input-group__append) {
  padding: 0;
  border: none;
  background: transparent;
  min-width: 72px;
}

:deep(.el-input-group__append .el-button) {
  font-size: 13px;
  padding: 0 8px 0 12px;
  height: 32px;
  line-height: 32px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  letter-spacing: 0.5px;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input) {
  width: 100%;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .withdraw-container {
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
}

.bind-account-actions {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 8px;
}

.bind-account-actions .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

:deep(.bind-dialog .el-dialog__body) {
  padding-top: 10px;
}

.wechat-bind-tip {
  text-align: center;
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

.account-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  color: #606266;
}

.bind-account-actions {
  display: flex;
  gap: 8px;
}

.account-list {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 4px;
}

.account-radio-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-radio-item {
  margin: 0;
  padding: 12px;
  background: white;
  border-radius: 6px;
  width: 100%;
  height: auto;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bank-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.account-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bank-name {
  font-size: 14px;
  color: #303133;
}

.account-number {
  font-size: 12px;
  color: #909399;
}

.no-account-tip {
  padding: 20px 0;
  background: #f5f7fa;
  border-radius: 8px;
}

:deep(.el-radio) {
  margin-right: 0;
  width: 100%;
}

:deep(.el-radio__label) {
  padding-left: 8px;
}
</style> 
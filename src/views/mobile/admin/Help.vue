<template>
  <div class="help-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">帮助中心</span>
    </div>

    <div class="help-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索问题"
          clearable
          @input="handleSearch">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 常见问题分类 -->
      <div class="faq-categories">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="handleCategoryClick(category)">
          <div class="category-icon">
            <el-icon><component :is="category.icon" /></el-icon>
          </div>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>

      <!-- 热门问题 -->
      <div class="hot-questions">
        <div class="section-title">热门问题</div>
        <div class="question-list">
          <div 
            v-for="question in hotQuestions" 
            :key="question.id"
            class="question-item"
            @click="handleQuestionClick(question)">
            <div class="question-content">
              <el-icon><QuestionFilled /></el-icon>
              <span>{{ question.title }}</span>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 问题分类列表 -->
      <div class="question-categories">
        <div 
          v-for="category in questionCategories" 
          :key="category.id"
          class="category-section">
          <div class="section-header">
            <div class="section-title">{{ category.name }}</div>
            <el-button 
              type="primary" 
              link
              @click="handleViewMore(category)">
              查看更多
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="question-list">
            <div 
              v-for="question in category.questions.slice(0, 3)" 
              :key="question.id"
              class="question-item"
              @click="handleQuestionClick(question)">
              <div class="question-content">
                <el-icon><QuestionFilled /></el-icon>
                <span>{{ question.title }}</span>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系客服 -->
      <div class="contact-support">
        <div class="contact-card" @click="handleContact('phone')">
          <el-icon><Phone /></el-icon>
          <span>电话咨询</span>
        </div>
        <div class="contact-card" @click="handleContact('online')">
          <el-icon><ChatLineRound /></el-icon>
          <span>在线客服</span>
        </div>
      </div>
    </div>

    <!-- 问题详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentQuestion?.title"
      width="90%"
      :close-on-click-modal="false"
      class="question-dialog">
      <div class="question-detail">
        <div class="detail-content" v-html="currentQuestion?.content"></div>
        <div class="feedback-section">
          <div class="feedback-title">这个答案是否解决了您的问题？</div>
          <div class="feedback-actions">
            <el-button @click="handleFeedback(true)">
              <el-icon><Select /></el-icon>
              已解决
            </el-button>
            <el-button @click="handleFeedback(false)">
              <el-icon><Close /></el-icon>
              未解决
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Search,
  QuestionFilled,
  Phone,
  ChatLineRound,
  Select,
  Close,
  Document,
  Setting,
  Money,
  Printer,
  ShoppingCart,
  User
} from '@element-plus/icons-vue'

const router = useRouter()

// 搜索
const searchQuery = ref('')

// 常见问题分类
const categories = [
  { id: 1, name: '订单管理', icon: 'Document' },
  { id: 2, name: '系统设置', icon: 'Setting' },
  { id: 3, name: '资金管理', icon: 'Money' },
  { id: 4, name: '打印设置', icon: 'Printer' },
  { id: 5, name: '商品管理', icon: 'ShoppingCart' },
  { id: 6, name: '账户安全', icon: 'User' }
]

// 热门问题
const hotQuestions = [
  {
    id: 1,
    title: '如何处理退款申请？',
    content: `
      <h3>退款处理流程：</h3>
      <p>1. 在订单管理页面找到需要退款的订单</p>
      <p>2. 点击订单详情，查看退款原因</p>
      <p>3. 确认退款金额</p>
      <p>4. 点击"同意退款"按钮处理退款</p>
      <p>5. 退款将在1-3个工作日内退回用户账户</p>
    `
  },
  {
    id: 2,
    title: '如何修改商品价格？',
    content: `
      <h3>修改商品价格步骤：</h3>
      <p>1. 进入菜单管理页面</p>
      <p>2. 找到需要修改的商品</p>
      <p>3. 点击编辑按钮</p>
      <p>4. 修改价格后保存即可</p>
      <p>注意：价格修改后将立即生效</p>
    `
  },
  {
    id: 3,
    title: '打印机无法连接怎么办？',
    content: `
      <h3>打印机连接故障排查：</h3>
      <p>1. 检查打印机电源是否正常</p>
      <p>2. 确认网络连接是否正常</p>
      <p>3. 检查打印机驱动是否正确安装</p>
      <p>4. 尝试重启打印机</p>
      <p>5. 如果以上步骤无法解决，请联系技术支持</p>
    `
  }
]

// 问题分类
const questionCategories = [
  {
    id: 1,
    name: '订单管理',
    questions: [
      {
        id: 101,
        title: '如何处理催单？',
        content: '处理催单的详细步骤...'
      },
      {
        id: 102,
        title: '如何设置订单自动打印？',
        content: '设置订单自动打印的方法...'
      },
      {
        id: 103,
        title: '如何查看历史订单？',
        content: '查看历史订单的方法...'
      }
    ]
  },
  {
    id: 2,
    name: '资金管理',
    questions: [
      {
        id: 201,
        title: '如何设置自动提现？',
        content: '设置自动提现的步骤...'
      },
      {
        id: 202,
        title: '为什么提现失败？',
        content: '提现失败的常见原因...'
      },
      {
        id: 203,
        title: '如何查看账单明细？',
        content: '查看账单明细的方法...'
      }
    ]
  }
]

// 对话框控制
const dialogVisible = ref(false)
const currentQuestion = ref(null)

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理搜索
const handleSearch = (query) => {
  // TODO: 实现搜索逻辑
  console.log('搜索:', query)
}

// 处理分类点击
const handleCategoryClick = (category) => {
  // TODO: 跳转到分类详情页
  console.log('分类:', category)
}

// 处理问题点击
const handleQuestionClick = (question) => {
  currentQuestion.value = question
  dialogVisible.value = true
}

// 处理查看更多
const handleViewMore = (category) => {
  // TODO: 跳转到分类详情页
  console.log('查看更多:', category)
}

// 处理联系客服
const handleContact = (type) => {
  if (type === 'phone') {
    window.location.href = 'tel:400-123-4567'
  } else {
    // TODO: 打开在线客服窗口
    console.log('打开在线客服')
  }
}

// 处理问题反馈
const handleFeedback = (isHelpful) => {
  ElMessage.success(isHelpful ? '感谢您的反馈！' : '我们会继续改进！')
  dialogVisible.value = false
}
</script>

<style scoped>
.help-container {
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

.help-content {
  padding: 12px;
}

.search-box {
  margin-bottom: 16px;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 20px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.search-box :deep(.el-input__prefix) {
  color: #909399;
}

.faq-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.category-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-item:active {
  opacity: 0.8;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon .el-icon {
  font-size: 24px;
  color: #e17b00;
}

.category-name {
  font-size: 13px;
  color: #2c3e50;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 12px;
}

.question-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.question-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.question-item:active {
  background: #f5f7fa;
}

.question-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.question-content .el-icon {
  font-size: 16px;
  color: #e17b00;
  flex-shrink: 0;
}

.question-content span {
  font-size: 14px;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 16px;
}

.category-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contact-support {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.contact-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-card:active {
  opacity: 0.8;
}

.contact-card .el-icon {
  font-size: 32px;
  color: #e17b00;
}

.contact-card span {
  font-size: 14px;
  color: #2c3e50;
}

.question-dialog :deep(.el-dialog__body) {
  padding-top: 16px;
}

.detail-content {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.6;
}

.detail-content h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px;
}

.detail-content p {
  margin: 8px 0;
}

.feedback-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.feedback-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.feedback-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.feedback-actions .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}
</style> 
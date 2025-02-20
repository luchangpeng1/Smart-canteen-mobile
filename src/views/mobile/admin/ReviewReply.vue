<template>
  <div class="review-reply-page">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="header-title">回复评价</div>
      <div class="header-right"></div>
    </div>

    <div class="page-content">
      <!-- 原始评价 -->
      <div class="original-review">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-avatar :size="36" :src="review?.userAvatar">
                {{ review?.userName?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ review?.userName }}</span>
            </div>
            <div class="user-details">
              <div class="rating-time">
                <el-rate
                  v-if="review"
                  v-model="review.rating"
                  disabled
                  :colors="['#ffd21e', '#ffd21e', '#ffd21e']"
                  size="small"
                />
                <span class="review-time">{{ formatTime(review?.createTime) }}</span>
              </div>
              <div class="order-info">
                <span class="order-id">订单号：{{ review?.orderId }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="review-content">
          <div class="dishes-list" v-if="review?.dishes?.length">
            <div v-for="dish in review.dishes" :key="dish.id" class="dish-item">
              <img :src="dish.image" :alt="dish.name" class="dish-image">
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <span class="dish-price">¥{{ dish.price }}</span>
              </div>
            </div>
          </div>
          
          <p class="review-text">{{ review?.content }}</p>
          
          <div v-if="review?.images?.length" class="review-images">
            <el-image
              v-for="(image, index) in review.images"
              :key="index"
              :src="image"
              :preview-src-list="review.images"
              fit="cover"
              class="review-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <div class="review-tags" v-if="review?.tags?.length">
            <span
              v-for="tag in review.tags"
              :key="tag"
              class="review-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 快速回复 -->
      <div class="quick-replies">
        <div class="section-title">快速回复</div>
        <div class="quick-reply-list">
          <el-tag
            v-for="reply in quickReplies"
            :key="reply"
            class="quick-reply-tag"
            @click="selectQuickReply(reply)"
          >
            {{ reply }}
          </el-tag>
        </div>
      </div>

      <!-- 回复输入框 -->
      <div class="reply-input">
        <div class="section-title">回复内容</div>
        <el-input
          v-model="replyContent"
          type="textarea"
          :rows="4"
          placeholder="请输入回复内容..."
          maxlength="500"
          show-word-limit
        />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="page-footer">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="submitReply" :loading="submitting">
        确认回复
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Picture } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const review = ref(null)
const replyContent = ref('')
const submitting = ref(false)

// 快速回复模板
const quickReplies = [
  '感谢您的评价，我们会继续保持！',
  '抱歉没有达到您的期望，我们会努力改进',
  '谢谢您的支持，欢迎再次光临',
  '感谢您的建议，我们会认真考虑',
  '已收到您的反馈，我们会及时处理'
]

onMounted(() => {
  try {
    // 从 localStorage 获取评价数据
    const savedReview = localStorage.getItem('current_review')
    if (savedReview) {
      review.value = JSON.parse(savedReview)
      // 获取后立即删除，避免数据残留
      localStorage.removeItem('current_review')
    } else {
      // TODO: 如果没有缓存数据，则通过API获取评价详情
      // fetchReviewDetail(route.params.id)
    }
  } catch (error) {
    console.error('Error loading review:', error)
    ElMessage.error('加载评价数据失败')
    router.back()
  }
})

const selectQuickReply = (reply) => {
  replyContent.value = reply
}

const submitReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  submitting.value = true
  try {
    // TODO: 调用API提交回复
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('回复成功')
    goBack()
  } catch (error) {
    ElMessage.error('回复失败')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}

const formatTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.review-reply-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0;
  z-index: 100;
  border-bottom: 0.5px solid #ebedf0;
}

.header-left {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.header-left .el-icon {
  font-size: 18px;
  margin-right: 2px;
}

.header-title {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 0 52px;
}

.header-right {
  position: absolute;
  right: 0;
  width: 52px;
  height: 44px;
}

.page-content {
  flex: 1;
  padding: 72px 16px 90px;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.original-review {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.original-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.review-header {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.rating-time {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-time {
  font-size: 13px;
  color: var(--text-light);
}

.order-info {
  margin-top: 6px;
}

.order-id {
  font-size: 14px;
  color: var(--text-light);
}

.review-content {
  margin-bottom: 20px;
}

.dishes-list {
  display: flex;
  gap: 16px;
  margin: -4px -24px 20px;
  padding: 4px 24px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;
}

.dish-item {
  flex: 0 0 auto;
  width: 140px;
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dish-image {
  width: 140px;
  height: 105px;
  object-fit: cover;
}

.dish-info {
  padding: 12px;
}

.dish-name {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dish-price {
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 600;
}

.review-text {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.8;
  margin: 0 0 20px;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.review-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0 -4px 20px;
}

.review-image {
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.review-tag {
  padding: 6px 12px;
  background: #f5f7fa;
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 13px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: var(--primary-color);
  border-radius: 2px;
  display: block;
}

.quick-replies {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.quick-reply-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-reply-tag {
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #e4e7ed;
  background: #fff;
}

.quick-reply-tag:hover {
  color: var(--primary-color);
  background: var(--primary-light);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 156, 0, 0.1);
}

.reply-input {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.reply-input :deep(.el-textarea__inner) {
  padding: 16px;
  border-radius: 16px;
  resize: none;
  font-size: 15px;
  line-height: 1.8;
  border-color: #e4e7ed;
  transition: all 0.3s;
}

.reply-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 156, 0, 0.1);
}

.reply-input :deep(.el-input__count) {
  background: transparent;
  font-size: 13px;
  color: var(--text-light);
  padding: 4px 12px;
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.page-footer :deep(.el-button) {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.page-footer :deep(.el-button--primary) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.page-footer :deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 156, 0, 0.2);
}

.page-footer :deep(.el-button--default:hover) {
  transform: translateY(-2px);
  background: #f5f7fa;
}

@media screen and (max-width: 480px) {
  .page-content {
    padding: 68px 12px 84px;
  }

  .original-review,
  .quick-replies,
  .reply-input {
    padding: 20px;
    border-radius: 16px;
  }

  .dishes-list {
    margin: -4px -20px 16px;
    padding: 4px 20px;
  }

  .dish-item {
    width: 120px;
  }

  .dish-image {
    width: 120px;
    height: 90px;
  }

  .review-images {
    gap: 8px;
  }

  .quick-reply-list {
    gap: 8px;
  }

  .quick-reply-tag {
    padding: 8px 16px;
    font-size: 13px;
  }

  .section-title {
    font-size: 15px;
  }

  .review-text {
    font-size: 15px;
    padding: 12px;
  }

  .page-footer {
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .page-footer :deep(.el-button) {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style> 
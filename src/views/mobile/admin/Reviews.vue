<template>
  <div class="mobile-reviews">
    <!-- 评价统计卡片 -->
    <div class="stats-section">
      <div class="overall-rating">
        <div class="rating-score">
          <span class="score">{{ stats.avgRating.toFixed(1) }}</span>
          <span class="total">/ 5.0</span>
        </div>
        <div class="rating-stars">
          <el-rate
            v-model="stats.avgRating"
            disabled
            allow-half
            :colors="['#ffd21e', '#ffd21e', '#ffd21e']"
          />
        </div>
        <div class="rating-text">总体评分</div>
      </div>
      
      <div class="rating-distribution">
        <div 
          v-for="(item, index) in ratingDistribution" 
          :key="index"
          class="distribution-item"
          @click="handleRatingFilter(5 - index)"
        >
          <span class="star-label">{{ 5 - index }}星</span>
          <div class="progress-bar">
            <div 
              class="progress" 
              :style="{ width: item.percentage + '%', backgroundColor: getProgressColor(5 - index) }"
            ></div>
          </div>
          <span class="percentage">{{ item.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 标签筛选区 -->
    <div class="tag-filter">
      <div class="tag-group">
        <el-tag
          v-for="tag in reviewTags"
          :key="tag.name"
          :type="tag.active ? 'warning' : 'info'"
          class="filter-tag"
          :class="{ active: tag.active }"
          @click="toggleTag(tag)"
        >
          {{ tag.name }}
          <span class="tag-count">({{ tag.count }})</span>
        </el-tag>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-group">
        <div class="filter-type-tags">
          <div 
            v-for="type in filterTypes" 
            :key="type.value"
            class="filter-type-tag"
            :class="{ active: filterType === type.value }"
            @click="filterType = type.value; handleFilterChange()"
          >
            {{ type.label }}
          </div>
        </div>
        
        <div class="date-filter-group">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            size="small"
            :clearable="true"
            value-format="YYYY-MM-DD"
            @change="handleFilter"
          />
          
          <el-button 
            type="default" 
            size="small" 
            @click="handleResetFilter"
            :disabled="!hasActiveFilters"
          >
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="reviews-list">
      <div v-for="review in paginatedReviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-avatar :size="36" :src="review.userAvatar">
                {{ review.userName.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ review.userName }}</span>
            </div>
            <div class="user-details">
              <div class="rating-time">
                <el-rate
                  v-model="review.rating"
                  disabled
                  :colors="['#ffd21e', '#ffd21e', '#ffd21e']"
                  size="small"
                />
                <span class="review-time">{{ formatTime(review.createTime) }}</span>
              </div>
            </div>
          </div>
          <div class="order-info">
            <span class="order-id">订单号：{{ review.orderId }}</span>
          </div>
        </div>

        <div class="review-content">
          <div class="dishes-list">
            <div v-for="dish in review.dishes" :key="dish.id" class="dish-item">
              <img :src="dish.image" :alt="dish.name" class="dish-image">
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <span class="dish-price">¥{{ dish.price }}</span>
              </div>
            </div>
          </div>
          
          <p class="review-text">{{ review.content }}</p>
          
          <div v-if="review.images && review.images.length" class="review-images">
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
          
          <div class="review-tags" v-if="review.tags && review.tags.length">
            <el-tag
              v-for="tag in review.tags"
              :key="tag"
              size="small"
              type="info"
              class="review-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div v-if="review.reply" class="review-reply">
          <div class="reply-header">
            <el-tag size="small" type="success">商家回复</el-tag>
            <span class="reply-time">{{ formatTime(review.replyTime) }}</span>
          </div>
          <p class="reply-content">{{ review.reply }}</p>
        </div>

        <div class="review-actions" v-if="!review.reply">
          <el-button 
            type="primary" 
            plain
            size="small"
            @click="navigateToReply(review)"
          >
            回复评价
          </el-button>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { RefreshLeft, Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态
const activeTab = ref('all')
const filterType = ref('')
const filterValue = ref('')
const selectedDate = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const reviews = ref([])

// 统计数据
const stats = ref({
  avgRating: 4.5,
  totalReviews: 128,
  positiveRate: 92
})

// 评分分布数据
const ratingDistribution = ref([
  { stars: 5, count: 80, percentage: 62.5 },
  { stars: 4, count: 30, percentage: 23.4 },
  { stars: 3, count: 10, percentage: 7.8 },
  { stars: 2, count: 5, percentage: 3.9 },
  { stars: 1, count: 3, percentage: 2.4 }
])

// 评价标签
const reviewTags = ref([
  { name: '全部', count: 128, active: true },
  { name: '味道好', count: 86, active: false },
  { name: '分量足', count: 45, active: false },
  { name: '服务好', count: 38, active: false },
  { name: '价格实惠', count: 32, active: false },
  { name: '环境好', count: 28, active: false },
  { name: '出餐快', count: 25, active: false }
])

// 筛选类型
const filterTypes = [
  { label: '全部评价', value: '' },
  { label: '未回复', value: 'unreplied' },
  { label: '已回复', value: 'replied' },
  { label: '有图评价', value: 'withPhotos' }
]

// 计算属性
const hasActiveFilters = computed(() => {
  return Boolean(
    filterType.value || 
    filterValue.value || 
    selectedDate.value ||
    reviewTags.value.some(tag => tag.active && tag.name !== '全部')
  )
})

// 获取进度条颜色
const getProgressColor = (stars) => {
  const colors = {
    5: '#ff9c00',
    4: '#ffb340',
    3: '#ffc773',
    2: '#ffd9a6',
    1: '#ffe6cc'
  }
  return colors[stars] || '#ff9c00'
}

// 处理评分筛选
const handleRatingFilter = (stars) => {
  filterType.value = 'rating'
  filterValue.value = stars.toString()
  fetchReviews()
}

// 切换标签
const toggleTag = (tag) => {
  if (tag.name === '全部') {
    reviewTags.value.forEach(t => t.active = t === tag)
  } else {
    const allTag = reviewTags.value.find(t => t.name === '全部')
    if (allTag) allTag.active = false
    tag.active = !tag.active
  }
  fetchReviews()
}

// 生成测试数据
const generateTestReviews = () => {
  const testReviews = []
  const dishes = [
    { 
      id: 1,
      name: '红烧肉', 
      price: 15, 
      image: 'https://img.zcool.cn/community/01a9445d54c65da801211d53235317.jpg'
    },
    {
      id: 2,
      name: '宫保鸡丁',
      price: 16,
      image: 'https://img.zcool.cn/community/01f8c65d54c65da801211d532386f7.jpg'
    }
  ]
  
  for (let i = 0; i < 20; i++) {
    const reviewDishes = dishes.slice(0, Math.floor(Math.random() * 2) + 1)
    testReviews.push({
      id: i + 1,
      orderId: `ORDER${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      userName: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
      userAvatar: '',
      rating: Math.floor(Math.random() * 3) + 3,
      content: ['很好吃，下次还会来！', '份量足，味道不错', '服务态度很好，菜品口感不错', '价格实惠，推荐'][Math.floor(Math.random() * 4)],
      createTime: dayjs().subtract(Math.floor(Math.random() * 7), 'day').valueOf(),
      dishes: reviewDishes,
      images: Math.random() > 0.5 ? [reviewDishes[0].image] : [],
      tags: ['味道好', '分量足', '服务好'].slice(0, Math.floor(Math.random() * 3) + 1),
      reply: Math.random() > 0.7 ? '感谢您的评价，我们会继续努力！' : '',
      replyTime: dayjs().subtract(Math.floor(Math.random() * 2), 'day').valueOf()
    })
  }
  
  return testReviews
}

// 计算属性：筛选后的评价列表
const filteredReviews = computed(() => {
  let result = [...reviews.value]
  
  // 按评分筛选
  if (filterType.value === 'rating' && filterValue.value) {
    result = result.filter(review => review.rating === Number(filterValue.value))
  }
  
  // 按回复状态筛选
  if (filterType.value === 'unreplied') {
    result = result.filter(review => !review.reply)
  } else if (filterType.value === 'replied') {
    result = result.filter(review => review.reply)
  } else if (filterType.value === 'withPhotos') {
    result = result.filter(review => review.images && review.images.length > 0)
  }
  
  // 按标签筛选
  const activeTags = reviewTags.value
    .filter(tag => tag.active && tag.name !== '全部')
    .map(tag => tag.name)
  if (activeTags.length > 0) {
    result = result.filter(review => 
      review.tags.some(tag => activeTags.includes(tag))
    )
  }
  
  // 按日期筛选
  if (selectedDate.value) {
    const selectedDay = dayjs(selectedDate.value).format('YYYY-MM-DD')
    result = result.filter(review => 
      dayjs(review.createTime).format('YYYY-MM-DD') === selectedDay
    )
  }
  
  return result
})

// 更新分页数据
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReviews.value.slice(start, end)
})

// 更新总数
const totalFilteredReviews = computed(() => {
  return filteredReviews.value.length
})

// 方法
const handleTabChange = (tab) => {
  currentPage.value = 1
  fetchReviews()
}

const handleFilterChange = () => {
  currentPage.value = 1
  filterValue.value = ''
  selectedDate.value = null
  fetchReviews()
}

const handleFilter = () => {
  currentPage.value = 1
  fetchReviews()
}

const handleResetFilter = () => {
  filterType.value = ''
  filterValue.value = ''
  selectedDate.value = null
  currentPage.value = 1
  reviewTags.value.forEach(tag => {
    tag.active = tag.name === '全部'
  })
  fetchReviews()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchReviews()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchReviews()
}

const navigateToReply = (review) => {
  // 将评价数据存储到 localStorage
  localStorage.setItem('current_review', JSON.stringify(review))
  router.push({
    name: 'review-reply',
    params: { id: review.id }
  })
}

const fetchReviews = async () => {
  // TODO: 调用API获取评价列表
  reviews.value = generateTestReviews()
  total.value = totalFilteredReviews.value
}

const formatTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

// 生命周期钩子
onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
:root {
  --primary-color: #ff9c00;
  --primary-light: #fff7e6;
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  --border-radius: 16px;
  --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-reviews {
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: #f8f9fa;
  min-height: 100vh;
}

/* 统计区域样式 */
.stats-section {
  background: #fff;
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
  display: flex;
  gap: 24px;
}

.overall-rating {
  flex: 0 0 140px;
  text-align: center;
  padding-right: 24px;
  border-right: 1px solid #f0f0f0;
}

.rating-score {
  margin-bottom: 12px;
}

.score {
  font-size: 42px;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1;
}

.total {
  font-size: 15px;
  color: var(--text-light);
  margin-left: 4px;
}

.rating-stars {
  margin-bottom: 12px;
}

.rating-text {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
}

.rating-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 0;
  transition: var(--transition);
}

.distribution-item:hover {
  transform: translateX(4px);
}

.star-label {
  width: 40px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: right;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 18px;
  background: #f5f5f5;
  border-radius: 9px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress {
  height: 100%;
  transition: var(--transition);
}

.percentage {
  width: 44px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 标签筛选样式 */
.tag-filter {
  background: #fff;
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.filter-tag:hover {
  transform: translateY(-2px);
}

.filter-tag.active {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.tag-count {
  margin-left: 6px;
  font-size: 13px;
  opacity: 0.85;
}

/* 筛选工具栏样式 */
.filter-toolbar {
  background: #fff;
  padding: 20px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-type-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-type-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--text-secondary);
  background: #f5f5f5;
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}

.filter-type-tag:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.filter-type-tag.active {
  background: var(--primary-color);
  color: #fff;
}

.date-filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-filter-group :deep(.el-input) {
  flex: 1;
}

/* 评价列表样式 */
.reviews-list {
  margin-bottom: 20px;
}

.review-item {
  background: #fff;
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--card-shadow);
  transition: var(--transition);
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  gap: 20px;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.rating-time {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-info {
  font-size: 13px;
  color: var(--text-secondary);
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
}

.dishes-list {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding: 4px 0;
  scroll-behavior: smooth;
}

.dish-item {
  flex: 0 0 auto;
  width: 130px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: var(--transition);
}

.dish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dish-image {
  width: 130px;
  height: 98px;
  object-fit: cover;
}

.dish-info {
  padding: 10px;
}

.dish-name {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
}

.dish-price {
  font-size: 13px;
  color: #ff4d4f;
  font-weight: 600;
}

.review-content {
  margin-bottom: 20px;
}

.review-text {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.7;
  margin: 0 0 16px;
}

.review-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.review-image {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  transition: var(--transition);
}

.review-image:hover {
  transform: scale(1.02);
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: var(--text-light);
  border-radius: 12px;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.review-tag {
  background: #f8f9fa;
  border: none;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.review-reply {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.reply-time {
  font-size: 13px;
  color: var(--text-light);
}

.reply-content {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.7;
}

.review-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 分页器样式 */
.pagination-container {
  background: #fff;
  border-radius: var(--border-radius);
  padding: 20px;
  display: flex;
  justify-content: center;
  box-shadow: var(--card-shadow);
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .stats-section {
    flex-direction: column;
  }
  
  .overall-rating {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 0;
    padding-bottom: 20px;
  }
  
  .filter-toolbar {
    padding: 16px;
  }
  
  .filter-group {
    gap: 12px;
  }
  
  .date-filter-group {
    gap: 8px;
  }
}

@media screen and (max-width: 480px) {
  .mobile-reviews {
    padding: 12px;
  }
  
  .review-images {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .dishes-list {
    margin: -4px -20px 16px;
    padding: 4px 20px;
  }
  
  .dish-item {
    width: 110px;
  }
  
  .dish-image {
    width: 110px;
    height: 83px;
  }

  .stats-section,
  .tag-filter,
  .filter-toolbar,
  .review-item,
  .pagination-container {
    padding: 16px;
    border-radius: 12px;
  }

  .filter-type-tags {
    gap: 8px;
  }
  
  .filter-type-tag {
    padding: 4px 12px;
    font-size: 13px;
  }

  .date-filter-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .date-filter-group :deep(.el-input),
  .date-filter-group .el-button {
    width: 100%;
  }

  .user-info {
    gap: 16px;
  }
  
  .avatar-wrapper {
    gap: 6px;
  }
  
  .user-name {
    font-size: 13px;
  }

  .reply-dialog :deep(.el-dialog) {
    width: 92% !important;
    max-height: 85vh;
  }
  
  .reply-dialog :deep(.el-dialog__body) {
    padding: 16px 0;
  }
  
  .reply-dialog :deep(.el-dialog__header) {
    padding: 16px 20px;
  }
  
  .reply-dialog :deep(.el-dialog__footer) {
    padding: 12px 20px;
  }
  
  .reply-dialog-content {
    padding: 0 20px;
  }
}

/* 滚动条样式 */
.dishes-list::-webkit-scrollbar {
  height: 6px;
}

.dishes-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.dishes-list::-webkit-scrollbar-track {
  background: transparent;
}

/* 添加平滑滚动 */
* {
  scroll-behavior: smooth;
}
</style> 
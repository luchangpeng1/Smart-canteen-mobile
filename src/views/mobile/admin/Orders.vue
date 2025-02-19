<template>
  <div class="mobile-orders">
    <!-- 订单状态切换 -->
    <div class="tabs-wrapper">
      <el-tabs 
        v-model="activeStatus" 
        @tab-change="handleStatusChange"
        class="order-tabs"
      >
        <el-tab-pane name="pending">
          <template #label>
            <el-badge :value="pendingCount" :hidden="!pendingCount">
              待处理
            </el-badge>
          </template>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="processing" />
        <el-tab-pane label="已完成" name="completed" />
      </el-tabs>

      <!-- 历史订单入口 -->
      <div class="history-entry">
        <el-button 
          type="primary" 
          link 
          @click="router.push('/m/admin/order-history')"
        >
          <el-icon><Calendar /></el-icon>
          历史订单
        </el-button>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-select
        v-model="filterType"
        placeholder="筛选条件"
        size="small"
        style="width: 120px"
        @change="handleFilterTypeChange"
      >
        <el-option label="订单号" value="orderNo" />
        <el-option label="学生姓名" value="studentName" />
        <el-option label="用餐方式" value="diningType" />
        <el-option label="订单金额" value="total" />
        <el-option label="下单日期" value="date" />
      </el-select>
      
      <!-- 根据不同筛选条件显示不同的输入框 -->
      <template v-if="filterType === 'date'">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          @change="handleFilter"
          style="width: 260px"
          value-format="YYYY-MM-DD"
          :shortcuts="dateShortcuts"
        />
      </template>
      <template v-else-if="filterType === 'orderNo' || filterType === 'studentName'">
        <el-input
          v-model="filterValue"
          :placeholder="`请输入${filterType === 'orderNo' ? '订单号' : '学生姓名'}`"
          size="small"
          clearable
          @input="handleFilter"
          style="width: 200px"
        />
      </template>
      
      <template v-else-if="filterType === 'diningType'">
        <el-select
          v-model="filterValue"
          placeholder="选择用餐方式"
          size="small"
          clearable
          @change="handleFilter"
          style="width: 200px"
        >
          <el-option label="堂食" value="堂食" />
          <el-option label="外带" value="外带" />
        </el-select>
      </template>
      
      <template v-else-if="filterType === 'total'">
        <div class="price-range">
          <el-input-number
            v-model="priceRange.min"
            :min="0"
            size="small"
            placeholder="最小金额"
            @change="handleFilter"
          />
          <span>-</span>
          <el-input-number
            v-model="priceRange.max"
            :min="0"
            size="small"
            placeholder="最大金额"
            @change="handleFilter"
          />
        </div>
      </template>
    </div>

    <!-- 在 el-tabs 下方添加搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号/学生姓名"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
    </div>

    <!-- 移动分页器到这里 -->
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

    <!-- 添加筛选抽屉 -->
    <el-drawer
      v-model="showFilter"
      title="筛选条件"
      direction="rtl"
      size="80%"
    >
      <div class="filter-content">
        <el-form>
          <el-form-item label="用餐方式">
            <el-select v-model="filters.diningType" clearable>
              <el-option label="堂食" value="堂食" />
              <el-option label="外带" value="外带" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <!-- 批量操作工具栏 -->
    <div v-if="selectedOrders.length > 0" class="batch-toolbar">
      <span class="selected-count">已选择 {{ selectedOrders.length }} 个订单</span>
      <div class="batch-actions">
        <!-- 批量处理下拉菜单 -->
        <el-dropdown @command="handleBatchAction">
          <el-button type="primary" size="small">
            批量处理
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="print">批量打印</el-dropdown-item>
              <el-dropdown-item command="export">导出订单</el-dropdown-item>
              <el-dropdown-item 
                command="delete" 
                divided
                :style="{ color: '#F56C6C' }"
              >
                批量删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button 
          type="primary" 
          size="small" 
          @click="handleBatchAccept"
          v-if="activeStatus === 'pending'">
          批量接单
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          @click="handleBatchComplete"
          v-if="activeStatus === 'processing'">
          批量完成
        </el-button>
      </div>
    </div>

    <!-- 在订单列表上方添加统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">{{ todayStats.orderCount }}</div>
            <div class="stat-label">今日订单</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">¥{{ todayStats.revenue }}</div>
            <div class="stat-label">营业额</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-value">{{ todayStats.avgTime }}分钟</div>
            <div class="stat-label">平均处理</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <el-checkbox-group v-model="selectedOrders" @change="handleSelectionChange">
        <!-- 按日期分组显示已完成订单 -->
        <template v-if="activeStatus === 'completed'">
          <div v-for="group in groupedOrders" :key="group.date" class="order-group">
            <div class="date-header">
              <span class="date-text">{{ group.date }}</span>
              <span class="order-count">{{ group.orders.length }}个订单</span>
            </div>
            <el-card v-for="order in group.orders" :key="order.id" class="order-card">
              <div class="order-card-header">
                <div class="order-basic-info">
                  <div class="order-info">
                    <div class="order-info-left">
                      <span class="order-no">订单号：{{ order.orderNo }}</span>
                    </div>
                    <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
                  </div>
                  <div class="order-meta" v-if="order.expanded">
                    <span class="order-time">{{ formatTime(order.createTime) }}</span>
                    <el-tag 
                      size="small" 
                      :type="order.diningType === '堂食' ? 'success' : 'warning'"
                      class="dining-type">
                      {{ order.diningType }}
                    </el-tag>
                  </div>
                </div>
                <el-button 
                  text 
                  class="expand-btn"
                  @click="toggleExpand(order)"
                >
                  {{ order.expanded ? '收起' : '展开' }}
                  <el-icon class="expand-icon" :class="{ 'is-expanded': order.expanded }">
                    <ArrowDown />
                  </el-icon>
                </el-button>
              </div>
              <div v-show="order.expanded">
                <div class="customer-info">
                  <el-icon><User /></el-icon>
                  <span>{{ order.studentName }}</span>
                  <span class="order-no">订单号：{{ order.orderNo }}</span>
                </div>
                <div class="order-items">
                  <div class="items-header">
                    <span>菜品明细</span>
                    <span>共{{ getTotalQuantity(order.items) }}份</span>
                  </div>
                  <div class="order-items-grid">
                    <div v-for="item in order.items" :key="item.id" class="order-item">
                      <div class="item-image" v-if="item.name !== '米饭'">
                        <img :src="getDishImage(item.name)" :alt="item.name">
                      </div>
                      <div class="item-content">
                        <div class="item-info">
                          <span class="item-name">{{ item.name }}</span>
                        </div>
                        <div class="item-specs" v-if="item.specs">{{ item.specs }}</div>
                        <div class="item-price-info">
                          <span class="item-quantity">x{{ item.quantity }}</span>
                          <span class="item-price">¥{{ item.price }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="order-total">
                    <div class="total-info">
                      <span class="total-label">总计：</span>
                      <span class="total-price">¥{{ order.total }}</span>
                    </div>
                    <div class="order-remark" v-if="order.remark">
                      <el-icon><InfoFilled /></el-icon>
                      <span>{{ order.remark }}</span>
                    </div>
                  </div>
                  <div class="order-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="handlePrint(order)"
                      class="print-btn"
                    >
                      <el-icon><Printer /></el-icon>
                      打印
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </template>
        <!-- 其他状态的订单正常显示 -->
        <template v-else>
          <el-card 
            v-for="order in orders" 
            :key="order.id" 
            class="order-card"
            :class="{ 'new-order': order.isNew }">
            <div class="order-card-header">
              <div class="order-basic-info">
                <div class="order-info">
                  <div class="order-info-left">
                    <el-checkbox :value="order.id" v-if="canSelect(order)">
                      <span class="order-no">订单号：{{ order.orderNo }}</span>
                    </el-checkbox>
                    <span v-else class="order-no">订单号：{{ order.orderNo }}</span>
                  </div>
                  <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
                </div>
                <div class="order-meta" v-if="order.expanded">
                  <span class="order-time">{{ formatTime(order.createTime) }}</span>
                  <el-tag 
                    size="small" 
                    :type="order.diningType === '堂食' ? 'success' : 'warning'"
                    class="dining-type">
                    {{ order.diningType }}
                  </el-tag>
                </div>
              </div>
              <el-button 
                text 
                class="expand-btn"
                @click="toggleExpand(order)"
              >
                {{ order.expanded ? '收起' : '展开' }}
                <el-icon class="expand-icon" :class="{ 'is-expanded': order.expanded }">
                  <ArrowDown />
                </el-icon>
              </el-button>
            </div>

            <div v-show="order.expanded">
              <div class="customer-info">
                <el-icon><User /></el-icon>
                <span>{{ order.studentName }}</span>
                <span class="student-id">({{ order.studentId }})</span>
              </div>

              <div class="order-items">
                <div class="items-header">
                  <span>菜品明细</span>
                  <span>共{{ getTotalQuantity(order.items) }}份</span>
                </div>
                <div class="order-items-grid">
                  <div v-for="item in order.items" :key="item.id" class="order-item">
                    <div class="item-image" v-if="item.name !== '米饭'">
                      <img :src="getDishImage(item.name)" :alt="item.name">
                    </div>
                    <div class="item-content">
                      <div class="item-info">
                        <span class="item-name">{{ item.name }}</span>
                      </div>
                      <div class="item-specs" v-if="item.specs">{{ item.specs }}</div>
                      <div class="item-price-info">
                        <span class="item-quantity">x{{ item.quantity }}</span>
                        <span class="item-price">¥{{ item.price }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  <div class="total-info">
                    <span class="total-label">总计：</span>
                    <span class="total-price">¥{{ order.total }}</span>
                  </div>
                  <div class="order-remark" v-if="order.remark">
                    <el-icon><InfoFilled /></el-icon>
                    <span>{{ order.remark }}</span>
                  </div>
                </div>
                <div class="order-actions">
                  <template v-if="order.status === '待处理'">
                    <el-button type="primary" size="small" @click="handleAccept(order)">
                      接单
                    </el-button>
                    <el-button type="danger" size="small" @click="handleReject(order)">
                      拒绝
                    </el-button>
                  </template>
                  <template v-else-if="order.status === '进行中'">
                    <el-button type="success" size="small" @click="handleComplete(order)">
                      完成
                    </el-button>
                  </template>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="handlePrint(order)"
                    class="print-btn"
                  >
                    <el-icon><Printer /></el-icon>
                    打印
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </template>
      </el-checkbox-group>
    </div>

    <!-- 加载状态 -->
    <div class="load-more" v-if="loading || noMore">
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多订单了</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import notificationSound from '@/mp3/叮咚.mp3'
import { User, InfoFilled, Search, Filter, ArrowDown, ArrowUp, Printer, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态和数据
const activeStatus = ref('pending')
const orders = ref([])
const selectedOrders = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = ref(10)
const pendingCount = ref(0)
const searchQuery = ref('')
const showFilter = ref(false)
const filters = ref({
  diningType: '',
  dateRange: []
})
const todayStats = ref({
  orderCount: 0,
  revenue: 0,
  avgTime: 0
})
const filterType = ref('')
const filterValue = ref('')
const priceRange = ref({
  min: null,
  max: null
})
const dateRange = ref([])
const currentPage = ref(1)
const total = ref(0)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      return [start, end]
    },
  },
]

const filteredOrders = computed(() => {
  if (!filterType.value || (!filterValue.value && filterType.value !== 'total')) {
    return orders.value
  }
  
  return orders.value.filter(order => {
    switch (filterType.value) {
      case 'date':
        if (!dateRange.value || !dateRange.value.length) return true
        const orderDate = dayjs(order.createTime).format('YYYY-MM-DD')
        const startDate = dateRange.value[0]
        const endDate = dateRange.value[1]
        return orderDate >= startDate && orderDate <= endDate
      case 'orderNo':
        return order.orderNo.toLowerCase().includes(filterValue.value.toLowerCase())
      case 'studentName':
        return order.studentName.includes(filterValue.value)
      case 'diningType':
        return order.diningType === filterValue.value
      case 'total':
        const min = priceRange.value.min ?? 0
        const max = priceRange.value.max ?? Infinity
        return order.total >= min && order.total <= max
      default:
        return true
    }
  })
})

// 算订单总数量
const getTotalQuantity = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

// 更新今日统计数据
const updateTodayStats = () => {
  todayStats.value = {
    orderCount: 47,
    revenue: 1268,
    avgTime: 15
  }
}

// 计算属性
const canSelect = (order) => {
  return ['待处理', '进行中'].includes(order.status)
}

// 生成试数据数组
const TEST_ORDERS = Array(20).fill(null).map((_, index) => {
  // 随机状态
  const statusList = ['待处理', '进行中', '已完成']
  const status = statusList[Math.floor(index / 7)] // 大致平均分配状态
  
  // 随机时间
  const timeOffset = status === '待处理' ? 
    Math.floor(Math.random() * 30) : // 最近30分钟
    status === '进行中' ? 
      Math.floor(Math.random() * 120) + 30 : // 30-150分钟前
      Math.floor(Math.random() * 24 * 60) + 150 // 2.5小时到1天前
  
  // 随机菜品
  const dishes = [
    { name: '红烧肉', price: 15 },
    { name: '宫保鸡丁', price: 16 },
    { name: '鱼香肉丝', price: 14 },
    { name: '麻婆豆腐', price: 12 },
    { name: '青椒肉丝', price: 13 },
    { name: '回锅肉', price: 15 },
    { name: '水煮肉片', price: 18 },
    { name: '糖醋里脊', price: 16 }
  ]
  
  // 随机规格
  const specs = ['常规份量', '加量', '微辣', '特辣']
  
  // 随机选择1-2个菜品
  const dishCount = Math.floor(Math.random() * 2) + 1
  const selectedDishes = dishes
    .sort(() => Math.random() - 0.5)
    .slice(0, dishCount)
    .map((dish, i) => ({
      id: index * 10 + i * 2 + 1,
      name: dish.name,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: dish.price,
      specs: specs[Math.floor(Math.random() * specs.length)]
    }))
  
  // 添加米饭
  selectedDishes.push({
    id: index * 10 + dishCount * 2,
    name: '米饭',
    quantity: Math.floor(Math.random() * 2) + 1,
    price: 2,
    specs: Math.random() > 0.5 ? '常规份量' : '大份'
  })
  
  // 计算总价
  const total = selectedDishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0)
  
  // 随机备注
  const remarks = ['不要辣', '少放盐', '打包带走', '加饭', '多放点青菜', '']
  
  return {
    id: String(index + 1),
    orderNo: `DD${dayjs().format('YYYYMMDD')}${String(index + 1).padStart(3, '0')}`,
    status,
    createTime: dayjs().subtract(timeOffset, 'minute').valueOf(),
    studentName: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'][Math.floor(Math.random() * 8)],
    studentId: `2024${String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0')}`,
    diningType: Math.random() > 0.5 ? '堂食' : '外带',
    items: selectedDishes,
    total,
    isNew: status === '待处理' && Math.random() > 0.7,
    remark: remarks[Math.floor(Math.random() * remarks.length)],
    expanded: false
  }
})

// 按创建时间排序
TEST_ORDERS.sort((a, b) => b.createTime - a.createTime)

// 修改 fetchOrders 函数
const fetchOrders = async (reset = false) => {
  if (loading.value) return
  
  try {
    loading.value = true
    if (reset) {
      page.value = 1
      orders.value = []
      noMore.value = false
    }

    // 修改状态映射
    const statusMap = {
      'pending': '待处理',
      'processing': '进行中',
      'completed': '已完成'  // 确保这个值与测试数据中的状态一致
    }
    
    const filteredOrders = TEST_ORDERS.filter(order => 
      order.status === statusMap[activeStatus.value]
    )
    
    // 修改分页逻辑
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    const pageOrders = filteredOrders.slice(start, end)
    
    // 直接赋值，不再使用 push
    orders.value = pageOrders

    // 设置总数据量
    total.value = filteredOrders.length
    
    // 判断是否还有更多数据
    noMore.value = end >= filteredOrders.length
    
  } catch (error) {
    console.error(error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 修改分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchOrders(true)
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchOrders(true)
}

// 修改状态化的监听
watch(activeStatus, () => {
  currentPage.value = 1
  pageSize.value = 10
  fetchOrders(true)
})

// 移除 loadMore 函数，因为我们使用分页器来加载数据
const loadMore = () => {}

// 格式化时间
const formatTime = (timestamp) => {
  return dayjs(timestamp).format('HH:mm:ss')
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    '待处理': 'warning',
    '进行': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return types[status] || 'info'
}

// 处理单个订单
const handleAccept = async (order) => {
  try {
    await ElMessageBox.confirm('确定接受此订单吗？')
    // TODO: 调用API接受订单
    order.status = '进行中'
    ElMessage.success('已接单')
  } catch {}
}

const handleReject = async (order) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入拒绝原因', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    if (reason) {
      // TODO: 调用API拒绝单
      order.status = '已取消'
      ElMessage.success('已拒绝订单')
    }
  } catch {}
}

const handleComplete = async (order) => {
  try {
    await ElMessageBox.confirm('确定完成此订单吗？')
    // TODO: 调用API完成订单
    order.status = '已完成'
    ElMessage.success('订单已完成')
  } catch {}
}

// 批量处理订单
const handleBatchAccept = async () => {
  try {
    await ElMessageBox.confirm(`确定接受选中的 ${selectedOrders.value.length} 个订单吗？`)
    // TODO: 调用API批量接受订单
    orders.value.forEach(order => {
      if (selectedOrders.value.includes(order.id)) {
        order.status = '进行中'
      }
    })
    selectedOrders.value = []
    ElMessage.success('批量接单成功')
  } catch {}
}

const handleBatchComplete = async () => {
  try {
    await ElMessageBox.confirm(`确定完成选中的 ${selectedOrders.value.length} 个订单吗？`)
    // TODO: 调用API批量完成订单
    orders.value.forEach(order => {
      if (selectedOrders.value.includes(order.id)) {
        order.status = '已完成'
      }
    })
    selectedOrders.value = []
    ElMessage.success('批量完成订单成功')
  } catch {}
}

// 监听新订单
const listenNewOrders = () => {
  // TODO: 实现WebSocket连接，监听新订单
  // 模拟新订单通知
  setInterval(() => {
    if (Math.random() > 0.3 && activeStatus.value === 'pending') {
      const newOrder = {
        id: `new-${Date.now()}`,
        orderNo: `DD${dayjs().format('YYYYMMDD')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        status: '待处理',
        createTime: Date.now(),
        items: [
          { id: 1, name: '红烧肉', quantity: 1, price: 15 },
          { id: 2, name: '米饭', quantity: 1, price: 2 }
        ],
        total: 17,
        isNew: true
      }
      orders.value.unshift(newOrder)
      pendingCount.value++
      
      // 播放提示音
      const audio = new Audio(notificationSound)
      audio.play()
    }
  }, 500000)
}

// 生命周期钩子
onMounted(() => {
  fetchOrders(true)
  listenNewOrders()
  updateTodayStats()
})

// 监听状变化
watch(activeStatus, () => {
  if (activeStatus.value === 'pending') {
    pendingCount.value = 0
  }
})

// 处理选择变化
const handleSelectionChange = (values) => {
  selectedOrders.value = values
}

// 处理搜索
const handleSearch = () => {
  // 重置筛选条件
  filterType.value = ''
  filterValue.value = ''
  dateRange.value = []
  priceRange.value = {
    min: null,
    max: null
  }
  
  // 重置分页
  currentPage.value = 1
  fetchOrders(true)
}

// 添加触觉反馈函数
const triggerHapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

// 在订单状态变更时添加声音提示
const handleStatusChange = async (order, newStatus) => {
  try {
    await updateOrderStatus(order.id, newStatus);
    const audio = new Audio(statusChangeSound);
    audio.play();
    triggerHapticFeedback();
    ElMessage.success('订单状态已更新');
  } catch (error) {
    ElMessage.error('更新���败');
  }
}

const toggleExpand = (order) => {
  if (!order.expanded) {
    // 关闭其他展开的订单
    orders.value.forEach(o => {
      if (o.id !== order.id) {
        o.expanded = false
      }
    })
  }
  order.expanded = !order.expanded
}

const getOrderActivities = (order) => {
  // 这里可以根据实际需求返回订单的活动记录
  return [
    {
      time: order.createTime,
      content: '订单创建',
      type: 'primary'
    },
    ...(order.status === '待处理' ? [] : [{
      time: order.createTime + 60000,
      content: '商家接单',
      type: 'success'
    }]),
    ...(order.status === '已完成' ? [{
      time: order.createTime + 300000,
      content: '订单完成',
      type: 'success'
    }] : [])
  ]
}

// 批量处理订单
const handleBatchAction = async (command) => {
  if (!selectedOrders.value.length) {
    ElMessage.warning('请先选择订单')
    return
  }
  
  switch (command) {
    case 'print':
      await handleBatchPrint()
      break
    case 'export':
      await handleBatchExport()
      break
    case 'delete':
      await handleBatchDelete()
      break
  }
}

// 批量打印
const handleBatchPrint = async () => {
  try {
    const selectedOrdersList = orders.value.filter(order => 
      selectedOrders.value.includes(order.id)
    )
    
    const printContent = selectedOrdersList.map(order => `
      订单号：${order.orderNo}
      下单时间：${formatTime(order.createTime)}
      客户信息：${order.studentName} (${order.studentId})
      菜品明细：
      ${order.items.map(item => `${item.name} x${item.quantity} ¥${item.price}`).join('\n')}
      总计：¥${order.total}
      ----------------------------------------
    `).join('\n')
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <pre style="font-family: monospace; padding: 20px;">
        ${printContent}
      </pre>
    `)
    printWindow.print()
    printWindow.close()
    
    ElMessage.success('批量打印成功')
  } catch (error) {
    ElMessage.error('批量打印失败')
  }
}

// 批量导出
const handleBatchExport = async () => {
  try {
    const selectedOrdersList = orders.value.filter(order => 
      selectedOrders.value.includes(order.id)
    )
    
    // 创建CSV内容
    const csvContent = [
      ['订单号', '下单时间', '客户姓名', '学号', '订单状态', '用餐方式', '总金额'].join(','),
      ...selectedOrdersList.map(order => [
        order.orderNo,
        formatTime(order.createTime),
        order.studentName,
        order.studentId,
        order.status,
        order.diningType,
        order.total
      ].join(','))
    ].join('\n')
    
    // 创建下载接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `订单导出_${dayjs().format('YYYYMMDD_HHmmss')}.csv`
    link.click()
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedOrders.value.length} 个订单吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用API批量删除订单
    orders.value = orders.value.filter(order => 
      !selectedOrders.value.includes(order.id)
    )
    selectedOrders.value = []
    
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 按日期对已完成订单进行分组
const groupedOrders = computed(() => {
  if (activeStatus.value !== 'completed') return []
  
  // 按日期分组
  const groups = orders.value.reduce((acc, order) => {
    const date = dayjs(order.createTime).format('YYYY-MM-DD')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(order)
    return acc
  }, {})
  
  // 转换为数组并排序
  return Object.entries(groups)
    .map(([date, orders]) => ({
      date: formatDate(date),
      orders: orders.sort((a, b) => b.createTime - a.createTime)
    }))
    .sort((a, b) => {
      const dateA = dayjs(a.date, 'YYYY年MM月DD日')
      const dateB = dayjs(b.date, 'YYYY年MM月DD日')
      return dateB.diff(dateA)
    })
})

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = dayjs(dateStr)
  const today = dayjs().startOf('day')
  const yesterday = today.subtract(1, 'day')
  
  if (date.isSame(today, 'day')) {
    return '今天'
  } else if (date.isSame(yesterday, 'day')) {
    return '昨天'
  } else {
    return date.format('YYYY年MM月DD日')
  }
}

// 处理筛选类型变化
const handleFilterTypeChange = () => {
  // 重置筛选值
  filterValue.value = ''
  dateRange.value = []
  priceRange.value = {
    min: null,
    max: null
  }
  
  // 重置搜索框
  searchQuery.value = ''
  
  // 重新获取订单列表
  fetchOrders(true)
}

// 修改筛选处理函数
const handleFilter = () => {
  if (filterType.value === 'total') {
    // 处理金额范围筛���
    if (priceRange.value.max && priceRange.value.min > priceRange.value.max) {
      ElMessage.warning('最小金额不能大于最大金额')
      return
    }
  }
  
  // 重置搜索框
  searchQuery.value = ''
  
  // 重置分页
  currentPage.value = 1
  fetchOrders(true)
}

// 修改 getDishImage 函数
const getDishImage = (dishName) => {
  // 使用在线食物图片用于测试
  const imageMap = {
    '红烧肉': 'https://img.zcool.cn/community/01a9445d54c65da801211d53235317.jpg',
    '宫保鸡丁': 'https://img.zcool.cn/community/01f8c65d54c65da801211d532386f7.jpg',
    '鱼香肉丝': 'https://img.zcool.cn/community/0120465d54c65da801211d532343b4.jpg',
    '麻婆豆腐': 'https://img.zcool.cn/community/01c3c25d54c65da801211d5323cf41.jpg',
    '青椒肉丝': 'https://img.zcool.cn/community/01d9d95d54c65da801211d532358f4.jpg',
    '回锅肉': 'https://img.zcool.cn/community/01d2fd5d54c65da801211d53236875.jpg',
    '水煮肉片': 'https://img.zcool.cn/community/01b5fd5d54c65da801211d53234c67.jpg',
    '糖醋里脊': 'https://img.zcool.cn/community/01f9d65d54c65da801211d53237dc3.jpg'
  }
  
  // 如果没有对应的图片，返回一个默认的食物图片
  return imageMap[dishName] || 'https://img.zcool.cn/community/01311f5d54c65da801211d53231984.jpg'
}

// 添加打印处理函数
const handlePrint = async (order) => {
  try {
    // TODO: 实现打印逻辑
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <pre style="font-family: monospace; padding: 20px;">
        订单号：${order.orderNo}
        下单时间：${formatTime(order.createTime)}
        客户信息：${order.studentName} (${order.studentId})
        
        菜品明细：
        ${order.items.map(item => `${item.name} x${item.quantity} ¥${item.price}`).join('\n')}
        
        总计：¥${order.total}
      </pre>
    `)
    printWindow.print()
    printWindow.close()
    
    ElMessage.success('打印成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('打印失败')
  }
}

</script>

<style scoped>
.mobile-orders {
  padding: 0 0px 20px;
  margin-top: -80px;
}

.tabs-wrapper {
  position: relative;
  background: #fff;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 99;
}

/* 为固定定位的tabs添加内容偏移 */
.filter-toolbar {
  margin-top: 108px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.batch-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.selected-count {
  font-size: 14px;
  color: #606266;
}

.batch-actions {
  display: flex;
  gap: 10px;
}

.order-card {
  margin-bottom: 10px;
}

.order-card.new-order {
  animation: highlight 2s ease-in-out;
}

@keyframes highlight {
  0% { background-color: #ecf5ff; }
  100% { background-color: #fff; }
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  gap: 8px;
}

.order-basic-info {
  flex: 1;
  min-width: 0;
  padding-right: 0;
}

.order-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.order-info-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  max-width: calc(100% - 70px);
}

.order-no {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
}

.order-time {
  font-size: 12px;
  color: #909399;
}

.dining-type {
  font-size: 12px;
  min-width: 48px;
  text-align: center;
}

.order-items {
  margin-bottom: 10px;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.items-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
  padding: 0 8px;
}

.order-items-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px;
}

.order-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ebeef5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.item-image img:hover {
  transform: scale(1.05);
}

/* 添加图片加载中的位样式 */
.item-image::before {
  content: '';
  display: block;
  padding-top: 100%;
}

/* 添加图片加载失败的样式 */
.item-image img:not([src]),
.item-image img[src=""] {
  opacity: 0;
}

.item-image img:not([src]) + .placeholder,
.item-image img[src=""] + .placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #909399;
  font-size: 12px;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.item-specs {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.item-price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.item-quantity {
  color: #606266;
  font-size: 13px;
}

.item-price {
  color: #f56c6c;
  font-weight: 500;
  font-size: 14px;
}

.order-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  gap: 8px;
}

.order-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.total-price {
  color: #f56c6c;
  font-weight: bold;
}

.load-more {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 10px 0;
}

/* 适配 iPhone 底部安区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-orders {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
}

/* 学生信息样式 */
.customer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ebeef5;
}

.student-id {
  color: #909399;
  font-size: 12px;
}

/* 菜品列表样式 */
.items-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.item-name {
  font-size: 14px;
  color: #303133;
}

.item-specs {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.item-quantity {
  color: #606266;
}

/* 订单备注样式 */
.order-remark {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 订单价样式 */
.total-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 搜索栏样式 */
.search-bar {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  gap: 10px;
}

.search-bar .el-input {
  flex: 1;
}

.search-bar .el-button {
  flex-shrink: 0;
  min-width: 80px;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .search-bar {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .search-bar .el-button {
    min-width: 70px;
    font-size: 13px;
  }
}

@media screen and (max-width: 360px) {
  .search-bar {
    padding: 6px 10px;
    gap: 6px;
  }
  
  .search-bar .el-button {
    min-width: 60px;
    font-size: 12px;
  }
}

/* 筛选抽屉式 */
.filter-content {
  padding: 15px;
}

.order-card {
  position: relative;
  touch-action: pan-y;
}

.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  transform: translateX(100%);
  transition: transform 0.3s;
}

.swipe-actions.visible {
  transform: translateX(0);
}

/* 展开按钮样式优化 */
.expand-btn {
  padding: 4px 8px;
  height: 36px;
  line-height: 28px;
  font-size: var(--tab-font-size);
  display: inline-flex;
  align-items: center;
  color: #909399;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 64px;
  justify-content: flex-end;
}

.expand-icon {
  margin-left: 4px;
  font-size: 12px;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
}

/* 展开内容区域样式 */
.order-expand-content {
  margin-top: 10px;
  padding: 0 15px;
  border-top: 1px solid #f0f0f0;
}

.timeline {
  padding: 15px 0;
}

.timeline-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

/* 优化时间线样式 */
:deep(.el-timeline-item__node) {
  background-color: var(--el-color-primary);
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 12px;
}

/* 统计卡片样式 */
.stats-cards {
  margin-top: 4px;
  margin-bottom: 12px;
}

.stat-card {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 日期分组样式 */
.order-group {
  margin-bottom: 20px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.date-text {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.order-count {
  font-size: 12px;
  color: #909399;
}

/* 筛选工具栏样式 */
.filter-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #fff;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.price-range :deep(.el-input-number) {
  width: 120px;
}

/* 响应式调整 */
@media screen and (max-width: 480px) {
  .filter-toolbar {
    gap: 8px;
  }
  
  .filter-toolbar .el-select,
  .filter-toolbar .el-input {
    width: 100% !important;
  }
  
  .price-range {
    width: 100%;
    justify-content: space-between;
  }
}

/* 修改订单信息布局样式 */
.order-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
}

.order-info-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
    max-width: calc(100% - 70px);
}

/* 优化订单号显示 */
.order-no {
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
}

/* 状态标签样��优化 */
.order-info .el-tag {
    flex-shrink: 0;
    min-width: 64px;
    text-align: center;
}

/* 复选框容器样式 */
.el-checkbox {
    flex-shrink: 0;
    margin-right: 8px;
}

/* 移动端特别优化 */
@media screen and (max-width: 400px) {
    .order-info {
        gap: 4px;
    }

    .order-info-left {
        max-width: calc(100% - 60px);
    }

    .order-no {
        font-size: 13px;
    }

    .order-info .el-tag {
        min-width: 56px;
        padding: 0 4px;
    }

    .el-checkbox {
        margin-right: 4px;
        transform: scale(0.9);
    }
}

/* 超屏幕适配 */
@media screen and (max-width: 320px) {
    .order-info {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
    }

    .order-info-left {
        max-width: 100%;
    }

    .order-info .el-tag {
        align-self: flex-start;
    }
}

/* 基础样式 */
.order-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
}

.order-info-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
    max-width: calc(100% - 70px);
}

.order-no {
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
}

/* 响应式文字大小调整 */
@media screen and (max-width: 480px) {
    .order-no {
        font-size: 13px;
    }
    
    .order-info .el-tag {
        font-size: 12px;
        min-width: 56px;
        padding: 0 4px;
    }
}

@media screen and (max-width: 400px) {
    .order-no {
        font-size: 12px;
    }
    
    .order-info .el-tag {
        font-size: 11px;
        min-width: 52px;
        padding: 0 2px;
    }
    
    .order-info-left {
        max-width: calc(100% - 56px);
    }
    
    .el-checkbox {
        transform: scale(0.85);
        margin-right: 2px;
    }
}

@media screen and (max-width: 375px) {
    .order-no {
        font-size: 11px;
    }
    
    .order-info .el-tag {
        font-size: 10px;
        min-width: 48px;
    }
    
    .order-info-left {
        max-width: calc(100% - 52px);
    }
}

@media screen and (max-width: 360px) {
    .order-card-header {
        padding: 8px 10px;
    }
    
    .order-no {
        font-size: 10px;
    }
    
    .order-info .el-tag {
        font-size: 10px;
        min-width: 44px;
        height: 20px;
        line-height: 18px;
    }
    
    .order-info-left {
        max-width: calc(100% - 48px);
    }
    
    .el-checkbox {
        transform: scale(0.8);
        margin-right: 1px;
    }
}

/* 订单卡片整体布局优化 */
.order-card-header {
    padding: 10px 12px;
}

.order-basic-info {
    flex: 1;
    min-width: 0;
    padding-right: 0;
}

/* 确保标签样式统一 */
.order-info .el-tag {
    flex-shrink: 0;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    line-height: 20px;
    transition: all 0.2s;
}

/* 标签页基础样式优化 */
.el-tabs {
    --tab-font-size: 14px;
    margin: 0 8px;
}

.el-tabs :deep(.el-tabs__nav-wrap) {
    padding: 0 4px;
}

.el-tabs :deep(.el-tabs__item) {
    font-size: var(--tab-font-size);
    height: 36px;
    line-height: 36px;
    padding: 0 16px;
    text-align: center;
}

/* 调整标签页内容对齐 */
.el-tabs :deep(.el-tabs__nav) {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.el-tabs :deep(.el-tabs__item.is-active) {
    font-weight: 500;
}

/* 徽标位置调整 */
.el-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.el-badge :deep(.el-badge__content) {
    font-size: calc(var(--tab-font-size) - 2px);
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
    border: none;
    transform-origin: right top;
    top: 8px;
    right: -8px;
}

/* 展开按钮样式对齐 */
.expand-btn {
    padding: 4px 8px;
    height: 36px;
    line-height: 28px;
    font-size: var(--tab-font-size);
    display: inline-flex;
    align-items: center;
    color: #909399;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 64px;
    justify-content: flex-end;
}

.expand-icon {
    margin-left: 4px;
    font-size: 12px;
    transition: transform 0.3s;
    flex-shrink: 0;
}

/* 响应式调整 */
@media screen and (max-width: 480px) {
    .el-tabs {
        --tab-font-size: 13px;
        margin: 0 6px;
    }
    
    .el-tabs :deep(.el-tabs__item) {
        padding: 0 12px;
    }
}

@media screen and (max-width: 400px) {
    .el-tabs {
        --tab-font-size: 12px;
        margin: 0 4px;
    }
    
    .el-tabs :deep(.el-tabs__item) {
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
    }
    
    .expand-btn {
        height: 32px;
        line-height: 24px;
    }
}

@media screen and (max-width: 375px) {
    .el-tabs {
        --tab-font-size: 11px;
        margin: 0 3px;
    }
    
    .el-tabs :deep(.el-tabs__item) {
        padding: 0 8px;
        height: 30px;
        line-height: 30px;
    }
    
    .expand-btn {
        height: 30px;
        line-height: 22px;
    }
}

@media screen and (max-width: 360px) {
    .el-tabs {
        --tab-font-size: 10px;
        margin: 0 2px;
    }
    
    .el-tabs :deep(.el-tabs__item) {
        padding: 0 6px;
    }
    
    .expand-btn {
        padding: 4px 6px;
    }
}

/* 添加分页容器样式 */
.pagination-container {
  margin: 15px 0;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .pagination-container {
    padding: 10px;
  }
  
  .pagination-container :deep(.el-pagination) {
    font-size: 12px;
  }
  
  .pagination-container :deep(.el-pagination .el-select) {
    margin: 0 5px;
  }
  
  .pagination-container :deep(.el-pagination button) {
    min-width: 28px;
  }
}

.tabs-wrapper {
  position: relative;
  background: #fff;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-tabs {
  flex: 1;
  margin-right: 100px;
}

.order-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.order-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 12px;
}

.history-entry {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  white-space: nowrap;
}

.history-entry .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  height: 32px;
  padding: 0 12px;
}

.history-entry .el-icon {
  font-size: 16px;
}

/* 移动端适配 */
@media screen and (max-width: 375px) {
  .order-tabs {
    margin-right: 80px;
  }
  
  .history-entry .el-button {
    font-size: 12px;
    padding: 0 8px;
  }
}
</style> 
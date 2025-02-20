<template>
  <div class="mobile-orders">
    <!-- 商家控制功能区域 -->
    <div class="window-control">
      <div class="window-info">
        <!-- 餐厅位置信息和营业时间 -->
        <div class="header-top">
          <div class="location-info clickable" @click="handleEditLocation">
            <el-icon><Location /></el-icon>
            <span class="canteen-name">{{ windowInfo.canteen.name }}</span>
            <el-divider direction="vertical" />
            <span class="floor-info">{{ windowInfo.floor }}层</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
          <div class="operation-time clickable" @click="handleEditTime">
            <el-icon><Timer /></el-icon>
            <span>{{ windowInfo.operatingHours }}</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
        </div>
        
        <!-- 窗口名称和状态 -->
        <div class="header-bottom">
          <span class="window-name clickable" @click="handleEditName">
            {{ windowInfo.name }}
            <el-icon class="edit-icon"><Edit /></el-icon>
          </span>
          <div class="status-controls">
            <el-tag size="small" :type="windowInfo.status === 'open' ? 'success' : 'danger'">
              {{ windowInfo.status === 'open' ? '营业中' : '已打烊' }}
            </el-tag>
            <el-switch
              v-model="windowStatus"
              active-text="营业"
              inactive-text="打烊"
              @change="handleWindowStatusChange"
              class="status-switch"
              :style="{
                '--el-switch-on-color': '#07c160',
                '--el-switch-off-color': 'rgba(0,0,0,0.25)'
              }"
            />
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
          </div>
        </div>
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

    <!-- 原有的订单管理内容 -->
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

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-area">
      <!-- 搜索栏 -->
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

      <!-- 筛选工具栏 -->
      <div class="filter-toolbar">
        <div class="toolbar-left">
          <el-select
            v-model="filterType"
            placeholder="筛选条件"
            size="small"
            style="width: 120px"
            @change="handleFilterTypeChange"
            clearable
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

          <!-- 添加重置按钮 -->
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

    <!-- 移动分页器到这里 -->
    <div class="auto-accept-controls">
      <div class="auto-accept-switch">
        <el-switch
          v-model="autoAcceptEnabled"
          active-text="自动接单"
          @change="handleAutoAcceptChange"
        />
        <el-select
          v-if="autoAcceptEnabled"
          v-model="autoNotifyType"
          placeholder="提醒方式"
          size="small"
          style="width: 120px; margin-left: 10px;"
        >
          <el-option label="声音提醒" value="sound" />
          <el-option label="桌面通知" value="desktop" />
          <el-option label="全部提醒" value="all" />
        </el-select>
      </div>
      <div class="auto-accept-actions">
        <!-- 添加全选复选框 -->
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          class="select-all-checkbox"
          :value="true"
        >
          全选
        </el-checkbox>
        <el-button
          type="primary"
          link
          @click="showAutoAcceptSettings = true"
        >
          <el-icon><Setting /></el-icon>
          设置
        </el-button>
      </div>
    </div>

    <!-- 添加自动接单设置抽屉 -->
    <el-drawer
      v-model="showAutoAcceptSettings"
      title="自动接单设置"
      direction="rtl"
      size="90%"
      :with-header="true"
      class="settings-drawer"
      :modal-class="'settings-drawer-modal'"
      :append-to-body="true"
    >
      <template #header>
        <h4 class="drawer-title">自动接单设置</h4>
      </template>
      
      <div class="settings-content">
        <el-scrollbar>
          <el-form label-position="top">
            <el-form-item label="接单时间范围">
              <el-time-picker
                v-model="autoAcceptSettings.timeRange"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="HH:mm"
                class="full-width-input"
              />
            </el-form-item>
            <el-form-item label="最大同时处理订单数">
              <el-input-number
                v-model="autoAcceptSettings.maxOrders"
                :min="1"
                :max="20"
                class="full-width-input"
              />
            </el-form-item>
            <el-form-item label="自动拒单条件">
              <el-checkbox-group v-model="autoAcceptSettings.rejectConditions" class="reject-conditions">
                <el-checkbox value="largeOrder" class="condition-item">订单金额超过限制</el-checkbox>
                <el-checkbox value="specialRequirement" class="condition-item">含有特殊要求</el-checkbox>
                <el-checkbox value="busyHours" class="condition-item">高峰时段</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="订单金额限制" v-if="autoAcceptSettings.rejectConditions.includes('largeOrder')">
              <el-input-number
                v-model="autoAcceptSettings.maxOrderAmount"
                :min="0"
                :step="10"
                class="full-width-input"
              />
            </el-form-item>
            <el-form-item label="高峰时段设置" v-if="autoAcceptSettings.rejectConditions.includes('busyHours')">
              <el-time-select
                v-model="autoAcceptSettings.busyHours"
                :picker-options="{
                  start: '08:00',
                  step: '00:30',
                  end: '20:00'
                }"
                multiple
                placeholder="选择高峰时段"
                class="full-width-input"
              />
            </el-form-item>
            <el-form-item label="智能调节">
              <div class="smart-adjust-wrapper">
                <el-switch
                  v-model="autoAcceptSettings.smartAdjust"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="hint-text" v-if="autoAcceptSettings.smartAdjust">
                  系统将根据历史数据自动调节接单参数
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="showAutoAcceptSettings = false">取消</el-button>
          <el-button type="primary" @click="saveAutoAcceptSettings">保存</el-button>
        </div>
      </template>
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

    <!-- 分页器容器样式 -->
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

    <!-- 加载状态 -->
    <div class="load-more" v-if="loading || noMore">
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多订单了</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import notificationSound from '@/mp3/叮咚.mp3'
import { User, InfoFilled, Search, Filter, ArrowDown, ArrowUp, Printer, Calendar, Setting, RefreshLeft, Location, Timer, Edit, SwitchButton, Delete, Plus } from '@element-plus/icons-vue'
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

// 自动接单相关状态
const autoAcceptEnabled = ref(false)
const autoNotifyType = ref('sound')
const showAutoAcceptSettings = ref(false)
const autoAcceptSettings = ref({
  timeRange: [new Date(2000, 1, 1, 8, 0), new Date(2000, 1, 1, 20, 0)],
  maxOrders: 5,
  rejectConditions: [],
  maxOrderAmount: 100
})

// 添加全选相关状态
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const isSelectingAll = ref(false)

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
  if (!filterType.value || (!filterValue.value && filterType.value !== 'total' && filterType.value !== 'date')) {
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
      'completed': '已完成'
    }
    
    // 先应用状态筛选
    let filteredOrders = TEST_ORDERS.filter(order => 
      order.status === statusMap[activeStatus.value]
    )
    
    // 应用搜索和筛选条件
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredOrders = filteredOrders.filter(order => 
        order.orderNo.toLowerCase().includes(query) ||
        order.studentName.toLowerCase().includes(query)
      )
    }
    
    // 应用其他筛选条件
    if (filterType.value) {
      filteredOrders = filteredOrders.filter(order => {
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
    }
    
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
    ElMessage.error('更新失败');
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
    // 处理金额范围筛选
    if (priceRange.value.max && priceRange.value.min > priceRange.value.max) {
      ElMessage.warning('最小金额不能大于最大金额')
      return
    }
  }
  
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

// 处理自动接单开关变化
const handleAutoAcceptChange = (value) => {
  if (value) {
    ElMessageBox.confirm(
      '开启自动接单后，系统将按照设置的条件自动处理新订单。是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 启动自动接单逻辑
      startAutoAccept()
    }).catch(() => {
      autoAcceptEnabled.value = false
    })
  } else {
    stopAutoAccept()
  }
}

// 启动自动接单
const startAutoAccept = () => {
  ElMessage.success('自动接单已开启')
  // TODO: 实现自动接单逻辑
}

// 停止自动接单
const stopAutoAccept = () => {
  ElMessage.info('自动接单已关闭')
  // TODO: 清理自动接单相关资源
}

// 添加数据缓存
const orderCache = new Map()

// 添加智能排序
const sortedOrders = computed(() => {
  return orders.value.sort((a, b) => {
    // 优先级排序
    if (a.priority !== b.priority) return b.priority - a.priority
    // 等待时间排序
    return a.createTime - b.createTime
  })
})

// 添加订单分析
const orderAnalytics = computed(() => {
  return {
    avgProcessTime: calculateAvgProcessTime(orders.value),
    peakHours: analyzePeakHours(orders.value),
    popularDishes: analyzePopularDishes(orders.value)
  }
})

// 监听选择变化
watch(selectedOrders, (val) => {
  const checkedCount = val.length
  const totalCount = orders.value.length
  isAllSelected.value = checkedCount === totalCount && totalCount > 0
  isIndeterminate.value = checkedCount > 0 && checkedCount < totalCount
})

// 处理全选变化
const handleCheckAllChange = async (val) => {
  isSelectingAll.value = true
  try {
    if (val) {
      // 如果是全选操作
      if (filteredOrders.value.length >= 100) {
        // 如果数据量较大，提示用户
        const confirm = await ElMessageBox.confirm(
          `当前筛选条件下共有 ${total.value} 条数据，是否全部选择？`,
          '提示',
          {
            confirmButtonText: '全选',
            cancelButtonText: '仅选择当前页',
            type: 'warning'
          }
        )
        
        if (confirm) {
          // 全选所有数据
          const allOrders = await fetchAllOrders() // 需要实现这个方法来获取所有数据
          selectedOrders.value = allOrders.map(order => order.id)
          ElMessage.success(`已选择全部 ${total.value} 条数据`)
        } else {
          // 仅选择当前页
          selectedOrders.value = orders.value.map(order => order.id)
          ElMessage.success(`已选择当前页 ${orders.value.length} 条数据`)
        }
      } else {
        // 数据量较小，直接全选
        selectedOrders.value = orders.value.map(order => order.id)
      }
    } else {
      // 取消全选
      selectedOrders.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  } finally {
    isSelectingAll.value = false
  }
}

// 获取所有订单数据的方法
const fetchAllOrders = async () => {
  loading.value = true
  try {
    // 这里需要调用后端接口获取所有数据
    // 临时使用测试数据
    const allOrders = TEST_ORDERS.filter(order => {
      // 根据当前筛选条件过滤
      if (activeStatus.value === 'pending') return order.status === '待处理'
      if (activeStatus.value === 'processing') return order.status === '进行中'
      if (activeStatus.value === 'completed') return order.status === '已完成'
      return true
    })
    return allOrders
  } catch (error) {
    ElMessage.error('获取数据失败')
    return []
  } finally {
    loading.value = false
  }
}

// 修改批量处理相关方法
const handleBatchCommand = async (command) => {
  switch (command) {
    case 'selectAll':
      handleCheckAllChange(true)
      break
    // ... existing cases ...
  }
}

// 重置筛选条件
const handleResetFilter = () => {
  // 重置所有筛选相关的状态
  filterType.value = ''
  filterValue.value = ''
  dateRange.value = []
  priceRange.value = {
    min: null,
    max: null
  }
  searchQuery.value = ''
  
  // 重置分页
  currentPage.value = 1
  
  // 重新获取订单数据
  fetchOrders(true)
  
  // 提示用户
  ElMessage.success('筛选条件已重置')
}

// 判断是否有活动筛选条件
const hasActiveFilters = computed(() => {
  return Boolean(
    filterType.value || 
    filterValue.value || 
    (dateRange.value && dateRange.value.length) || 
    priceRange.value.min !== null || 
    priceRange.value.max !== null ||
    searchQuery.value
  )
})

// 保存自动接单设置
const saveAutoAcceptSettings = async () => {
  try {
    // TODO: 调用API保存设置
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('设置已保存')
    showAutoAcceptSettings.value = false
  } catch (error) {
    ElMessage.error('保存设置失败')
  }
}

// 添加窗口控制相关的数据和方法
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

// 窗口编辑对话框数据
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

// 餐厅数据
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

// 处理窗口状态切换
const handleWindowStatusChange = async (value) => {
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

// 添加编辑处理函数
const handleEditLocation = () => {
  editDialogVisible.value = true
  nextTick(() => {
    const canteenSelect = document.querySelector('.window-edit-form .el-select')
    if (canteenSelect) {
      canteenSelect.click()
    }
  })
}

const handleEditName = () => {
  editDialogVisible.value = true
  nextTick(() => {
    const nameInput = document.querySelector('.window-edit-form input[placeholder="请输入窗口名称"]')
    if (nameInput) {
      nameInput.focus()
    }
  })
}

const handleEditTime = () => {
  editDialogVisible.value = true
  nextTick(() => {
    const timeSection = document.querySelector('.time-periods-container')
    if (timeSection) {
      timeSection.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 添加时间段相关方法
const addPeriod = () => {
  editForm.value.operatingPeriods.push({
    startTime: new Date(2000, 0, 1, 10, 0),
    endTime: new Date(2000, 0, 1, 22, 0)
  })
}

const removePeriod = (index) => {
  editForm.value.operatingPeriods.splice(index, 1)
}

// 添加图片上传相关
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

// 在mounted中添加获取窗口信息
onMounted(() => {
  fetchWindowInfo()
})
</script>

<style scoped>
.mobile-orders {
  padding: 0 0px 20px;
  margin-top: -80px;
}

/* 窗口编辑对话框样式 */
:deep(.el-dialog) {
  margin: 0 auto !important;
  position: fixed !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, calc(-50% - 400px)) !important;
  max-height: 90vh !important;
  width: 90% !important;
  display: flex;
  flex-direction: column;
}

:deep(.el-dialog__body) {
  overflow-y: auto !important;
  max-height: calc(90vh - 120px) !important;
  padding: 20px !important;
}

:deep(.el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #f0f0f0;
  padding: 15px 20px;
}

:deep(.el-overlay) {
  position: fixed;
  top: 0 !important;
  height: 100% !important;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95% !important;
    max-height: 85vh !important;
  }

  :deep(.el-dialog__body) {
    padding: 15px !important;
    max-height: calc(85vh - 110px) !important;
  }
}

.tabs-wrapper {
  position: relative;
  background: #fff;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 99;
  margin-top: -50px;
}

/* 为固定定位的tabs添加内容偏移 */
.filter-toolbar {
  margin-top: 20px;
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
  touch-action: pan-y;
  position: relative;
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
  margin-top: 10px;
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

/* 状态标签样式优化 */
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
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container :deep(.el-pagination) {
  justify-content: center;
  white-space: nowrap;
  padding: 0;
}

.pagination-container :deep(.el-pagination.is-background) .btn-next,
.pagination-container :deep(.el-pagination.is-background) .btn-prev,
.pagination-container :deep(.el-pagination.is-background) .el-pager li {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  margin: 0 4px;
}

.pagination-container :deep(.el-pagination.is-background) .el-pager li:not(.disabled).active {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.pagination-container :deep(.el-pagination .el-select .el-input) {
  width: 110px;
}

.pagination-container :deep(.el-pagination__sizes) {
  margin-right: 15px;
}

.pagination-container :deep(.el-pagination__total) {
  margin-right: 15px;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .pagination-container {
    padding: 10px;
  }

  .pagination-container :deep(.el-pagination) {
    font-size: 13px;
  }

  .pagination-container :deep(.el-pagination__sizes) {
    margin-right: 8px;
  }

  .pagination-container :deep(.el-pagination__total) {
    margin-right: 8px;
  }

  .pagination-container :deep(.el-pagination.is-background) .btn-next,
  .pagination-container :deep(.el-pagination.is-background) .btn-prev,
  .pagination-container :deep(.el-pagination.is-background) .el-pager li {
    min-width: 30px;
    margin: 0 2px;
  }

  .pagination-container :deep(.el-pagination .el-select .el-input) {
    width: 90px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
  .pagination-container {
    padding: 8px;
  }

  .pagination-container :deep(.el-pagination) {
    font-size: 12px;
  }

  .pagination-container :deep(.el-pagination__sizes) {
    margin-right: 6px;
  }

  .pagination-container :deep(.el-pagination__total) {
    margin-right: 6px;
  }

  .pagination-container :deep(.el-pagination.is-background) .btn-next,
  .pagination-container :deep(.el-pagination.is-background) .btn-prev,
  .pagination-container :deep(.el-pagination.is-background) .el-pager li {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    margin: 0 1px;
  }

  .pagination-container :deep(.el-pagination .el-select .el-input) {
    width: 80px;
  }
}

/* 适配 iPhone 底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .pagination-container {
    padding-bottom: calc(15px + env(safe-area-inset-bottom));
  }
}

.tabs-wrapper {
  position: relative;
  background: #fff;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -20px;
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

/* 自动接单控件样式 */
.auto-accept-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.auto-accept-switch {
  display: flex;
  align-items: center;
}

.auto-accept-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.select-all-checkbox {
  margin: 0;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .auto-accept-controls {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .auto-accept-switch {
    width: 100%;
  }

  .auto-accept-actions {
    width: 100%;
    justify-content: flex-end;
    gap: 12px;
  }
}

/* 确保分页器始终在底部 */
.pagination-container {
  margin-top: auto;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 添加左滑显示快捷操作 */
.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  transform: translateX(100%);
  transition: transform 0.3s;
}

/* 添加下拉刷新样式 */
.pull-refresh {
  --pull-refresh-height: 50px;
  overflow: hidden;
}

/* 优化移动端点击区域 */
.action-button {
  min-height: 44px;
  padding: 12px 20px;
}

.select-all-checkbox {
  margin-right: 16px;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .select-all-checkbox {
    margin-right: 8px;
  }
}

/* 添加加载状态样式 */
.select-all-checkbox :deep(.el-checkbox__input.is-disabled) {
  cursor: wait;
}

.select-all-checkbox :deep(.el-checkbox__input.is-disabled + .el-checkbox__label) {
  cursor: wait;
  color: var(--el-text-color-placeholder);
}

/* 自动接单设置抽屉样式 */
:deep(.settings-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.settings-drawer .el-drawer__body) {
  height: calc(100% - 116px);
  padding: 0;
  overflow: hidden;
  background: #f5f7fa;
}

.drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.settings-content {
  height: 100%;
  background: #fff;
}

:deep(.el-form) {
  padding: 20px;
  background: #fff;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

.full-width-input {
  width: 100%;
}

.reject-conditions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.condition-item {
  margin-right: 0 !important;
}

.smart-adjust-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: 10;
}

/* 适配 iPhone 底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .drawer-footer {
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
  
  :deep(.settings-drawer .el-drawer__body) {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  :deep(.settings-drawer) {
    width: 100% !important;
  }
  
  .drawer-footer {
    padding: 10px 16px;
  }
  
  :deep(.el-form) {
    padding: 16px;
  }
}

:deep(.el-scrollbar) {
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  padding-bottom: 80px;
}

/* 优化抽屉样式，确保正确显示位置 */
:deep(.settings-drawer) {
  top: 108px !important;
  height: calc(100% - 108px) !important;
  border-radius: 16px 0 0 0;
}

:deep(.settings-drawer-modal) {
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.el-overlay) {
  position: fixed;
  top: 108px;
  height: calc(100% - 108px);
}

/* 搜索和筛选区域样式 */
.search-filter-area {
  margin-top: 20px;
  padding: 12px 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.search-bar .el-input {
  flex: 1;
}

.search-bar .el-button {
  flex-shrink: 0;
  min-width: 80px;
}

/* 筛选工具栏样式 */
.filter-toolbar {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.price-range {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.price-range .el-input-number {
  width: 120px;
}

/* 响应式调整 */
@media screen and (max-width: 480px) {
  .search-filter-area {
    margin-top: 15px;
    padding: 10px;
  }

  .search-bar {
    gap: 8px;
  }

  .search-bar .el-button {
    min-width: 60px;
    padding: 0 12px;
  }

  .filter-toolbar {
    padding: 10px;
  }

  .toolbar-left {
    gap: 8px;
  }

  .toolbar-left > * {
    width: 100% !important;
  }

  .price-range {
    width: 100%;
    justify-content: space-between;
  }

  .price-range .el-input-number {
    width: calc(50% - 10px);
  }
}

/* 移动端优化 */
@media screen and (max-width: 375px) {
  .search-filter-area {
    margin-top: 10px;
    padding: 8px;
  }

  .search-bar .el-button {
    font-size: 13px;
  }

  .filter-toolbar {
    padding: 8px;
  }
}

/* 添加窗口控制相关样式 */
.window-control {
  min-height: 56px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffd000, #ffbb00);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  margin-top: 60px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info {
  font-size: 12px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  color: rgba(0,0,0,0.85);
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.location-info .el-icon {
  margin-right: 4px;
  font-size: 14px;
  color: #e17b00;
}

.canteen-name {
  font-weight: 600;
  color: rgba(0,0,0,0.9);
}

.window-name {
  font-size: 18px;
  padding: 2px 8px;
  font-weight: 600;
  color: rgba(0,0,0,0.95);
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(255,255,255,0.2);
  border-radius: 8px;
}

.operation-time {
  font-size: 12px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(0,0,0,0.85);
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  width: fit-content;
}

.operation-time .el-icon {
  color: #e17b00;
}

.clickable {
  cursor: pointer;
  position: relative;
  padding-right: 24px;
  transition: all 0.2s ease;
}

.clickable:hover {
  background: rgba(255, 255, 255, 0.2);
}

.edit-icon {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.clickable:hover .edit-icon {
  opacity: 0.7;
}

/* 窗口编辑对话框样式 */
.window-edit-dialog :deep(.el-dialog) {
  width: 92% !important;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
}

.window-edit-dialog :deep(.el-dialog__header) {
  padding: 20px 20px 12px;
  margin: 0;
  border-bottom: 1px solid #f0f0f0;
}

.window-edit-dialog :deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 16px;
}

.window-edit-dialog :deep(.el-dialog__body) {
  padding: 24px 20px;
}

.window-edit-form {
  margin: 0;
}

.window-image-uploader {
  border: 1px dashed rgba(0,0,0,0.15);
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  transition: all 0.3s ease;
}

.window-image-uploader:hover {
  border-color: #ffa600;
  background: #fffbf0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(0,0,0,0.45);
  transition: transform 0.2s ease;
}

.window-image-uploader:hover .upload-placeholder {
  transform: scale(1.05);
  color: #e17b00;
}

.window-uploader-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.window-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.window-image:hover {
  transform: scale(1.02);
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
  gap: 10px;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.time-period:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transform: translateY(-1px);
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

.time-picker :deep(.el-input__wrapper) {
  background: #f8f9fa;
}

.time-separator {
  color: rgba(0,0,0,0.65);
  flex-shrink: 0;
  font-weight: 500;
}

.delete-time-btn {
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.delete-time-btn:hover {
  transform: scale(1.1);
  color: #ff4d4f;
}

.add-time-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #e17b00;
}

.add-time-btn:hover {
  background: #fff7e6;
  color: #d17100;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
  .window-control {
    padding: 10px 12px;
  }

  .window-name {
    font-size: 16px;
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
    opacity: 0.7;
  }
}

/* 适配 iPhone 底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .window-control {
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
}
</style> 
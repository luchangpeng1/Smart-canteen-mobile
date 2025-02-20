<template>
  <div class="window-manage-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">窗口管理</span>
    </div>

    <div class="window-content">
      <!-- 窗口基本信息 -->
      <div class="window-info-card">
        <div class="window-header">
          <div class="window-title">基本信息</div>
          <el-button type="primary" link @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
        <div class="info-list">
          <div class="info-item">
            <span class="item-label">窗口名称</span>
            <span class="item-value">{{ windowInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="item-label">窗口编号</span>
            <span class="item-value">{{ windowInfo.code }}</span>
          </div>
          <div class="info-item">
            <span class="item-label">所属食堂</span>
            <span class="item-value">{{ windowInfo.canteen }}</span>
          </div>
          <div class="info-item">
            <span class="item-label">经营类型</span>
            <span class="item-value">{{ windowInfo.type }}</span>
          </div>
        </div>
      </div>

      <!-- 营业状态 -->
      <div class="status-card">
        <div class="status-header">
          <div class="status-title">营业状态</div>
          <el-switch
            v-model="windowInfo.isOpen"
            active-text="营业中"
            inactive-text="已打烊"
            @change="handleStatusChange"
            class="status-switch"
          />
        </div>
        <div class="operation-time" v-if="windowInfo.isOpen">
          <el-icon><Timer /></el-icon>
          <span>营业时间：{{ windowInfo.businessHours }}</span>
        </div>
      </div>

      <!-- 窗口图片 -->
      <div class="photos-card">
        <div class="photos-header">
          <div class="photos-title">窗口照片</div>
          <el-button type="primary" link @click="handleUpload">
            <el-icon><Upload /></el-icon>
            上传照片
          </el-button>
        </div>
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in windowInfo.photos" 
            :key="index"
            class="photo-item">
            <el-image 
              :src="photo.url" 
              fit="cover"
              :preview-src-list="windowInfo.photos.map(p => p.url)">
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="photo-actions">
              <el-button 
                type="danger" 
                circle
                size="small"
                @click="handleDeletePhoto(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 窗口介绍 -->
      <div class="description-card">
        <div class="description-header">
          <div class="description-title">窗口介绍</div>
          <el-button type="primary" link @click="handleEditDesc">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
        <div class="description-content">
          {{ windowInfo.description || '暂无介绍' }}
        </div>
      </div>
    </div>

    <!-- 编辑窗口信息对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑窗口信息"
      width="90%"
      :close-on-click-modal="false">
      <el-form
        ref="formRef"
        :model="editForm"
        :rules="rules"
        label-position="top">
        <el-form-item label="窗口名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入窗口名称" />
        </el-form-item>
        <el-form-item label="经营类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择经营类型">
            <el-option
              v-for="type in businessTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="窗口介绍" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入窗口介绍" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSave"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  Timer,
  Upload,
  Picture,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()

// 窗口信息
const windowInfo = reactive({
  name: '大荤窗口',
  code: 'W001',
  canteen: '第一食堂',
  type: '大荤菜',
  isOpen: true,
  businessHours: '10:30 - 13:30',
  description: '主营各类炒菜、炖菜，提供美味可口的大荤菜品。',
  photos: [
    { url: '/photos/window1.jpg' },
    { url: '/photos/window2.jpg' }
  ]
})

// 经营类型选项
const businessTypes = [
  { label: '大荤菜', value: '大荤菜' },
  { label: '小炒', value: '小炒' },
  { label: '面食', value: '面食' },
  { label: '饮品', value: '饮品' },
  { label: '小吃', value: '小吃' }
]

// 编辑表单
const editDialogVisible = ref(false)
const loading = ref(false)
const formRef = ref(null)

const editForm = reactive({
  name: '',
  type: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入窗口名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择经营类型', trigger: 'change' }
  ]
}

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理营业状态改变
const handleStatusChange = async (value) => {
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
    
    // TODO: 调用API更新营业状态
    ElMessage.success(`已${value ? '开始营业' : '打烊'}`)
  } catch {
    // 取消操作，回滚状态
    windowInfo.isOpen = !value
  }
}

// 处理编辑窗口信息
const handleEdit = () => {
  editForm.name = windowInfo.name
  editForm.type = windowInfo.type
  editForm.description = windowInfo.description
  editDialogVisible.value = true
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用API保存窗口信息
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    windowInfo.name = editForm.name
    windowInfo.type = editForm.type
    windowInfo.description = editForm.description
    
    ElMessage.success('保存成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('保存失败：', error)
  } finally {
    loading.value = false
  }
}

// 处理上传照片
const handleUpload = () => {
  // TODO: 实现照片上传功能
  ElMessage.info('照片上传功能开发中')
}

// 处理删除照片
const handleDeletePhoto = async (index) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这张照片吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    windowInfo.photos.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 处理编辑介绍
const handleEditDesc = () => {
  editForm.description = windowInfo.description
  editDialogVisible.value = true
}
</script>

<style scoped>
.window-manage-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: env(safe-area-inset-bottom, 0);
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

.window-content {
  padding: 12px;
}

.window-info-card,
.status-card,
.photos-card,
.description-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.window-header,
.status-header,
.photos-header,
.description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.window-title,
.status-title,
.photos-title,
.description-title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-label {
  font-size: 14px;
  color: #909399;
}

.item-value {
  font-size: 14px;
  color: #2c3e50;
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

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
}

.photo-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-item:hover .photo-actions {
  opacity: 1;
}

.description-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.status-switch .el-switch__label) {
  color: rgba(0,0,0,0.65);
  font-size: 12px;
}

:deep(.status-switch .el-switch__label.is-active) {
  color: #e17b00;
}
</style> 
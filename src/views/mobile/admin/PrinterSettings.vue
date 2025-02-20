<template>
  <div class="printer-settings-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">打印机设置</span>
      <el-button class="add-button" link @click="handleAdd">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <div class="printer-content">
      <!-- 打印机列表 -->
      <div class="printer-list" v-if="printers.length > 0">
        <div 
          v-for="printer in printers" 
          :key="printer.id"
          class="printer-item">
          <div class="printer-info">
            <div class="printer-icon">
              <el-icon><Printer /></el-icon>
            </div>
            <div class="printer-detail">
              <div class="printer-name">{{ printer.name }}</div>
              <div class="printer-desc">{{ printer.address }}</div>
            </div>
          </div>
          <div class="printer-actions">
            <el-switch
              v-model="printer.isEnabled"
              @change="(val) => handleStatusChange(val, printer)"
              class="status-switch"
            />
            <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, printer)">
              <el-button type="primary" link>
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="test">
                    <el-icon><Document /></el-icon>
                    打印测试页
                  </el-dropdown-item>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑打印机
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" class="danger">
                    <el-icon><Delete /></el-icon>
                    删除打印机
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
        description="暂无打印机" 
        :image-size="120">
        <el-button type="primary" @click="handleAdd">添加打印机</el-button>
      </el-empty>
    </div>

    <!-- 添加/编辑打印机对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑打印机' : '添加打印机'"
      width="90%"
      :close-on-click-modal="false">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top">
        <el-form-item label="打印机名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入打印机名称" />
        </el-form-item>
        <el-form-item label="打印机类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择打印机类型">
            <el-option
              v-for="type in printerTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="打印机地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入打印机IP地址或串口地址" />
        </el-form-item>
        <el-form-item label="打印份数" prop="copies">
          <el-input-number 
            v-model="form.copies" 
            :min="1" 
            :max="5"
            :step="1"
            step-strictly />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
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
  Plus,
  Printer,
  More,
  Document,
  Edit,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()

// 打印机列表数据
const printers = ref([
  {
    id: 1,
    name: '前台打印机',
    type: 'usb',
    address: 'COM3',
    copies: 1,
    isEnabled: true
  },
  {
    id: 2,
    name: '厨房打印机',
    type: 'network',
    address: '192.168.1.100',
    copies: 2,
    isEnabled: true
  }
])

// 打印机类型选项
const printerTypes = [
  { label: 'USB打印机', value: 'usb' },
  { label: '网络打印机', value: 'network' },
  { label: '蓝牙打印机', value: 'bluetooth' }
]

// 表单数据
const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  name: '',
  type: '',
  address: '',
  copies: 1
})

const rules = {
  name: [
    { required: true, message: '请输入打印机名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择打印机类型', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入打印机地址', trigger: 'blur' }
  ]
}

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理添加打印机
const handleAdd = () => {
  isEdit.value = false
  form.name = ''
  form.type = ''
  form.address = ''
  form.copies = 1
  dialogVisible.value = true
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 处理打印机状态改变
const handleStatusChange = async (value, printer) => {
  try {
    await ElMessageBox.confirm(
      `确定要${value ? '启用' : '禁用'}该打印机吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: value ? 'success' : 'warning'
      }
    )
    
    // TODO: 调用API更新打印机状态
    ElMessage.success(`已${value ? '启用' : '禁用'}打印机`)
  } catch {
    // 取消操作，回滚状态
    printer.isEnabled = !value
  }
}

// 处理打印机操作
const handleCommand = async (command, printer) => {
  switch (command) {
    case 'test':
      try {
        // TODO: 调用API打印测试页
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('测试页打印成功')
      } catch (error) {
        ElMessage.error('打印失败，请检查打印机状态')
      }
      break
    case 'edit':
      isEdit.value = true
      form.name = printer.name
      form.type = printer.type
      form.address = printer.address
      form.copies = printer.copies
      dialogVisible.value = true
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          '确定要删除该打印机吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        printers.value = printers.value.filter(p => p.id !== printer.id)
        ElMessage.success('删除成功')
      } catch {
        // 用户取消删除
      }
      break
  }
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用API保存打印机信息
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEdit.value) {
      // 更新现有打印机
      const printer = printers.value.find(p => p.name === form.name)
      if (printer) {
        printer.type = form.type
        printer.address = form.address
        printer.copies = form.copies
      }
    } else {
      // 添加新打印机
      printers.value.push({
        id: Date.now(),
        name: form.name,
        type: form.type,
        address: form.address,
        copies: form.copies,
        isEnabled: true
      })
    }
    
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('保存失败：', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.printer-settings-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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

.printer-content {
  flex: 1;
  padding: 12px;
  margin-top: 44px;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.printer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.printer-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.printer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.printer-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.printer-icon .el-icon {
  font-size: 24px;
  color: #e17b00;
}

.printer-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.printer-name {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.printer-desc {
  font-size: 13px;
  color: #909399;
}

.printer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

.danger {
  color: #f56c6c !important;
}

.danger:hover {
  background: #fff1f0 !important;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 6px;
}
</style> 
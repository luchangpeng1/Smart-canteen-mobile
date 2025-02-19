<template>
    <div class="dish-card" :class="{ 'sold-out': dish.soldOut }">
        <div class="dish-content">
            <div class="dish-header">
                <div class="checkbox-wrapper"
                    @click="$emit('update:selected', dish.id)">
                    <el-checkbox 
                        :model-value="selectedDishes.includes(dish.id)"
                        class="dish-checkbox">
                    </el-checkbox>
                </div>
                <h4 class="dish-name">{{ dish.name }}</h4>
            </div>
            
            <div class="dish-image">
                <el-image 
                    :src="dish.image_url" 
                    fit="cover"
                    lazy
                    loading="lazy"
                    :preview-src-list="[dish.image_url]"
                    :initial-index="0"
                    :zoom-rate="1.2"
                    :preview-teleported="true">
                    <template #placeholder>
                        <div class="image-loading">
                            <el-icon class="loading-icon"><Loading /></el-icon>
                            <span>加载中...</span>
                        </div>
                    </template>
                    <template #error>
                        <div class="image-placeholder">
                            <el-icon><Picture /></el-icon>
                            <span>暂无图片</span>
                        </div>
                    </template>
                </el-image>
            </div>

            <div class="dish-info">
                <div class="dish-meta">
                    <span class="dish-price">¥{{ dish.price }}</span>
                    <span class="dish-stock">剩余: {{ dish.stock }}</span>
                    <span v-if="dish.soldOut" class="sold-out-tag">已售罄</span>
                </div>
                <div class="dish-actions">
                    <el-button 
                        type="danger" 
                        size="small" 
                        :plain="!dish.soldOut"
                        @click="$emit('toggle-sold-out', dish)">
                        <el-icon>
                            <component :is="dish.soldOut ? 'CircleCheck' : 'CircleClose'" />
                        </el-icon>
                        {{ dish.soldOut ? '恢复供应' : '标记售罄' }}
                    </el-button>
                    <el-button 
                        type="primary" 
                        size="small" 
                        plain
                        @click="showStockDialog = true">
                        修改库存
                    </el-button>
                    <el-button
                        type="success"
                        size="small"
                        plain
                        @click="triggerUpload">
                        <el-icon><Upload /></el-icon>
                        更换图片
                    </el-button>
                    <input
                        type="file"
                        ref="fileInput"
                        style="display: none"
                        accept="image/*"
                        @change="handleFileChange"
                    />
                </div>
            </div>
        </div>
    </div>

    <el-dialog
        v-model="showStockDialog"
        :title="`修改 ${dish.name} 的库存`"
        width="90%"
        :show-close="false"
        align-center
        class="stock-dialog">
        <div class="stock-input">
            <el-input-number
                v-model="tempStock"
                :min="0"
                :max="999"
                size="large"
                controls-position="right"
                style="width: 100%"/>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showStockDialog = false" size="large">取消</el-button>
                <el-button type="primary" @click="handleUpdateStock" size="large">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Picture, CircleClose, CircleCheck, Loading, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    dish: {
        type: Object,
        required: true
    },
    selectedDishes: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:selected', 'toggle-sold-out', 'update-stock', 'update-image'])
const fileInput = ref(null)

// 库存修改相关状态
const showStockDialog = ref(false)
const tempStock = ref(0)

// 监听菜品库存变化
watch(() => props.dish.stock, (newVal) => {
    tempStock.value = newVal
}, { immediate: true })

// 处理库存更新
const handleUpdateStock = () => {
    if (tempStock.value === props.dish.stock) {
        showStockDialog.value = false
        return
    }

    // 发送更新事件
    emit('update-stock', {
        ...props.dish,
        stock: tempStock.value
    })

    // 关闭对话框
    showStockDialog.value = false
    
    // 显示成功提示
    ElMessage.success('库存更新成功')
}

// 使用计算属性来管理复选框状态
const isSelected = ref(false)

// 监听父组件传入的选中状态
watch(() => props.selectedDishes, (newVal) => {
    isSelected.value = newVal.includes(props.dish.id)
}, { immediate: true })

// 处理复选框变化
const handleSelect = (val) => {
    emit('update:selected', props.dish.id)
}

// 触发文件选择
const triggerUpload = () => {
    fileInput.value.click()
}

// 处理文件选择
const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return
    }
    
    // 验证文件大小（例如限制为 2MB）
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过2MB')
        return
    }

    try {
        // 创建 FormData
        const formData = new FormData()
        formData.append('image', file)
        formData.append('dishId', props.dish.id)
        
        // 发送更新事件
        emit('update-image', {
            dishId: props.dish.id,
            formData
        })
        
        // 清空文件输入框，以便可以重复选择同一文件
        event.target.value = ''
        
    } catch (error) {
        ElMessage.error('上传图片失败')
        console.error('上传图片错误:', error)
    }
}
</script> 

<style scoped>
.dish-card {
    background: #fff;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;
}

.dish-card:active {
    transform: scale(0.99);
}

.dish-content {
    padding: 2px;
}

.dish-image {
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 1;
    background: #f5f7fa;
    margin-top: 0;
    margin-bottom: 4px;
}

.dish-image :deep(.el-image) {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
}

.dish-image :deep(.el-image:hover) {
    transform: scale(1.03);
}

.image-loading,
.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 12px;
    gap: 2px;
}

.image-loading .loading-icon {
    font-size: 18px;
    animation: rotate 1s linear infinite;
}

.image-placeholder .el-icon {
    font-size: 18px;
    margin-bottom: 1px;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.dish-checkbox {
    position: relative;
    flex-shrink: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
}

/* 优化移动端复选框样式 */
.dish-checkbox :deep(.el-checkbox) {
    margin: 0;
    height: 16px;
    display: flex;
    align-items: center;
}

.dish-checkbox :deep(.el-checkbox__input) {
    background: #fff;
    border-radius: 2px;
    transition: transform 0.15s ease-in-out;
    will-change: transform;
}

.dish-checkbox :deep(.el-checkbox__inner) {
    width: 15px;
    height: 15px;
    border: 1.5px solid #dcdfe6;
    transition: all 0.15s ease-in-out;
    will-change: transform, border, background;
    margin-top: 1px;
}

/* 优化选中状态动画 */
.dish-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    transform: scale(1);
}

/* 优化勾选图标 */
.dish-checkbox :deep(.el-checkbox__inner::after) {
    transition: transform 0.15s ease-in-out;
    height: 8px;
    width: 3px;
    left: 5px;
    top: 2px;
}

/* 移除悬停效果（移动端不需要） */
.dish-checkbox :deep(.el-checkbox:hover .el-checkbox__inner) {
    border-color: #dcdfe6;
}

/* 优化点击反馈 */
.checkbox-wrapper:active .dish-checkbox :deep(.el-checkbox__input) {
    transform: scale(0.92);
}

.dish-info {
    padding: 1px 0 0;
}

.dish-name {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    margin: 0;
    padding: 2px 0;
    color: #2c3e50;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}

.dish-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    flex-wrap: nowrap;
    min-height: 16px;
}

.dish-price {
    color: #f56c6c;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

.dish-stock {
    color: #606266;
    font-size: 10px;
    white-space: nowrap;
    flex-shrink: 0;
}

.sold-out-tag {
    font-size: 9px;
    color: #fff;
    background-color: #f56c6c;
    padding: 1px 3px;
    border-radius: 2px;
    line-height: 1.2;
    flex-shrink: 0;
    display: inline-block;
}

.dish-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin-bottom: 4px;
}

.dish-actions .el-button {
    margin: 0;
    --el-button-size: 24px;
    font-size: 11px;
    padding: 0 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dish-actions .el-button .el-icon {
    font-size: 12px;
    margin-right: 2px;
}

/* 售罄状态的图片效果 */
.dish-card.sold-out .dish-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: grayscale(100%);
    transition: all 0.3s ease;
}

.dish-card.sold-out .dish-name {
    color: #909399;
}

.dish-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 2px;
    min-height: 24px;
}

/* 新增触摸区域包装器 */
.checkbox-wrapper {
    position: relative;
    padding: 4px;
    margin: -4px;
    display: flex;
    align-items: center;
    height: 24px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

/* 库存修改对话框样式 */
.stock-dialog :deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;
}

.stock-dialog :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.stock-dialog :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: 500;
}

.stock-dialog :deep(.el-dialog__body) {
    padding: 20px 16px;
}

.stock-input {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

.stock-input :deep(.el-input-number) {
    width: 100%;
}

.stock-input :deep(.el-input-number__decrease),
.stock-input :deep(.el-input-number__increase) {
    border-color: #dcdfe6;
    background: #f5f7fa;
}

.dialog-footer {
    display: flex;
    gap: 12px;
    padding: 0 16px 16px;
}

.dialog-footer .el-button {
    flex: 1;
    margin: 0;
}

/* 移动端适配 */
@media screen and (max-width: 480px) {
    .stock-dialog :deep(.el-dialog) {
        width: 90% !important;
        max-width: 320px;
    }
    
    .stock-input :deep(.el-input-number .el-input__inner) {
        height: 40px;
        font-size: 16px;
    }
}

/* 新增上传按钮样式 */
.dish-actions .el-button:last-child {
    grid-column: 1 / -1;
}
</style> 
<template>
    <div class="menu-container">
        <div class="mobile-menu">
            <div class="page-header">
                <h2 class="page-title">菜单管理</h2>
                <div class="header-actions">
                    <el-button type="primary" size="small" @click="handleBatchSoldOut" v-if="selectedDishes.length">
                        <el-icon>
                            <CircleClose />
                        </el-icon>批量售罄
                    </el-button>
                    <el-button type="primary" size="small" @click="triggerMenuUpload">
                        <el-icon>
                            <Upload />
                        </el-icon>上传菜单
                    </el-button>
                    <input type="file" ref="menuFileInput" style="display: none" accept=".xlsx,.xls"
                        @change="handleMenuFileChange" />
                </div>
            </div>

            <!-- 日期选择 -->
            <div class="date-picker">
                <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" :disabled-date="disabledDate" style="width: 100%" size="small">
                </el-date-picker>
            </div>

            <!-- 菜品分类标签 -->
            <div class="category-tags">
                <el-radio-group v-model="activeCategory" size="small">
                    <el-radio-button value="all">全部</el-radio-button>
                    <el-radio-button v-for="category in categories" :key="category.value" :value="category.value">
                        {{ category.label }}
                    </el-radio-button>
                </el-radio-group>
            </div>

            <!-- 菜品网格 -->
            <div class="dishes-grid">
                <DishCard v-for="dish in filteredDishes" :key="dish.id" :dish="dish" :selected-dishes="selectedDishes"
                    @update:selected="handleSelect" @toggle-sold-out="toggleSoldOut" @update-stock="updateStock"
                    @update-image="handleImageUpdate" />
            </div>
        </div>

        <!-- 修改上传进度对话框为上传预览对话框 -->
        <el-dialog v-model="showUploadDialog" title="批量上传菜品" width="90%">
            <!-- 上传区域 -->
            <div class="upload-area" v-if="!previewData.length">
                <el-upload ref="uploadRef" class="menu-uploader" :auto-upload="false" :show-file-list="true"
                    :multiple="true" :limit="50" accept="image/*" :on-change="handleFileChange" :on-exceed="handleExceed"
                    :on-remove="handleRemove" drag>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖拽多个文件到此处或 <em>点击上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            支持批量上传jpg/png图片，每个文件不超过2MB，最多可选择50个文件
                        </div>
                    </template>
                </el-upload>
                <div class="upload-actions" v-if="uploadFiles.length">
                    <el-button type="primary" @click="handleBatchPreview">
                        开始编辑 {{ uploadFiles.length }} 个菜品信息
                    </el-button>
                </div>
            </div>

            <!-- 预览区域 -->
            <div class="preview-area" v-else>
                <div class="preview-header">
                    <h3>批量编辑菜品信息 ({{ previewData.length }}个)</h3>
                    <div class="batch-actions">
                        <el-button size="small" @click="applyBatchCategory" v-if="previewData.length > 1">
                            批量设置分类
                        </el-button>
                        <el-button size="small" @click="applyBatchPrice" v-if="previewData.length > 1">
                            批量设置价格
                        </el-button>
                    </div>
                </div>
                <div class="preview-grid">
                    <div v-for="(item, index) in previewData" :key="index" class="preview-item">
                        <div class="preview-image">
                            <el-image :src="item.imageUrl" fit="cover" :preview-src-list="[item.imageUrl]">
                            </el-image>
                        </div>
                        <div class="preview-form">
                            <el-form :model="item" label-position="top" size="small">
                                <el-form-item label="菜品名称">
                                    <el-input v-model="item.name" placeholder="请输入菜品名称" />
                                </el-form-item>
                                <el-form-item label="价格">
                                    <el-input-number v-model="item.price" :min="0" :precision="2" :step="0.1" />
                                </el-form-item>
                                <el-form-item label="分类">
                                    <el-select v-model="item.category" placeholder="选择分类">
                                        <el-option v-for="cat in categories" :key="cat.value" :label="cat.label"
                                            :value="cat.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="初始库存">
                                    <el-input-number v-model="item.stock" :min="0" :precision="0" :step="1" />
                                </el-form-item>
                            </el-form>
                            <el-button type="danger" size="small" @click="removePreviewItem(index)">
                                删除
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelUpload">取消</el-button>
                    <el-button type="primary" @click="submitUpload" :loading="uploading" :disabled="!previewData.length">
                        {{ uploading ? '上传中...' : '确认上传' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 批量设置对话框 -->
        <el-dialog v-model="showBatchDialog" title="批量设置" width="90%" append-to-body>
            <el-form :model="batchForm" label-width="80px">
                <template v-if="batchType === 'category'">
                    <el-form-item label="分类">
                        <el-select v-model="batchForm.category" placeholder="选择分类">
                            <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="batchType === 'price'">
                    <el-form-item label="价格">
                        <el-input-number v-model="batchForm.price" :min="0" :precision="2" :step="0.1" />
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showBatchDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmBatchSetting">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import DishCard from './DishCard.vue'
const selectedDate = ref(new Date())
const activeCategory = ref('all')
const selectedDishes = ref([])

// 菜品分类
const categories = [
    { label: '大荤', value: 'main' },
    { label: '小荤', value: 'side' },
    { label: '素菜', value: 'vegetable' },
    { label: '汤类', value: 'soup' }
]

// 模拟菜品数据
const dishes = ref([
    {
        id: 1,
        name: '红烧肉',
        price: 15,
        stock: 50,
        category: 'main',
        soldOut: false,
        image_url: 'https://example.com/dish1.jpg'
    },
    {
        id: 2,
        name: '糖醋排骨',
        price: 16,
        stock: 40,
        category: 'main',
        soldOut: false,
        image_url: 'https://example.com/dish2.jpg'
    },
    {
        id: 3,
        name: '回锅肉',
        price: 14,
        stock: 45,
        category: 'main',
        soldOut: false,
        image_url: 'https://example.com/dish3.jpg'
    },
    {
        id: 4,
        name: '宫保鸡丁',
        price: 13,
        stock: 30,
        category: 'side',
        soldOut: false,
        image_url: 'https://example.com/dish4.jpg'
    },
    {
        id: 5,
        name: '麻婆豆腐',
        price: 10,
        stock: 35,
        category: 'side',
        soldOut: false,
        image_url: 'https://example.com/dish5.jpg'
    },
    {
        id: 6,
        name: '炒青菜',
        price: 8,
        stock: 60,
        category: 'vegetable',
        soldOut: false,
        image_url: 'https://example.com/dish6.jpg'
    },
    {
        id: 7,
        name: '土豆丝',
        price: 8,
        stock: 55,
        category: 'vegetable',
        soldOut: false,
        image_url: 'https://example.com/dish7.jpg'
    },
    {
        id: 8,
        name: '紫菜蛋花汤',
        price: 5,
        stock: 100,
        category: 'soup',
        soldOut: false,
        image_url: 'https://example.com/dish8.jpg'
    },
    {
        id: 9,
        name: '番茄蛋汤',
        price: 5,
        stock: 100,
        category: 'soup',
        soldOut: false,
        image_url: 'https://example.com/dish9.jpg'
    }
])

// 根据分类筛选菜品
const filteredDishes = computed(() => {
    if (activeCategory.value === 'all') {
        return dishes.value
    }
    return dishes.value.filter(dish => dish.category === activeCategory.value)
})

// 标记菜品售罄/恢复供应
const toggleSoldOut = async (dish) => {
    try {
        await ElMessageBox.confirm(
            `确定要${dish.soldOut ? '恢复供应' : '标记售罄'}该菜品吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: dish.soldOut ? 'success' : 'warning'
            }
        )
        // TODO: 调用API更新菜品状
        dish.soldOut = !dish.soldOut
        if (dish.soldOut) {
            selectedDishes.value = selectedDishes.value.filter(id => id !== dish.id)
        }
        ElMessage.success(`${dish.name}已${dish.soldOut ? '售罄' : '恢复供应'}`)
    } catch {
        // 用户取消操作
    }
}

// 批量标记售罄
const handleBatchSoldOut = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要将选中的 ${selectedDishes.value.length} 个菜品标记为售罄吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        // TODO: 调用API批量更新菜品状态
        dishes.value.forEach(dish => {
            if (selectedDishes.value.includes(dish.id)) {
                dish.soldOut = true
            }
        })
        selectedDishes.value = []
        ElMessage.success('已批量标记售罄')
    } catch {
        // 用户取消操作
    }
}

const handleUpload = () => {
    // 上传菜单逻辑
}

const editMenu = (window) => {
    // 编辑菜单逻辑
}

const updateStock = async (dish) => {
    try {
        // TODO: 调用API更新库存
        const index = dishes.value.findIndex(item => item.id === dish.id)
        if (index !== -1) {
            dishes.value[index].stock = dish.stock
        }
    } catch (error) {
        ElMessage.error('更新库存失败')
    }
}

const disabledDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7
}

const handleSelect = (dishId) => {
    const index = selectedDishes.value.indexOf(dishId)
    if (index === -1) {
        selectedDishes.value = [...selectedDishes.value, dishId]
    } else {
        selectedDishes.value = selectedDishes.value.filter(id => id !== dishId)
    }
}

const handleImageUpdate = async ({ dishId, formData }) => {
    try {
        // 调用后端API上传图片
        const response = await fetch('/api/dishes/upload-image', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('上传失败')
        }

        ElMessage.success('图片上传成功')
        // 更新本地数据状态

    } catch (error) {
        ElMessage.error('图片上传失败')
        console.error('上传错误:', error)
    }
}

// 文���上传相关的响应式变量
const menuFileInput = ref(null)
const showUploadDialog = ref(false)
const previewData = ref([])
const uploading = ref(false)
const uploadFiles = ref([])
const showBatchDialog = ref(false)
const batchType = ref('')
const batchForm = ref({
    category: '',
    price: 0
})

// 触发文件选择
const triggerMenuUpload = () => {
    showUploadDialog.value = true
}

// 处理文件变化
const handleFileChange = (file) => {
    if (!file) return

    // 验证文件类型和大小
    if (!file.raw.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return false
    }

    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过2MB')
        return false
    }

    // 将文件添加到上传列表
    uploadFiles.value.push(file)
    return true
}

// 处理文件移除
const handleRemove = (file) => {
    uploadFiles.value = uploadFiles.value.filter(f => f.uid !== file.uid)
}

// 处理超出限制
const handleExceed = () => {
    ElMessage.warning('最多只能上传50个文件')
}

// 批量预览
const handleBatchPreview = async () => {
    previewData.value = []
    for (const file of uploadFiles.value) {
        await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                previewData.value.push({
                    file: file.raw,
                    imageUrl: e.target.result,
                    name: '',
                    price: 0,
                    category: '',
                    stock: 100
                })
                resolve()
            }
            reader.readAsDataURL(file.raw)
        })
    }
}

// 批量设置分类
const applyBatchCategory = () => {
    batchType.value = 'category'
    showBatchDialog.value = true
}

// 批量设置价格
const applyBatchPrice = () => {
    batchType.value = 'price'
    showBatchDialog.value = true
}

// 确认批量设置
const confirmBatchSetting = () => {
    if (batchType.value === 'category') {
        previewData.value.forEach(item => {
            item.category = batchForm.value.category
        })
    } else if (batchType.value === 'price') {
        previewData.value.forEach(item => {
            item.price = batchForm.value.price
        })
    }
    showBatchDialog.value = false
    ElMessage.success('批量设置成功')
}

// 取消上传时清空数据
const cancelUpload = () => {
    showUploadDialog.value = false
    previewData.value = []
    uploadFiles.value = []
    uploadRef.value?.clearFiles()
}

// 提交上传
const submitUpload = async () => {
    // ��证数据
    const invalidItems = previewData.value.filter(item =>
        !item.name || !item.category || item.price <= 0
    )

    if (invalidItems.length) {
        ElMessage.error('请完整填写所有菜品信息')
        return
    }

    uploading.value = true
    try {
        const formData = new FormData()
        formData.append('date', selectedDate.value)

        // 添加所有菜品数据
        previewData.value.forEach((item, index) => {
            formData.append(`dishes[${index}][image]`, item.file)
            formData.append(`dishes[${index}][name]`, item.name)
            formData.append(`dishes[${index}][price]`, item.price)
            formData.append(`dishes[${index}][category]`, item.category)
            formData.append(`dishes[${index}][stock]`, item.stock)
        })

        const response = await fetch('/api/menu/batch-upload', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('上传失败')
        }

        const result = await response.json()

        // 更新菜品列表
        if (result.dishes) {
            dishes.value = result.dishes
        }

        ElMessage.success('菜单上传成功')
        cancelUpload()

    } catch (error) {
        ElMessage.error('菜单上传失败')
        console.error('上传菜单错误:', error)
    } finally {
        uploading.value = false
    }
}
</script>

<style scoped>
.menu-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: -15px;
}

.mobile-menu {
    flex: 1;
    padding: 1px 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    padding: 0 2px;
}

.page-title {
    font-size: 16px;
    margin: 0;
}

.date-picker {
    margin-bottom: 4px;
    padding: 0 2px;
}

.category-tags {
    margin: 4px 2px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 1px;
}

.dishes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 2px;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
}

.dish-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.dish-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    position: relative;
}

.dish-checkbox {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    padding: 4px;
}

.dish-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.dish-image .el-image {
    width: 100%;
    height: 100%;
}

.dish-name {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 8px;
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
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
}

.sold-out-tag {
    font-size: 12px;
    color: #f56c6c;
    border: 1px solid currentColor;
    padding: 0 6px;
    border-radius: 4px;
    line-height: 18px;
}

.dish-actions {
    margin-top: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
}

/* 响应式布局 */
@media screen and (max-width: 480px) {
    .dishes-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2px;
        padding: 0;
    }

    .dish-actions {
        grid-template-columns: 1fr;
    }
}

@media screen and (min-width: 481px) and (max-width: 768px) {
    .dishes-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
    }
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

/* 上传进度对话框样式 */
.upload-progress {
    padding: 20px;
    text-align: center;
}

.upload-status-text {
    margin-top: 16px;
    color: #606266;
    font-size: 14px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 16px 16px;
    gap: 12px;
}

.upload-area {
    padding: 12px;
}

.preview-area {
    padding: 12px;
    max-height: 70vh;
    overflow-y: auto;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    padding: 8px;
}

.preview-item {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.preview-image {
    width: 100%;
    aspect-ratio: 16/9;
    margin-bottom: 12px;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f7fa;
}

.preview-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.preview-form :deep(.el-form-item) {
    margin-bottom: 12px;
}

.preview-form :deep(.el-form-item__label) {
    font-size: 14px;
    padding-bottom: 4px;
}

.preview-form :deep(.el-input__inner) {
    height: 36px;
}

.menu-uploader :deep(.el-upload-dragger) {
    width: 100%;
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.menu-uploader :deep(.el-upload__text) {
    font-size: 14px;
    margin-top: 8px;
}

.menu-uploader :deep(.el-icon--upload) {
    font-size: 28px;
    color: var(--el-color-primary);
    margin-bottom: 4px;
}

/* 响应式布局调整 */
@media screen and (max-width: 480px) {
    .preview-grid {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 6px;
    }

    .preview-header {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        padding: 8px;
    }

    .preview-item {
        padding: 10px;
    }

    .menu-uploader :deep(.el-upload-dragger) {
        height: 120px;
    }

    .el-dialog {
        width: 98% !important;
        margin: 0 auto !important;
    }

    .dialog-footer {
        flex-direction: column;
        gap: 8px;
        padding: 0 8px 8px;
    }
}

@media screen and (min-width: 481px) and (max-width: 768px) {
    .preview-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .preview-item {
        padding: 12px;
    }
}

@media screen and (min-width: 769px) {
    .preview-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .preview-item {
        background: var(--el-bg-color);
        border-color: var(--el-border-color-darker);
    }

    .preview-image {
        background: var(--el-bg-color-darker);
    }
}

/* 触摸设备优化 */
@media (hover: none) {

    .preview-form :deep(.el-input__inner),
    .preview-form :deep(.el-select),
    .preview-form :deep(.el-input-number) {
        font-size: 16px;
        /* 防止iOS缩放 */
    }

    .preview-form :deep(.el-input-number__decrease),
    .preview-form :deep(.el-input-number__increase) {
        height: 36px;
        width: 36px;
    }
}

/* 优化对话框内容区域 */
:deep(.el-dialog__body) {
    padding: 12px;
}

:deep(.el-dialog__header) {
    padding: 12px;
    margin-right: 0;
}

:deep(.el-dialog__footer) {
    padding: 12px;
}
</style>
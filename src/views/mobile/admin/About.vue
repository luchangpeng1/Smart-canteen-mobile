<template>
  <div class="about-container">
    <div class="page-header">
      <el-button class="back-button" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="page-title">关于我们</span>
    </div>

    <div class="about-content">
      <!-- Logo和版本信息 -->
      <div class="app-info">
        <div class="app-logo">
          <el-icon :size="48" color="#e17b00"><Shop /></el-icon>
        </div>
        <div class="app-name">校园食堂管理系统</div>
        <div class="app-version">版本 1.0.0</div>
      </div>

      <!-- 功能介绍 -->
      <div class="feature-section">
        <div class="section-title">主要功能</div>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon><Document /></el-icon>
            <div class="feature-detail">
              <div class="feature-name">订单管理</div>
              <div class="feature-desc">高效处理订单，轻松管理配送</div>
            </div>
          </div>
          <div class="feature-item">
            <el-icon><Menu /></el-icon>
            <div class="feature-detail">
              <div class="feature-name">菜单管理</div>
              <div class="feature-desc">灵活调整菜品，实时更新价格</div>
            </div>
          </div>
          <div class="feature-item">
            <el-icon><TrendCharts /></el-icon>
            <div class="feature-detail">
              <div class="feature-name">营业统计</div>
              <div class="feature-desc">数据分析，助力经营决策</div>
            </div>
          </div>
          <div class="feature-item">
            <el-icon><ChatDotSquare /></el-icon>
            <div class="feature-detail">
              <div class="feature-name">评价管理</div>
              <div class="feature-desc">及时响应，提升服务质量</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术支持 -->
      <div class="support-section">
        <div class="section-title">技术支持</div>
        <div class="support-list">
          <div class="support-item" @click="handleContact('phone')">
            <el-icon><Phone /></el-icon>
            <div class="support-detail">
              <div class="support-name">客服电话</div>
              <div class="support-desc">400-123-4567</div>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="support-item" @click="handleContact('email')">
            <el-icon><Message /></el-icon>
            <div class="support-detail">
              <div class="support-name">客服邮箱</div>
              <div class="support-desc">support@example.com</div>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="support-item" @click="handleContact('wechat')">
            <el-icon><ChatDotRound /></el-icon>
            <div class="support-detail">
              <div class="support-name">微信客服</div>
              <div class="support-desc">扫码添加客服</div>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="copyright-section">
        <div class="copyright-text">
          © 2024 校园食堂管理系统
          <br>
          All rights reserved
        </div>
      </div>
    </div>

    <!-- 微信客服二维码对话框 -->
    <el-dialog
      v-model="qrcodeVisible"
      title="微信客服"
      width="90%"
      :close-on-click-modal="false"
      class="qrcode-dialog">
      <div class="qrcode-content">
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
        <div class="qrcode-tip">扫描二维码添加客服微信</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Document,
  Menu,
  TrendCharts,
  ChatDotSquare,
  Phone,
  Message,
  ChatDotRound,
  Warning,
  Shop
} from '@element-plus/icons-vue'

const router = useRouter()

const qrcodeVisible = ref(false)
const wechatQRCode = 'https://example.com/wechat-qr.png'

// 处理返回
const handleBack = () => {
  router.push('/m/admin/profile')
}

// 处理联系方式点击
const handleContact = (type) => {
  switch (type) {
    case 'phone':
      window.location.href = 'tel:400-123-4567'
      break
    case 'email':
      window.location.href = 'mailto:support@example.com'
      break
    case 'wechat':
      qrcodeVisible.value = true
      break
  }
}
</script>

<style scoped>
.about-container {
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

.about-content {
  padding: 24px 16px;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.app-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 16px;
  background: #fff7e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.app-version {
  font-size: 14px;
  color: #909399;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 16px;
}

.feature-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.feature-item {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.feature-item .el-icon {
  font-size: 24px;
  color: #e17b00;
}

.feature-detail {
  flex: 1;
}

.feature-name {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: #909399;
}

.support-section {
  margin-top: 24px;
}

.support-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.support-item {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.support-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.support-item:active {
  background: #f5f7fa;
}

.support-item .el-icon {
  font-size: 24px;
  color: #e17b00;
}

.support-detail {
  flex: 1;
}

.support-name {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.support-desc {
  font-size: 13px;
  color: #909399;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 16px;
}

.copyright-section {
  margin-top: 48px;
  text-align: center;
}

.copyright-text {
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
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

.qrcode-tip {
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
  max-width: calc(100vw - 40px);
}
</style> 
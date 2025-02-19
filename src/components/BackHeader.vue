<template>
  <div class="back-header">
    <el-page-header :title="title" @back="goBack" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'BackHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.back()
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.back-header {
  margin-bottom: 20px;
}
</style>
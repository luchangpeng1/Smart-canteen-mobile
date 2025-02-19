/**
 * 格式化日期时间
 * @param {string|Date} date 日期时间字符串或Date对象
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const diff = now - d
  const oneDay = 24 * 60 * 60 * 1000
  const oneWeek = 7 * oneDay

  // 如果是今天
  if (d.toDateString() === now.toDateString()) {
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `今天 ${hours}:${minutes}`
  }
  
  // 如果是昨天
  const yesterday = new Date(now - oneDay)
  if (d.toDateString() === yesterday.toDateString()) {
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `昨天 ${hours}:${minutes}`
  }

  // 如果在一周内
  if (diff < oneWeek) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[d.getDay()]
  }

  // 其他情况显示完整日期
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
} 
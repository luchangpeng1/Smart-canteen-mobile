export const checkPermission = () => {
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  const verifiedInfo = userInfo.verifiedInfo

  // 超级管理员拥有所有权限
  if (verifiedInfo?.role === 'superadmin') {
    return true
  }

  // 普通管理员只能查看自己窗口
  return verifiedInfo?.window?.id
}

export const isSuperAdmin = () => {
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  return userInfo.verifiedInfo?.role === 'superadmin'
} 
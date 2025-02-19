/**
 * 统一验证工具类
 */
class Validator {
  /**
   * 验证手机号
   * @param {string} phone 手机号
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  /**
   * 验证邮箱
   * @param {string} email 邮箱
   * @returns {boolean}
   */
  static isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  }

  /**
   * 验证学号
   * @param {string} studentId 学号
   * @returns {boolean}
   */
  static isValidStudentId(studentId) {
    return /^\d{8}$/.test(studentId)
  }

  /**
   * 验证工号
   * @param {string} staffId 工号
   * @returns {boolean}
   */
  static isValidStaffId(staffId) {
    return /^\d{5}$/.test(staffId)
  }

  /**
   * 验证密码强度
   * @param {string} password 密码
   * @returns {{valid: boolean, message: string}} 验证结果和提示信息
   */
  static validatePassword(password) {
    if (!password || password.length < 6) {
      return {
        valid: false,
        message: '密码长度不能少于6位'
      }
    }
    
    if (password.length > 20) {
      return {
        valid: false,
        message: '密码长度不能超过20位'
      }
    }

    // 检查密码复杂度
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!hasNumber || !hasLetter) {
      return {
        valid: false,
        message: '密码必须包含数字和字母'
      }
    }

    return {
      valid: true,
      message: '密码验证通过'
    }
  }

  /**
   * 验证用户名
   * @param {string} username 用户名
   * @returns {{valid: boolean, message: string}} 验证结果和提示信息
   */
  static validateUsername(username) {
    if (!username || username.length < 3) {
      return {
        valid: false,
        message: '用户名长度不能少于3位'
      }
    }

    if (username.length > 20) {
      return {
        valid: false,
        message: '用户名长度不能超过20位'
      }
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return {
        valid: false,
        message: '用户名只能包含字母、数字和下划线'
      }
    }

    return {
      valid: true,
      message: '用户名验证通过'
    }
  }

  /**
   * 验证金额
   * @param {number|string} amount 金额
   * @returns {{valid: boolean, message: string}} 验证结果和提示信息
   */
  static validateAmount(amount) {
    const amountNum = Number(amount)
    
    if (isNaN(amountNum)) {
      return {
        valid: false,
        message: '请输入有效的金额'
      }
    }

    if (amountNum <= 0) {
      return {
        valid: false,
        message: '金额必须大于0'
      }
    }

    if (amountNum > 10000) {
      return {
        valid: false,
        message: '单次金额不能超过10000'
      }
    }

    // 检查小数位数
    const decimalPlaces = (amountNum.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
      return {
        valid: false,
        message: '金额最多保留两位小数'
      }
    }

    return {
      valid: true,
      message: '金额验证通过'
    }
  }

  /**
   * 验证日期是否有效
   * @param {string|Date} date 日期
   * @returns {boolean}
   */
  static isValidDate(date) {
    const dateObj = new Date(date)
    return dateObj instanceof Date && !isNaN(dateObj)
  }

  /**
   * 验证身份证号
   * @param {string} idCard 身份证号
   * @returns {boolean}
   */
  static isValidIdCard(idCard) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
  }
}

export default Validator 
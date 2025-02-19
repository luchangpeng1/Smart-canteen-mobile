/**
 * 统一返回结果集工具类
 * 与后端 ResultCodeEnum 保持一致
 */
class Result {
  // 定义状态码枚举
  static CODE = {
    SUCCESS: 200,
    FAIL: 201,
    PARAM_ERROR: 202,
    SERVICE_ERROR: 203,
    DATA_ERROR: 204,
    ILLEGAL_REQUEST: 205,
    REPEAT_SUBMIT: 206,
    DELETE_ERROR: 207,

    ADMIN_ACCOUNT_EXIST_ERROR: 301,
    ADMIN_CAPTCHA_CODE_ERROR: 302,
    ADMIN_CAPTCHA_CODE_EXPIRED: 303, 
    ADMIN_CAPTCHA_CODE_NOT_FOUND: 304,
    ADMIN_LOGIN_AUTH: 305,
    ADMIN_ACCOUNT_NOT_EXIST_ERROR: 306,
    ADMIN_ACCOUNT_ERROR: 307,
    ADMIN_ACCOUNT_DISABLED_ERROR: 308,
    ADMIN_ACCESS_FORBIDDEN: 309,

    APP_LOGIN_AUTH: 501,
    APP_LOGIN_PHONE_EMPTY: 502,
    APP_LOGIN_CODE_EMPTY: 503,
    APP_SEND_SMS_TOO_OFTEN: 504,
    APP_LOGIN_CODE_EXPIRED: 505,
    APP_LOGIN_CODE_ERROR: 506,
    APP_ACCOUNT_DISABLED_ERROR: 507,

    TOKEN_EXPIRED: 601,
    TOKEN_INVALID: 602
  }

  // 定义状态码对应的默认消息
  static MESSAGE = {
    [this.CODE.SUCCESS]: '成功',
    [this.CODE.FAIL]: '失败',
    [this.CODE.PARAM_ERROR]: '参数不正确',
    [this.CODE.SERVICE_ERROR]: '服务异常',
    [this.CODE.DATA_ERROR]: '数据异常',
    [this.CODE.ILLEGAL_REQUEST]: '非法请求',
    [this.CODE.REPEAT_SUBMIT]: '重复提交',
    [this.CODE.DELETE_ERROR]: '请先删除子集',

    [this.CODE.ADMIN_ACCOUNT_EXIST_ERROR]: '账号已存在',
    [this.CODE.ADMIN_CAPTCHA_CODE_ERROR]: '验证码错误',
    [this.CODE.ADMIN_CAPTCHA_CODE_EXPIRED]: '验证码已过期',
    [this.CODE.ADMIN_CAPTCHA_CODE_NOT_FOUND]: '未输入验证码',
    [this.CODE.ADMIN_LOGIN_AUTH]: '未登录',
    [this.CODE.ADMIN_ACCOUNT_NOT_EXIST_ERROR]: '账号不存在',
    [this.CODE.ADMIN_ACCOUNT_ERROR]: '用户名或密码错误',
    [this.CODE.ADMIN_ACCOUNT_DISABLED_ERROR]: '该用户已被禁用',
    [this.CODE.ADMIN_ACCESS_FORBIDDEN]: '无访问权限',

    [this.CODE.APP_LOGIN_AUTH]: '未登录',
    [this.CODE.APP_LOGIN_PHONE_EMPTY]: '手机号码为空',
    [this.CODE.APP_LOGIN_CODE_EMPTY]: '验证码为空',
    [this.CODE.APP_SEND_SMS_TOO_OFTEN]: '验证码发送过于频繁',
    [this.CODE.APP_LOGIN_CODE_EXPIRED]: '验证码已过期',
    [this.CODE.APP_LOGIN_CODE_ERROR]: '验证码错误',
    [this.CODE.APP_ACCOUNT_DISABLED_ERROR]: '该用户已被禁用',

    [this.CODE.TOKEN_EXPIRED]: 'token过期',
    [this.CODE.TOKEN_INVALID]: 'token非法'
  }

  /**
   * 成功返回
   * @param {any} data 返回数据
   * @param {string} message 返回信息
   * @param {number} code 状态码
   */
  static success(data = null, message = this.MESSAGE[this.CODE.SUCCESS], code = this.CODE.SUCCESS) {
    return {
      code,
      message,
      data,
      success: true,
      timestamp: new Date().getTime()
    }
  }

  /**
   * 失败返回
   * @param {string} message 错误信息
   * @param {number} code 状态码
   * @param {any} data 返回数据
   */
  static error(message = this.MESSAGE[this.CODE.FAIL], code = this.CODE.FAIL, data = null) {
    return {
      code,
      message,
      data,
      success: false,
      timestamp: new Date().getTime()
    }
  }

  /**
   * 参数错误返回
   * @param {string} message 错误信息
   */
  static paramError(message = this.MESSAGE[this.CODE.PARAM_ERROR]) {
    return this.error(message, this.CODE.PARAM_ERROR)
  }

  /**
   * 服务异常返回
   * @param {string} message 错误信息
   */
  static serviceError(message = this.MESSAGE[this.CODE.SERVICE_ERROR]) {
    return this.error(message, this.CODE.SERVICE_ERROR)
  }

  /**
   * 未授权返回
   * @param {string} message 错误信息
   */
  static unauthorized(message = this.MESSAGE[this.CODE.ADMIN_LOGIN_AUTH]) {
    return this.error(message, this.CODE.ADMIN_LOGIN_AUTH)
  }

  /**
   * 禁止访问返回
   * @param {string} message 错误信息
   */
  static forbidden(message = this.MESSAGE[this.CODE.ADMIN_ACCESS_FORBIDDEN]) {
    return this.error(message, this.CODE.ADMIN_ACCESS_FORBIDDEN)
  }

  /**
   * token过期返回
   * @param {string} message 错误信息
   */
  static tokenExpired(message = this.MESSAGE[this.CODE.TOKEN_EXPIRED]) {
    return this.error(message, this.CODE.TOKEN_EXPIRED)
  }

  /**
   * token非法返回
   * @param {string} message 错误信息
   */
  static tokenInvalid(message = this.MESSAGE[this.CODE.TOKEN_INVALID]) {
    return this.error(message, this.CODE.TOKEN_INVALID)
  }

  /**
   * 根据状态码获取默认消息
   * @param {number} code 状态码
   * @returns {string} 默认消息
   */
  static getMessageByCode(code) {
    return this.MESSAGE[code] || '未知错误'
  }
}

export default Result 
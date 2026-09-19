/**
 * 网络请求封装
 * 统一处理 token 注入、错误提示、登录过期跳转
 */

const BASE_URL = '' // 接口地址，上线时配置

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')

    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        ...options.header
      },
      success(res) {
        const data = res.data
        if (data.code === 200 || data.code === 0) {
          resolve(data.data)
        } else if (data.code === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          reject(new Error('未授权'))
        } else {
          wx.showToast({ title: data.msg || '请求失败', icon: 'none' })
          reject(new Error(data.msg || '请求失败'))
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

const get = (url, data) => request({ url: url, method: 'GET', data: data })
const post = (url, data) => request({ url: url, method: 'POST', data: data })
const put = (url, data) => request({ url: url, method: 'PUT', data: data })
const del = (url, data) => request({ url: url, method: 'DELETE', data: data })

module.exports = { request: request, get: get, post: post, put: put, del: del }
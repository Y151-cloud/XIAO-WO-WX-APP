/**
 * 微信登录工具
 */

const { post } = require('./request')

const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('wx.login 失败'))
        }
      },
      fail: reject
    })
  })
}

const login = async (userInfo) => {
  userInfo = userInfo || {}
  const code = await wxLogin()
  var data = { code: code }
  if (userInfo.nickName) {
    data.nickname = userInfo.nickName
    data.avatar = userInfo.avatarUrl
    data.gender = userInfo.gender || 0
  }
  var result = await post('/api/v1/auth/wx-login', data)
  wx.setStorageSync('token', result.token)
  wx.setStorageSync('userId', result.userId)
  wx.setStorageSync('userInfo', {
    nickName: result.nickname,
    avatarUrl: result.avatar,
    role: result.role === 1 ? 'user' : 'admin'
  })
  return result
}

const isLoggedIn = () => {
  return !!wx.getStorageSync('token')
}

const logout = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userId')
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('userStats')
}

module.exports = { wxLogin: wxLogin, login: login, isLoggedIn: isLoggedIn, logout: logout }
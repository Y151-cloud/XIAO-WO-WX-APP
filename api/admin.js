/**
 * 管理后台相关 API
 */
var request = require('../utils/request')

var getUsers = function(params) {
  return request.get('/api/v1/admin/users', params)
}

var banUser = function(userId) {
  return request.put('/api/v1/admin/users/' + userId + '/ban')
}

var unbanUser = function(userId) {
  return request.put('/api/v1/admin/users/' + userId + '/unban')
}

var setRole = function(userId, data) {
  return request.put('/api/v1/admin/users/' + userId + '/role', data)
}

var getReports = function(params) {
  return request.get('/api/v1/admin/reports', params)
}

var handleReport = function(reportId, data) {
  return request.put('/api/v1/admin/reports/' + reportId, data)
}

module.exports = {
  getUsers: getUsers,
  banUser: banUser,
  unbanUser: unbanUser,
  setRole: setRole,
  getReports: getReports,
  handleReport: handleReport
}
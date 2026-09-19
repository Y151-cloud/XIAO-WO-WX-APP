/**
 * 互动相关 API（点赞/收藏）
 */
var request = require('../utils/request')

var like = function(data) {
  return request.post('/api/v1/interaction/like', data)
}

var unlike = function(data) {
  return request.del('/api/v1/interaction/like', data)
}

var collect = function(data) {
  return request.post('/api/v1/interaction/collect', data)
}

var uncollect = function(data) {
  return request.del('/api/v1/interaction/collect', data)
}

var getLikeStatus = function(params) {
  return request.get('/api/v1/interaction/like/status', params)
}

var getCollectStatus = function(params) {
  return request.get('/api/v1/interaction/collect/status', params)
}

module.exports = {
  like: like,
  unlike: unlike,
  collect: collect,
  uncollect: uncollect,
  getLikeStatus: getLikeStatus,
  getCollectStatus: getCollectStatus
}
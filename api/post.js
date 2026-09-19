/**
 * 帖子相关 API
 */
var request = require('../utils/request')

var createPost = function(data) {
  return request.post('/api/v1/post', data)
}

var deletePost = function(postId) {
  return request.del('/api/v1/post/' + postId)
}

var getPost = function(postId) {
  return request.get('/api/v1/post/' + postId)
}

var getPostList = function(params) {
  return request.get('/api/v1/post', params)
}

var getUserPosts = function(userId, params) {
  return request.get('/api/v1/post/user/' + userId, params)
}

module.exports = {
  createPost: createPost,
  deletePost: deletePost,
  getPost: getPost,
  getPostList: getPostList,
  getUserPosts: getUserPosts
}
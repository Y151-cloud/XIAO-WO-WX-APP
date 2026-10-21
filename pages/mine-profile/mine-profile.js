Page({
  data: {
    userInfo: {},
    genderText: '未设置',
    showGenderSheet: false,
    genderActions: [{
        name: '男',
        value: 'male'
      },
      {
        name: '女',
        value: 'female'
      },
      {
        name: '保密',
        value: 'secret'
      }
    ]
  },
  onLoad() {
    this.loadUserInfo()
  },
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const genderMap = {
      male: '男',
      female: '女',
      secret: '保密'
    }
    this.setData({
      userInfo,
      genderText: genderMap[userInfo.gender] || '未设置'
    })
  },
  // 修改头像
  onChangeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: async (res) => {
        let avatarUrl
        try {
          avatarUrl = await new Promise((resolve, reject) => wx.getFileSystemManager()
            .saveFile({
              tempFilePath: res.tempFiles[0].tempFilePath,
              success: r => resolve(r.savedFilePath),
              fail: reject
            }))
        } catch (e) {
          wx.showToast({
            title: "头像保存失败",
            icon: "none"
          });
          return
        }
        const userInfo = {
          ...this.data.userInfo,
          avatarUrl
        }
        wx.setStorageSync('userInfo', userInfo)
        this.setData({
          userInfo
        })
        wx.showToast({
          title: '头像已更新',
          icon: 'success'
        })
      }
    })
  },
  // 修改昵称
  onEditNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入昵称',
      content: this.data.userInfo.nickName || '',
      success: (res) => {
        if (res.confirm && res.content) {
          const userInfo = {
            ...this.data.userInfo,
            nickName: res.content
          }
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo
          })
        }
      }
    })
  },
  // 显示性别选择
  onShowGender() {
    this.setData({
      showGenderSheet: true
    })
  },
  onCloseGender() {
    this.setData({
      showGenderSheet: false
    })
  },
  onSelectGender(e) {
    const gender = e.detail.value
    const genderMap = {
      male: '男',
      female: '女',
      secret: '保密'
    }
    const userInfo = {
      ...this.data.userInfo,
      gender
    }
    wx.setStorageSync('userInfo', userInfo)
    this.setData({
      userInfo,
      genderText: genderMap[gender],
      showGenderSheet: false
    })
  },
  // 修改学校
  onEditSchool() {
    wx.showModal({
      title: '修改学校',
      editable: true,
      placeholderText: '请输入学校名称',
      content: this.data.userInfo.school || '',
      success: (res) => {
        if (res.confirm) {
          const userInfo = {
            ...this.data.userInfo,
            school: res.content
          }
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo
          })
        }
      }
    })
  },
  // 修改学号
  onEditStudentId() {
    wx.showModal({
      title: '修改学号',
      editable: true,
      placeholderText: '请输入学号',
      content: this.data.userInfo.studentId || '',
      success: (res) => {
        if (res.confirm) {
          const userInfo = {
            ...this.data.userInfo,
            studentId: res.content
          }
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo
          })
        }
      }
    })
  },
  // 修改个性签名
  onEditSignature() {
    wx.showModal({
      title: '修改个性签名',
      editable: true,
      placeholderText: '写点什么吧',
      content: this.data.userInfo.signature || '',
      success: (res) => {
        if (res.confirm) {
          const userInfo = {
            ...this.data.userInfo,
            signature: res.content
          }
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo
          })
        }
      }
    })
  },
  // 退出登录
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('userStats')
          wx.navigateBack()
        }
      }
    })
  }
})

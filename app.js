App({
  onLaunch() {},
  globalData: {
    userInfo: null,
    baseUrl: require('./config/env').baseUrl,
    useMock: require('./config/env').useMock
  }
})

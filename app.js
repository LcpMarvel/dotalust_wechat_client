//app.js

App({
  serverHost: function () {
    return 'https://dotalust_dev.com'
  },
  onLaunch: function () {
    this.checkSession()
  },
  checkSession: function() {
    var app = this

    wx.checkSession({
      success: function () {
        app.setToken()
      },
      fail: function () {
        app.login()
      }
    })
  },
  login: function () {
    var app = this

    wx.login({
      success: function (res) {
        wx.request({
          url: app.serverHost() + '/api/wechat/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (response) {
            app.storeToken(response.data.token)
            app.updateUserInfo()
          }
        })
      }
    })
  },
  storeToken: function(token) {
    this.globalData.token = token

    wx.setStorage({
      key: "token",
      data: token
    })
  },
  setToken: function() {
    var app = this

    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data

        if (token) {
          app.globalData.token = res.data
        } else {
          app.login()
        }
      },
      fail: function (res) {
        app.login()
      }
    })
  },
  getUserInfo: function(cb) {
    var app = this;

    if (this.globalData.userInfo) {
      return this.globalData.userInfo
    } else {
      wx.getUserInfo({
        success: function (data) {
          app.globalData.userInfo = data.userInfo

          typeof cb == "function" && cb(data.userInfo)
        }
      })
    }
  },
  updateUserInfo: function() {
    var app = this;

    wx.getUserInfo({
      success: function (data) {
        var userInfo = data.userInfo

        wx.request({
          url: app.serverHost() + '/api/wechat/user',
          data: {
            encrypted_data: data.encryptedData,
            iv: data.iv,
            raw_data: data.rawData,
            signature: data.signature
          },
          header: {
            'token': app.globalData.token
          },
          method: 'PUT'
        })
      }
    })
  },
  globalData:{
    userInfo: null,
    token: null
  }
})
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
        app.setSession()
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
            var data = response.data;

            app.globalData.sessionData = data

            wx.setStorage({
              key: 'session',
              data: data
            })

            app.updateUserInfo()

            app.redirectToRegisterPageIfNotBound()
          }
        })
      }
    })
  },
  setSession: function() {
    var app = this

    wx.getStorage({
      key: 'session',
      success: function (res) {
        var data = res.data

        if (data) {
          app.globalData.sessionData = data

          app.redirectToRegisterPageIfNotBound()
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
            'token': app.userToken()
          },
          method: 'PUT'
        })
      }
    })
  },
  globalData:{
    userInfo: null,
    sessionData: null
  },
  userToken: function() {
    return this.globalData.sessionData.token;
  },
  steamIdBound: function() {
    return this.globalData.sessionData.steam_id_bound;
  },
  redirectToRegisterPageIfNotBound: function() {
    if (!this.steamIdBound()) {
      wx.redirectTo({
        url: 'pages/register/new'
      })
    }
  }
})
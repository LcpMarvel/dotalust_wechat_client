//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    userInfo: {}
  },
  formSubmit: function (e) {
    var params = e.detail.value

    wx.request({
      url: app.serverHost() + '/api/wechat/steam_accounts',
      method: 'POST',
      header: {
        'token': app.globalData.token
      },
      data: {
        account_id: params.accountId
      },
      fail: function (e) {
        console.log(e)
      },
      success: function (response) {
        console.log(response)
      }
    })
  },
  onLoad: function () {
    var that = this

    app.getUserInfo(function (userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})

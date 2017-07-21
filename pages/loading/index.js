import { $wuxDialog } from '../../components/wux'

var app = getApp()

Page({
  data: {
    percent: 0,
    redirectPage: null
  },

  onLoad: function (options) {
    this.setData({
      percent: 0,
      redirectPage: options.redirect_page || '/pages/index/index'
    })

    this.channel = app.websocket.addChannel(options.channel, options.joinParams || {})
    this.channel.join()
  },

  redirectToPage() {
    let page = this

    $wuxDialog.alert({
      title: '获取数据完毕!',
      content: 'go!',
      onConfirm() {
        wx.redirectTo({
          url: page.data.redirectPage,
        })
      },
    })
  },

  setPercent(percent) {
    this.setData({
      percent: percent
    })

    if (percent >= 100) {
      this.redirectToPage()
    }
  },

  fetchCurrentPencent() {
    this.channel.push("new_progress")
      .receive("ok", ({ percent }) => {
        this.setPercent(percent)
      })
      .receive("timeout", () => {
        this.fireFetchCurrent()
      })
  },

  fireFetchCurrent(timeout = 3000) {
    setTimeout(this.fetchCurrentPencent, timeout)
  },

  onReady: function () {
    this.fireFetchCurrent(1000)

    this.channel.on("new_progress", ({ percent }) => {
      this.setPercent(percent)
    })
  },

  onShow: function () {
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {

  },


})
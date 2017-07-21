import { Websocket } from './utils/websocket'
import Authentication from './utils/authentication'
import Request from './utils/request'

App({
  globalData: {
    userInfo: null,
  },

  onLaunch() {
    this.websocket = new Websocket(`${Request.serverHost('wss')}/socket`)
    this.websocket.connect()

    this.authentication = new Authentication
    this.authentication.checkSession(() => {
      this.updateUserInfo()
    })

    this.authentication.executeAuthTask((session) => {
      if (!session.steamIdBound) {
        wx.redirectTo({
          url: '/pages/register/new'
        })
      }
    })
  },

  getUserInfo(callback) {
    if (this.globalData.userInfo) {
      return this.globalData.userInfo
    } else {
      wx.getUserInfo({
        success: (data) => {
          this.globalData.userInfo = data.userInfo

          callback(data.userInfo, data)
        }
      })
    }
  },

  updateUserInfo() {
    this.getUserInfo((_userInfo, data) => {
      Request.authSend(this.authentication, {
        url: '/api/wechat/user',
        data: {
          encrypted_data: data.encryptedData,
          iv: data.iv,
          raw_data: data.rawData,
          signature: data.signature
        },
        method: 'PUT'
      })
    })
  },

  refreshData(id, callback) {
    Request.authSend(this.authentication, {
      url: `/api/wechat/steam_accounts/${id}/refresh`,
      method: 'POST',
      success: (data) => { callback(data) }
    })
  },

  changeBound(bound) {
    let callback = (session) => {
      if (!session.steamIdBound) {
        this.toRegisterPage(true)
      }
    }

    this.authentication.changeBound(bound, callback)
  },

  toRegisterPage(byRedirect) {
    if (byRedirect) {
      wx.redirectTo({
        url: '/pages/register/new',
      })
    } else {
      wx.navigateTo({
        url: '/pages/register/new'
      })
    }
  },
})

var app = getApp()

Page({
  data: {
    accountId: null,
    displayName: null,
    avatars: {},
    createdAt: null,
    default: true,
    valid: true,

    summary: {
      winningPercentage: 0,
      killsCountAvg: 0,
      deathsCountAvg: 0,
      assistsCountAvg: 0,
      goldPerMinuteAvg: 0,
      heroHealingAvg: 0,
      heroDamageAvg: 0,
      lastHitsCountAvg: 0,
      experiencePerMinuteAvg: 0,
      kdaAvg: 0
    }
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }

    app.auth_request(this.fetch_summary);
  },

  onReady: function () {

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

  fetch_summary: function() {
    var page = this;

    var url = app.serverHost() + '/api/wechat/steam_account/summary'

    if (page.data.id) {
      url = app.serverHost() + '/api/wechat/steam_accounts/' + page.data.id + '/summary'
    }

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'token': app.userToken()
      },
      fail: function (e) {
        console.log(e)
      },
      success: function (response) {
        var data = response.data;
        var summary = data.summary;

        page.setData({
          id: data.id,
          accountId: data.account_id,
          displayName: data.display_name,
          avatars: data.avatars,
          createdAt: data.created_at,
          default: data.default,
          valid: data.valid,
          summary: {
            winningPercentage: summary.winning_percentage,
            killsCountAvg: summary.kills_count_avg,
            deathsCountAvg: summary.deaths_count_avg,
            assistsCountAvg: summary.assists_count_avg,
            goldPerMinuteAvg: summary.gold_per_minute_avg,
            heroHealingAvg: summary.hero_healing_avg,
            heroDamageAvg: summary.hero_damage_avg,
            lastHitsCountAvg: summary.last_hits_count_avg,
            experiencePerMinuteAvg: summary.experience_per_minute_avg,
            kdaAvg: summary.kda_avg
          }
        })
      }
    })
  }
})

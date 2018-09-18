//app.js
App({

  autoShare: function () {
    wx.getClipboardData({
      success: function (res) {
        var value = res.data;
        var validateStr = "mp.weixin.qq.com";//验证器
        var isWeixin = value.indexOf(validateStr);
        if (isWeixin >= 0) {
          // var userInfo = this.data.userInfo;
          wx.request({
            url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/revieweassy?url=' + value,
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //console.log(res.data.title)
              var title_name = res.data.title;
              if (title_name.length >= 28) {
                title_name = title_name.substring(0, 28) + "...";
              }
              wx.showModal({
                title: '分享文章',
                content: '检测到：' + title_name + '这篇好文章，求分享！',
                showCancel: true,
                cancelText: "暂不",
                cancelColor: "#333",
                confirmText: "好的！",
                confirmColor: "#405f80",
                success: function (res) {
                  if (res.confirm) {
                    var userId = wx.getStorageSync('userId');
                    var currentUrl = 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addeassy?url=' + value + '&userid=' + userId;
                    wx.request({
                      url: currentUrl,
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      }
                    })
                    wx.setClipboardData({
                      data: '微微有读悄悄地挖走了你刚刚复制的链接，啦啦啦',
                      //清空剪贴板内容
                    })
                    wx.showToast({
                      title: '感谢您的分享',
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  onShow: function () {
    this.autoShare();
   
  },

  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    //获取用户位置
    // wx.getLocation({
    //   success: function (res) {
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;

    //   },
    // })
    this.autoShare();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        //console.log(code);
        wx.request({
          url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/adduser?code=' + code,
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //console.log(res);
            var userId = res.data;
            wx.setStorageSync('userId', userId)
          },
        })

      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    labels:{}
  }
})
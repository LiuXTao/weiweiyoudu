//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {}, //用户信息
    labels:[],    //用户标签

    hasUserInfo: false,  //判断有用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  onShareTap: function (event) {
    wx.navigateTo({
      url: '../upload/upload',
    })
  },
  onMyCollectTap: function (event) {
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  onMyShareTap: function (event) {
    wx.navigateTo({
      url: '../shared/shared',
    })
  },
  formSubmit: function (event) {
    var value = event.detail.value.input;//用户输入值
    var validateStr = "mp.weixin.qq.com";//验证器
    var isWeixin = value.indexOf(validateStr); //判断用户输入值是否符合验证器格式，以检测该输入是正确的url形式
   // 判断是否已经授权登录
    this.getCurrentTime();
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录哦',
        icon: 'none'
      })
    }
    else {
      //如果输入值符合正确url格式
      if (isWeixin >= 0) {
        //把用户上传的url文章传到服务器
        var userInfo = this.data.userInfo;
        var userId = wx.getStorageSync('userId');
        var currentUrl = 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addeassy?url=' + value + '&userid=' + userId;
        wx.request({
          url: currentUrl,
          method: 'GET',
          header: {
            'content-type': 'application/json'
          }
        })
        wx.showToast({
          title: '感谢您的分享',
        })
      }
      else {
        wx.showToast({
          title: '链接只能是公众号号的推送哦',
          icon: 'none'
        })
      }
    }
  },
  //
  getCurrentTime: function () {
    var timestamp = Date.parse(new Date());//时间戳
    var date = new Date();
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }//个位数区分
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    console.log(currentdate);
    console.log(timestamp);
  },

  onLoad: function () {
    var that = this
    var userId = wx.getStorageSync("userId")
    console.log(userId)
    that.data.labels.length=0
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.getLabel()
  },
  //获取用户标签
  getLabel:function(){
    var that = this
    var userId = wx.getStorageSync("userId")
    if(!userId){
      console.log(userId)
    }else{
    console.log(123)
    wx.showNavigationBarLoading();
    wx.request({

      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/category?userid=' + userId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var list = [];
        var level = ["最爱", "超爱", "喜欢"]
        for (var i = 0; i < res.data.length; i++) {
          list.push(level[i] + that.classifier(res.data[i]))
        }
        that.setData({
          labels: list
        })
        wx.hideNavigationBarLoading();
      }
    })
    }
  },
  //分类器
  classifier:function(inputs){
    if(inputs==='game') return "游戏"
    else if (inputs==='tech') return "科技"
    else if (inputs === 'gossip') return "八卦"
    else if (inputs === 'travel') return "旅游"
    else if (inputs === 'story') return "故事"
    else if (inputs === 'car') return "汽车"
    else if (inputs === 'job') return "职场"
    else if (inputs === 'pet') return "宠物"
    else if (inputs === 'star') return "星座"
    else if (inputs === 'sport') return "体育"
    else if (inputs === 'food') return "美食"
    else if (inputs === 'fashion') return "时尚"
    else if (inputs === 'war') return "军事"
    else if (inputs === 'health') return "养生"
    else if (inputs === 'fun') return "搞笑"
    else if (inputs === 'hot') return "热门"
  },

  getUserInfo: function (e) {
    var that = this
    if (e.detail.errMsg === "getUserInfo:fail auth deny"){
      that.setData({
        userInfo:{},
        hasUserInfo:false
      })
    }
    else{
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

    }
  },
  onShow:function(){
    var that = this
    that.getLabel()
  },
  onShareAppMessage: function () {
    return {
      path: '/pages/list/list',
      imageUrl: 'https://cloud-minapp-2277.cloud.ifanrusercontent.com/1fBVuzctMLwEnenJ.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})

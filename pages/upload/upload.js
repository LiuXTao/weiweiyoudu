// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: null,
    showModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    setTimeout(function () {
      //要延时执行的代码
      that.setData({
        showModal:true
      })  
    }, 700) //延迟时间 这里是1秒  
  },
  formSubmit: function (event) {
    var value = event.detail.value.input;//用户输入值
    var validateStr = "mp.weixin.qq.com";//验证器
    var isWeixin = value.indexOf(validateStr);
    if (isWeixin >= 0) {
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  preventTouchMove: function () {

  },


  close: function () {
    var that = this;
    that.setData({
      showModal: false
    })
  }

 
})
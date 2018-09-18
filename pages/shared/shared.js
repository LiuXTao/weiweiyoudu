// pages/shared/shared.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = wx.getStorageSync('userId');
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/myshare?userid=' + userId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          collectlist: res.data
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  //点击文章的触发函数，显示文章的详情
  onTap: function (event) {
    var url = event.currentTarget.dataset.elementurl;
    wx.navigateTo({
      url: "../article/article?url=" + url
    })
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
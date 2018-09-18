// pages/article/article.js
Page({
  data: {

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var image = this.data.image;
    var title = this.data.title;
    var userId = wx.getStorageSync('userId');
    var id = this.data.id;
    var myurl = this.data.myurl;//已经encode后的url
   
    return {
      title: title,
      imageUrl: image,
      path: '/pages/list/list?url=' + myurl + '&id=' + id,
      success: function (res) {
        // 转发成功
        wx.request({
          url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addtransmit?userid=' + userId + '&eassyid=' + id
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad: function (options) {
    var userid = wx.getStorageSync("userId")
    console.log("userid", userid)
    var encodedUrl = options.url;
    var articleurl = decodeURIComponent(encodedUrl);//这是未转码前的url
    var myurl = encodeURIComponent(articleurl);//这是转码后的url准备用来传

    var id = options.id;
    var startTime = (new Date()).valueOf();
    //console.log(startTime);
    var that = this;
    var targetUrl = "https://harvielovemoon.top/NewsApi/public/index.php/wechat/content?url=" + myurl;
    wx.request({
      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/revieweassy?url='+myurl,
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var title_name = res.data.title;
        var image = res.data.img;
        that.setData({
          title: title_name,
          image: image
        })
      }
    })
    this.setData({
      url: targetUrl,
      myurl:myurl,
      startTime: startTime,
      id: id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //以后考虑计时的时候添加
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
    //console.log('unload');
    var id = this.data.id;
    var userId = wx.getStorageSync('userId');
    var endTime = (new Date()).valueOf();
    var startTime = this.data.startTime;
    var time = endTime - startTime;
    wx.request({
      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addview?userid=' + userId + '&eassyid=' + id + '&time=' + time,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    })
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

})
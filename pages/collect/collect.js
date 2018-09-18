// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_index:"",
    leftWidth:[],
    editIndex: 0,
    delBtnWidth: 150

    //删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = wx.getStorageSync('userId');
    wx.showNavigationBarLoading();
    var that = 
    this;
    wx.request({
      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/mycollection?userid=' + userId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       var left=[]
       for(var i = 0;i<res.data.length;i++){
         left.push(0)
       }
        console.log(res.data)
        that.setData({
          collectlist: res.data,
          leftWidth:left
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  //点击公众号，自动复制公众号名，方便用户搜索
  onAuthorTap: function (event) {
    var author = event.currentTarget.dataset.elementauthor;
    //console.log(author);
    wx.setClipboardData({
      data: author,
      success: function (res) {
        wx.showToast({
          title: '已复制公众号名称，赶快去关注吧',
          icon: 'none',
          duration: 1300
        })
      }
    })
  },
  //点击文章的触发函数，加载文章详情页面
  onTap: function (event) {
    var url = event.currentTarget.dataset.elementurl;

    wx.navigateTo({
      url: "../article/article?url=" + url
    })
  },
  //删除收藏文章的函数
  onDeleteTap: function(event){
    var id = event.currentTarget.dataset.elementid;
    var idx = event.currentTarget.dataset.elementidx;
    var userId = wx.getStorageSync('userId');
    var currentCollectList = this.data.collectlist;
    var that = this;
    var list = that.data.leftWidth
    list.pop()
    list[this.data.item_index] = 0
    wx.showModal({
      title: '取消收藏',
      content: '确定取消收藏？',
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res){
        if (res.confirm) {
          currentCollectList.splice(idx,1);
          // console.log(currentCollectList);
          //先进行页面渲染
          that.setData({
            leftWidth:list,
            collectlist: currentCollectList
          })
          //向服务器发送请求，取消收藏该id的文章
          wx.request({
            url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/delcollection?userid=' + userId +
            '&eassyid=' + id,
            method: 'GET',
            header: {
              'content-type': 'application/json'
            }
          })
          //同时建立缓存
          var articlesCollected = new Array();
          articlesCollected = wx.getStorageSync('articles_collected');
          articlesCollected[id - 1] = false;
          wx.setStorageSync('articles_collected', articlesCollected);
        }
      }
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

  },
  touchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    
  
    var that = this
     that.data.leftWidth[this.data.item_index]=0
     if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = 0;
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = 0;
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = - disX ;
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = - delBtnWidth ;
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.leftWidth;
      list[index]=txtStyle
    
      //更新列表的状态
      this.setData({
        leftWidth:list,
        item_index: index,
      });
    }
  },
  touchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? -delBtnWidth : 0;
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.leftWidth;
      list[index] = txtStyle
      //更新列表的状态
      this.setData({
        leftWidth: list,
        item_index: index,
      });
    }
  }
})
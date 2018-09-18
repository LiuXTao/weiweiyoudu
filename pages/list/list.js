// pages/list/list.js
Page({
  data: {
    datalist: {},
    articlesLoved: {},
    count: 1,
    IsNoMore: false,

    visibility:"",   //是否显示
    text: " 使用Tips： 1.分享推送：复制微信推送链接，进入微微有读小程序即可分享推送。 2. 关注公众号：点击喜欢的公众号名称即可复制后加关注。详情请看致新用户",
    marqueePace: 1.6, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 20, //滚动边界
    size: 14,      //字体大小
    interval: 50   // 时间间隔
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.url) {
      //如果是转发而来的就是options当中有id和url
      console.log("list中的id");
      console.log(options.id);
      console.log(options.url);
      wx.navigateTo({
        url: "../article/article?url=" + options.url + "&id=" + options.id
      })
    }
    //获取推送文章列表
    this.requestList();
    var userId = wx.getStorageSync('userId');
    // console.log(userId);
    //喜欢文章列表
    var articlesLoved = new Array();
    articlesLoved = wx.getStorageSync('articles_loved');
    if (articlesLoved) {
      this.setData({
        articlesLoved: articlesLoved
      })
    }
    else {//第一次进入小程序则新建缓存
      var articlesLoved = new Array();
      wx.setStorage({
        key: 'articles_loved',
        data: articlesLoved,
      })
      this.setData({
        articlesLoved: articlesLoved
      })
    }
    //收藏列表
    var articlesCollected = new Array();
    articlesCollected = wx.getStorageSync('articles_collected');
    if (articlesCollected) {
      this.setData({
        articlesCollected: articlesCollected
      })
    }
    else {//第一次进入小程序则新建缓存
      var articlesCollected = new Array();
      wx.setStorage({
        key: 'articles_collected',
        data: articlesCollected,
      })
      this.setData({
        articlesCollected: articlesCollected
      })
    }
  },
  //复制公众号名字，方便用户搜索该公众号
  onAuthorTap: function (event) {
    var author = event.currentTarget.dataset.elementauthor;
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
  //收藏文章的触发函数函数
  onCollectTap: function (event) {
    var id = event.currentTarget.dataset.elementid;// 文章id
    var userId = wx.getStorageSync('userId');
    var articlesCollected = new Array();
    articlesCollected = wx.getStorageSync('articles_collected');
    if (articlesCollected[id - 1] != null) {
      articlesCollected[id - 1] = !articlesCollected[id - 1];
    }
    else {
      articlesCollected[id - 1] = true;
    }
    //将用户添加收藏的文章的id传到服务器
    if (articlesCollected[id - 1] == true) {
      //添加收藏同步到服务器
      wx.request({
        url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addcollection?userid=' + userId +
        '&eassyid=' + id,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    } else {
      //取消收藏同步到服务器
      wx.request({
        url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/delcollection?userid=' + userId +
        '&eassyid=' + id,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }
    //建立缓存，节省服务器操作时间，提高用户体验
    wx.setStorageSync('articles_collected', articlesCollected);
    this.setData({
      articlesCollected: articlesCollected
    })
    wx.showToast({
      title: articlesCollected[id - 1] ? "收藏成功" : "取消成功",
      duration: 600,
      icon: "success"
    })
  },
  //喜欢文章 的触发函数
  onLoveTap: function (event) {
    //文章自身id对应articlesLoved数组下标 
    var userId = wx.getStorageSync('userId');
    var id = event.currentTarget.dataset.elementid;
    var idx = event.currentTarget.dataset.elementidx;//加载出来的文章顺序Index,以后按优先度排序后index和id是不同的
    var datalist = this.data.datalist;
    var currentLove = datalist[idx].love;
    var articlesLoved = new Array();
    articlesLoved = wx.getStorageSync('articles_loved');
    if (articlesLoved[id - 1] != null) {
      articlesLoved[id - 1] = !articlesLoved[id - 1];
    }
    else {
      articlesLoved[id - 1] = true;
    }
    wx.setStorageSync('articles_loved', articlesLoved);
    this.setData({
      articlesLoved: articlesLoved
    })
    //变成喜欢增加喜欢量
    if (articlesLoved[id - 1] == true) {
      //将喜欢的文章的id同步到服务器
      wx.request({
        url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/addlove?userid=' + userId + '&eassyid=' + id,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
   
      var currentLoveNum = parseInt(currentLove) + 1;
    } else {
      wx.request({
        url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/downlove?userid=' + userId + '&eassyid=' + id,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
      var currentLoveNum = parseInt(currentLove) - 1;
    }
   //根据用户操作实时渲染用户的行为
    datalist[idx].love = currentLoveNum;
    this.setData({
      datalist: datalist
    })
  },
  //请求文章的函数
  requestList: function () {
    var userid = wx.getStorageSync("userId")
    if (!userid) {
      userid=1
      //用户id在第一次进入小程序时默认为1
      wx.setStorageSync('userId', userid)
    }

    //提示用户处于加载状态
    wx.showNavigationBarLoading();
    var count = this.data.count;
 
    //console.log('https://harvielovemoon.top/NewsApi/public/index.php/wechat/list/' + count);
    var that = this;
    wx.request({
      url: 'https://harvielovemoon.top/NewsApi/public/index.php/wechat/list?pages=' + count +"&userid="+userid,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var totalData = {};
        if (res.data.length != 0) {
          count = count + 1;
        } else {
          var isNoMore = true;
          that.setData({
            isNoMore: isNoMore
          })
        }
        if (count > 2) {
          totalData = that.data.datalist.concat(res.data);
        } else {
          totalData = res.data;
        }
        that.setData({
          datalist: totalData,
          count: count
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  //点击某一文章的触发函数，进入文章页面
  onTap: function (event) {
    var url = event.currentTarget.dataset.elementurl;
    var id = event.currentTarget.dataset.elementid;
    // 转码url
    var encodedUrl = encodeURIComponent(url);
    wx.navigateTo({
      url: "../article/article?url=" + encodedUrl + "&id=" + id
    })
    //增加阅读量
    var idx = event.currentTarget.dataset.elementidx;//加载出来的文章顺序Index,以后按优先度排序后index和id是不同的
    var datalist = this.data.datalist;
    var currentView = datalist[idx].view;
    var currentViewNum = parseInt(currentView) + 1;
    datalist[idx].view = currentViewNum;
    this.setData({
      datalist: datalist
    })
  },
  //上拉刷新函数，加载更多文章
  onScrollLower: function (event) {
    console.log("加载更多");
    this.requestList();
  },
  //下滑刷新函数，
  onScrollUpper: function (e) {//下滑刷新
    var getRequestTime = new Date();
    var requestTime = getRequestTime.getTime()
    var lastTime = wx.getStorageSync('lastRequest');
    if (lastTime) {
      var interval = requestTime - lastTime;
      if (interval > 1000) {
        this.setData({
          count: 1
        })
        this.requestList();
      }
    }
    wx.setStorageSync('lastRequest', requestTime);
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
    //是否需要实时刷新
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    var articlesCollected = new Array();
    articlesCollected = wx.getStorageSync('articles_collected');
    that.setData({
      articlesCollected: articlesCollected,
      length: length,
      windowWidth: windowWidth
    })
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },
  //文字滚动函数
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
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
  },
  close:function(e){
  //  console.log(e)
    var that = this
    that.setData({
      visibility:"none"
    })

  }
})

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
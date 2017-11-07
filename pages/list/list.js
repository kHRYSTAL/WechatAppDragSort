const dragsort = require("../../templates/dragsort/dragsort.js");
var extend = require('../../lib/extend.js');

var page = {

  data: {
    itemTemplateName: "simpleItem",
    content: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setContent([
      { 'title': 1, 'desc': 1 },
      { 'title': 2, 'desc': 2 },
      { 'title': 3, 'desc': 3 },
      { 'title': 4, 'desc': 4 },
      { 'title': 5, 'desc': 5 },
      { 'title': 6, 'desc': 6 },
      ]);
    this.setItemHeight(96);
    this.setDragEventListener({
      onOrderChanged: function (sortResult) {
        console.log("onOrderChanged, result", sortResult);
      },

      onDragItemClick: function (index) {
        console.log("onDragItemClick, index:", index);
      }
    });
  }
};

var conf = extend(true, page, dragsort);
Page(conf);
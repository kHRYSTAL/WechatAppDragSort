/**
 * 拖拽排序模板。
 * page中的data需要指定列表item的模板名（itemTemplateName）。
 * page的wxml中调用dragsort template时data需要将itemTemplateName,curPositionIndex,
 *                   curDragIndex,content,start,itemHeight传递给dragsort模板。
 * 方法setContent(arr)  设置列表数据。参数为数组。设置后会更新页面
 * 方法setItemHeight(height)  在page中onload时需要调用，设置每个item的高度。
 * 方法setDragEventListener(listener) 设置拖拽监听，listener中目前有两个方法onOrderChanged、onDragItemClick
 *                                   分别为拖拽结束导致顺序变化的监听、item被点击的监听
 * 
 */
var downY;            //按下右侧icon时的Y坐标
var moveY;            //拖动item时的Y坐标
var itemHeight;       //每个item的高度
var curDragIndex;     //此次拖拽动作，拖拽的item的index
var curPositionIndex; //在拖拽过程中，手指所在位置是第几个item
var dragListener;

module.exports = {

  data: {
    curDragIndex: -1,     //当前拖动的item的index
    curPositionIndex: -1, //当前手指所在位置的index
    content: undefined,   //列表数据数组
    start: { y: 0 },      //被拖拽的view Y坐标
    itemHeight,
  },

  //设置列表数据数组
  setContent: function (obj) {
    this.setData({
      content: obj,
    });
  },

  //设置每个item的高度
  setItemHeight: function (height) {
    itemHeight = height;
    this.setData({
      itemHeight: height,
    });
  },

  //设置拖拽事件监听
  setDragEventListener: function (listener) {
    dragListener = listener;
  },

  //当按下由此拖拽按钮时触发
  movestart: function (e) {
    console.log("movestart index : " + e.currentTarget.dataset.index);
    console.log(e);
    downY = e.touches[0].clientY;
    curDragIndex = e.currentTarget.dataset.index;
    curPositionIndex = curDragIndex;
    var y2 = curDragIndex * itemHeight;
    this.setData({
      curDragIndex: curDragIndex,
      curPositionIndex: curDragIndex,
      start: { y: y2 },
    });
  },

  //当拖拽item 移动时触发
  move: function (e) {
    moveY = e.touches[0].clientY;
    var distance = moveY - downY; // 正为从上向下托 ；负为从下向上托
    console.log("move moveY ：" + moveY);
    console.log("move distance ：" + distance);
    curPositionIndex = Math.round(curDragIndex + distance / itemHeight);
    if (curPositionIndex < 0) {
      curPositionIndex = 0;
    }
    if (curPositionIndex >= this.data.content.length) {
      curPositionIndex = this.data.content.length - 1;
    }
    console.log("move curPositionIndex ：" + curPositionIndex);
    var y2 = curDragIndex * itemHeight + moveY - downY;
    if (y2 < 0) {
      y2 = 0;
    }
    if (y2 >= this.data.content.length * itemHeight - itemHeight) {
      y2 = this.data.content.length * itemHeight - itemHeight
    }
    this.setData({
      curPositionIndex: curPositionIndex,
      start: { y: y2 }
    });
  },

  //手指抬起，拖拽操作结束
  moveend: function () {
    console.log("moveend curDragIndex " + curDragIndex);
    console.log("moveend curPositionIndex " + curPositionIndex);
    if (this.data.curDragIndex < 0 || this.data.curPositionIndex < 0 || this.data.curDragIndex == this.data.curPositionIndex) {
      this.setData({
        curDragIndex: -1,
        curPositionIndex: -1,
        start: { y: 0 },
      });
      return;
    }
    var arr = this.data.content;
    var moveData = arr[curDragIndex];
    arr.splice(curDragIndex, 1);
    arr.splice((curPositionIndex), 0, moveData);
    this.setData({
      curDragIndex: -1,
      curPositionIndex: -1,
      content: arr,
      start: { y: 0 },
    });
    if (dragListener) {
      dragListener.onOrderChanged(arr);
    }
  },

  onDragItemClick: function (e) {
    if (dragListener) {
      var index = e.currentTarget.dataset.index;
      dragListener.onDragItemClick(index);
    }
  }
}
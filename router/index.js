
module.exports = {
  globalStyle: {
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '司机配送',
    navigationBarBackgroundColor: '#4a9ff8',
    backgroundColor: '#4a9ff8'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#4a9ff8',
    backgroundColor: '#f7f7f7',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/images/icon-homeed.png',
        selectedIconPath: 'static/images/icon-home.png',
        text: '首页'
      },
      {
        pagePath: 'pages/task/task',
        iconPath: 'static/images/icon-tasked.png',
        selectedIconPath: 'static/images/icon-task.png',
        text: '任务'
      },
      {
        pagePath: 'pages/my/my',
        iconPath: 'static/images/icon-myed.png',
        selectedIconPath: 'static/images/icon-my.png',
        text: '我的'
      }
    ]
  }
}

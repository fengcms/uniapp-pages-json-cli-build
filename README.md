# 动态生成 uniapp 配置文件 pages.json 的解决方案

最近接手了一个基于 `uniapp` 的开发项目，我个人对于它能够使用同一套代码就能够开发 h5\app\小程序 的强大功能表示非常钦佩。但是其配置文件 `pages.json` 也让我十分郁闷，原因无他，只因其是写死 `JSON` 文件，在管理的时候是十分不便的。

在搜索了一些资料，期望可以用 `pages.js` 文件来替代 `pages.json` 配置文件（JS的动态能力，可以很方便的拆分路由配置），但是没有找到很好的解决方案。倒是有一个，但是搞得过于繁琐，想想还是算球了。

于是，我自己用 `Nodejs` 手写了一个方案，虽然原始了一些，但是依赖十分轻，使用也比较便捷，个人感觉还是颇有用处的，所以特地撰文分享给大家。


## 构建文件构架

首先，我们在项目根目录中新建 `router` 文件夹，然后根据如下的格式构建文件结构。


```bash
router              # 动态路由文件夹
├── build.js        # 编译路由配置主文件
├── index.js        # 主配置文件
└── modules         # 动态路由模块文件
    └── small.js    # 拆分出来的模块路由文件
```

### 编写 `build.js` 文件

代码如下：

```js
const fs = require('fs')
const path = require('path')
const router = require('./index.js')

// 将子路由模块配置文件转化为 uniapp 配置文件格式
const buildRouter = route => {
  const res = []
  const { baseUrl, children } = route
  children.forEach(i => {
    const obj = {
      path: baseUrl + i.path,
      style: {
        navigationBarTitleText: i.name
      }
    }
    Object.keys(i).forEach(ii => {
      !['path', 'name'].includes(ii) && (obj.style[ii] = i[ii])
    })
    res.push(obj)
  })
  return res
}

// 自动加载 './modules' 目录子路由配置文件
const getRouter = () => {
  const srcPath = path.resolve(__dirname, './modules')
  const result = fs.readdirSync(srcPath)
  let router = []
  result.forEach(r => {
    const route = require('./modules/' + r)
    router = [...buildRouter(route)]
  })
  return router
}

// 构建 pages 并写入 pages.json 文件
router.pages = getRouter()
fs.writeFile(
  __dirname + '/../pages.json',
  // 我这边是用两个空格来缩进 pages.json，如果喜欢制表符，第三个参数更换你为 \t 即可
  JSON.stringify(router, null, '  '),
  e => e ? console.error(e) : console.log('pages.json 配置文件更新成功')
)

```

`build.js` 文件为主文件，是用于编译 `pages.json` 的。如果你有 `nodejs` 编程基础的话，这是一个巨简单的问题。如果没有的话，就不用管了，直接复制走即可。

### 编写 index.js 文件

这个文件没啥说的，就是除了 `pages.json` 这个文件中的 `pages` 字段外的其他内容，导出即可。我这边示例文件如下：

```js
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
```
这里面都是根据官方的配置去写即可了。因为这部分内容不多，因此没有必要拆分。区别就是，这里是JS，所以不用写双引号~呵呵。。。

### 编写 modules 下子路由文件

上代码：

```js
module.exports = {
  baseUrl: 'pages/small/',
  children: [
    {
      path: 'register',
      name: '注册'
    }, {
      path: 'login',
      name: '登录'
    }
  ]
}
```
导出一个对象，其中 `baseUrl` 是指你这些文件存放的位置目录。拆分出来的原因是不想在每个页面的路径里都要写这些重复的代码。

`children` 中就是该子路由涵盖的各个页面的路径以及标题了。

> 这里和 `uniapp` 默认的 `pages.json` 中的格式略有区别，我在 `build.js` 文件里面的 `buildRouter()` 函数就是做这个数据格式转化的。目的是为了让我们的子路由配置代码更加简洁。

这里需要注意的是，如果你需要使用到其他的配置项，就直接写就可以了。原来啥格式就是啥格式，比如这样：


```js
module.exports = {
  baseUrl: 'pages/small/',
  children: [
    {
      path: 'register',
      name: '注册',
      'app-plus': {
        titleNView: {
          buttons: [
            {
              text: '消息',
              fontSize: '16px'
            }
          ]
        }
      }
    }, {
      path: 'login',
      name: '登录'
    }
  ]
}

```
上面的这个 `'app-plus'` 会自动插入进去的，官方文档要求怎么写，你在这边就怎么写就好了。一般这个用得比较少，所以这个我就不做额外的处理了。

## 使用

构建好这些代码之后，直接在命令行中运行 `node router/build.js` 就会在项目根目录中生成 `pages.json` 文件了。

> 这里需要说明的是，我这边项目是使用 `hbuilder` GUI界面生成的项目，所以根目录就是项目根目录。**如果是使用的 CLI 工具生成的项目，上文中的根目录就变成了项目的 `src` 目录。**

如果想直接下载代码，可以看我的仓库 https://github.com/fengcms/uniapp-pages-json-cli-build 如果去 github 下载的话，给我点个赞哦！

## Copyright and License

Copyright by FungLeo(web@fengcms.com)

License: MIT


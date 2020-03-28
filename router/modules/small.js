// export default [
//   {
//     path: 'pages/register/register',
//     style: {
//       navigationBarTitleText: '注册'
//     }
//   }
// ]

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

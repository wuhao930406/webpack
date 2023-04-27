/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: "/",
    layout: "./layouts/index",
    routes: [
      {
        path: "/",
        redirect: "/work",
      },
      {
        path: "/user",
        component: "@/layouts/login/index",
        routes: [
          {
            path: "/user",
            redirect: "/user/login",
          },
          {
            name: "登录",
            path: "/user/login",
            component: "./user/login",
          },
          {
            name: "注册",
            path: "/user/signup",
            component: "./user/signup",
          },
        ],
      },
      {
        path: "/work",
        name: "欢迎使用",
        icon: "smile",
        component: "@/layouts/dashboard/index",
        routes: [
          {
            path: "/work",
            redirect: "/work/homepage",
          },
          {
            name: "个人主页",
            path: "/work/homepage",
            component: "./homepage",
          },
          {
            name: "个人中心",
            path: "/work/usercenter",
            component: "./usercenter",
          },
          {
            name: "组织管理",
            path: "/work/organization",
            component: "./organization",
          },
          {
            name: "教师管理",
            path: "/work/teacher",
            component: "./teacher",
          },
          {
            name: "学生管理",
            path: "/work/student",
            component: "./student",
          },
          {
            name: "班级管理",
            path: "/work/class",
            component: "./class",
          },
          {
            name: "模型管理",
            path: "/work/model",
            component: "./model",
          },
          {
            name: "平台日志",
            path: "/work/logs",
            component: "./logs",
          },
          {
            name: "课程管理",
            path: "/work/lessons",
            component: "./lessons",
          },
        ],
      },
      {
        path: "/share/:id",
        name: "项目详情",
        component: "./share",
      },
      {
        path: "/dashboard",
        name: "管理平台",
        component: "./dashboard",
        routes: [
          {
            path: "/dashboard",
            redirect: "/dashboard/user",
          },
          {
            name: "用户",
            path: "/dashboard/user",
            component: "./dashboard/user",
          },
          {
            name: "组织",
            path: "/dashboard/org",
            component: "./dashboard/org",
          },
        ],
      },
    ],
  },
  {
    path: "*",
    layout: false,
    component: "./404",
  },
];

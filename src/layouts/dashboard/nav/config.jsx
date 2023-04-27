// component
import SvgColor from "@/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`./assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "教学中心",
    children: [
      {
        title: "实训管理",
        path: "/work/user",
        icon: icon("ic-shixun"),
      },
      {
        title: "作业批阅",
        path: "/work/products",
        icon: icon("ic_book"),
      },
      {
        title: "成绩单",
        path: "/work/blog",
        icon: icon("ic_grade"),
      },
      {
        title: "教学情况",
        path: "/work/userc",
        icon: icon("ic_jiaoxue"),
      },
    ],
  },
  {
    title: "学习中心",
    children:[
      {
        title: "我的实训",
        path: "/work/usera",
        icon: icon("ic_training"),
      },
      {
        title: "我的成绩",
        path: "/work/home",
        icon: icon("ic_grades"),
        info: (
          <div
            style={{
              marginRight: 12,
              backgroundColor: "#ff4800",
              width: 20,
              height: 20,
              textAlign: "center",
              lineHeight: "20px",
              color: "#fff",
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            12
          </div>
        ),
      },
      {
        title: "学习记录",
        path: "/work/userc",
        icon: icon("ic_list"),
      },
    
    ]
  },
  {
    title: "管理中心",
    children:[
      {
        title: "首页",
        path: "/work/app",
        icon: icon("ic_analytics"),
      },
      {
        title: "组织管理",
        path: "/work/organization",
        icon: icon("ic_org"),
      },
      {
        title: "教师管理",
        path: "/work/teacher",
        icon: icon("ic_user"),
      },
      {
        title: "学生管理",
        path: "/work/student",
        icon: icon("ic_student"),
      },
      {
        title: "班级管理",
        path: "/work/class",
        icon: icon("ic_class"),
      },
      {
        title: "课程管理",
        path: "/work/lessons",
        icon: icon("ic_lock"),
      },
      {
        title: "模型管理",
        path: "/work/model",
        icon: icon("ic_3d"),
      },
      {
        title: "平台日志",
        path: "/work/logs",
        icon: icon("ic_blog"),
      },
    ]
  },

  
];

export default navConfig;

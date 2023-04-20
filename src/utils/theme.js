import { orange } from "@mui/material/colors";

// 白天模式主题配置
const lightTheme = {
  palette: {
    mode: "light", // 设置亮色主题
    primary: {
      main: "#2196f3", // 设置主色调
    },
    secondary: {
      main: "#f50057", // 设置次要颜色
    },
    background: {
      default: "#f0f0f0", // 设置默认背景颜色
      paper: "#fafafa", // 设置纸张颜色
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // 设置字体
    fontSize: 16, // 设置字体大小
    fontWeightLight: 300, // 设置轻字体的字重
    fontWeightRegular: 400, // 设置常规字体的字重
    fontWeightMedium: 500, // 设置中等字体的字重
  },
};

// 夜间模式主题配置
const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: orange[100],
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#212121",
      paper: "#424242",
    },
    text: {
      primary: "#fff",
      secondary: "#ccc",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // 设置字体
    fontSize: 16, // 设置字体大小
    fontWeightLight: 300, // 设置轻字体的字重
    fontWeightRegular: 400, // 设置常规字体的字重
    fontWeightMedium: 500, // 设置中等字体的字重
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: "red",
        },
      },
      outlined: {
        borderWidth: 2,
        "&:hover": {
          borderWidth: 2,
        },
      },
    },
    MuiCard: {
      root: {
        backgroundColor: "#303030",
      },
    },
  },
};

export default { lightTheme, darkTheme };

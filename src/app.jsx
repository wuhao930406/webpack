/* eslint-disable @typescript-eslint/no-unused-vars */
import { history } from "@umijs/max";
import { errorConfig } from "./requestErrorConfig";
import { doFetch } from "./utils/doFetch";
const loginPath = "/user/login";

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await doFetch({
        url: "/system/me",
      });
      return msg.data.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    localStorage.setItem("ID", currentUser?.id);
    return {
      fetchUserInfo,
      currentUser,
      activeUserIdList: [],
      vs: false,
      nav: 280,
      message: {
        open: false,
        snackbar: {
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        },
        type: "success",
        content: "",
      },
    };
  }
  return {
    fetchUserInfo,
    activeUserIdList: [],
    vs: false,
    message: {
      open: false,
      snackbar: {
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      },
      type: "success",
      content: "",
    },
    nav: 280,
  };
}
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

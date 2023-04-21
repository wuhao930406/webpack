/* eslint-disable eqeqeq */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { history } from '@umijs/max';
import { message } from 'antd';
import { extend } from 'umi-request';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;
  // if (response && response.status) {
  //   const errorText = codeMessage[response.status] || response.statusText;
  //   const { status, url } = response;
  //   if (response?.url.indexOf('api/user_token') == -1) {
  //     notification.error({
  //       message: `请求错误 ${status}: ${url}`,
  //       description: errorText,
  //     });
  //   }
  // } else if (!response) {
  //   if (response?.url.indexOf('api/user_token') == -1) {
  //     notification.error({
  //       description: '您的网络发生异常，无法连接服务器',
  //       message: '网络异常',
  //     });
  //   }
  // }

  return response ? response : {};
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  prefix: REACT_APP_URL, //前缀代理  tasks.nangaoyun.com
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let token = localStorage.getItem('TOKENES');
  if (token) {
    const headers =
      options.type == 'form'
        ? {
          token: token,
          }
        : {
            'Content-Type': 'application/json',
            token: token,
          };
    return {
      url: url,
      options: { ...options, headers: headers },
    };
  }
});

// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  if (options.url === '/webtool/download') {
    const data = await response.clone().blob();
    let blobUrl = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.style.display = 'none';
    let pathname = '项目_'+ options.params.filename + '_任务列表';
    a.download = pathname + '.xls';
    a.href = blobUrl;
    a.click();
    a.remove();
    return;
  }
  const data = await response.clone().json();

  // 详情返回的response处理
  if (data?.code !== "0000") {
    if (data?.error || data?.code === -1) {
      console.log(location.origin);
      // localStorage.removeItem('TOKENES');
      //history.replace('/user/login');
    } else {
      message.destroy();
      message.error(data?.msg);
    }
  }

  return response;
});

export default request;

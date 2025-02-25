import axios from "axios";
import {
  BuddyUserControllerApi,
  TeamControllerApi,
  TeamUserControllerApi,
} from "../openapi/api";
import { Configuration } from "../openapi";

// const myAxios = axios.create({
//   baseURL: import.meta.env.DEV ? 'http://localhost:5173/api' : 'http://192.168.1.29:8080/api',
//   timeout: 10000,
//   withCredentials: true,
// })

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    //console.log('config', config);
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //console.log('response', response);

    const { data } = response;
    //console.log("我得到响应了", data);
    // 未登录

    return response;
  },
  function (error) {
    // const { data } = error.response;
    // console.log("error", data);
    // if (data.statusCodeValue === 40010) {
    //   // 不是获取用户信息接口，或者不是登录页面，则跳转到登录页面
    //   if (!window.location.pathname.includes("/user/login")) {
    //     window.location.href = `/user/login?redirect=${window.location.href}`;
    //   }
    // }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

function getCongiguration() {
  const _saTokenInfo = JSON.parse(
    localStorage.getItem("saTokenInfo") as string
  );
  var header: any = {};

  if (_saTokenInfo != undefined) {
    const { tokenName, tokenValue } = _saTokenInfo;

    if (tokenName != undefined && tokenName != "") {
      header[tokenName] = tokenValue;
      header["Authorization"] = tokenValue;
    }
  }

  const configuration = new Configuration({
    basePath: "http://localhost:5173/api",
    baseOptions: {
      headers: {
        ...header,
      },
    },
  });
  return configuration;
}

const configuration = getCongiguration();

const buddyUserControllerApi = new BuddyUserControllerApi(configuration);
const teamControllerApi = new TeamControllerApi(configuration);
const teamUserControllerApi = new TeamUserControllerApi(configuration);

export { buddyUserControllerApi, teamControllerApi, teamUserControllerApi };

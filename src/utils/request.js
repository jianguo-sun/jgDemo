import axios from "axios";
import { ElMessage } from 'element-plus'
import store from "@/store";
import urlconfig from "./urlconfig.json"
const service = axios.create({
    //根据环境变量 统一设置 域名 前缀,实际请求的路径是 baseURL + requestUrl
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // baseURL: urlconfig.baseUrl,
    // baseURL: 'http://s2403680100107.sit.internal.virtueit.net:82/v0/harbourserver/',
    // withCredentials:true,//跨域请求时发送Cookie
    timeout: 300000, // 设置超时时间
});
// 请求拦截
service.interceptors.request.use(
    (config) => {
        // 请求前加一些需要的逻辑，如再请求头中加参数
        // if (store.getters.token) {
        //     config.headers['Authorization'] = getToken()
        // }
        //最终要返回这个配置
        // console.log(config)
        return config;
    },
    (error) => {
        //请求失败时的逻辑
        return Promise.reject(error);
    }
);
// 响应拦截
service.interceptors.response.use(
    (res) => {
        // console.log(res)
        if (res.status != 200) {
            // ElMessage({type: 'error', message: '请求数据错误'});
            return Promise.reject('error');
        }

        if (res.data.code != 200) {
            if (res.data.code == 401) {
                //token失效，重新返回登录页面
                location.href = '/login';
            }
            // ElMessage({type: 'error', message: res.data.msg});
            return Promise.reject(res.data);
        }

        return res.data;
    },
    (error) => {
        console.log("err" + error); // for debug
        // ElMessage({ type: 'error', message: error || '请求失败' })
        return Promise.reject(error)
    }
);

export default service;

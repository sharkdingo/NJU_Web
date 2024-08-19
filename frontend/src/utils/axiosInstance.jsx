import axios from 'axios';

// 配置基本的 API URL
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:7001', // 后端服务器的基本 URL
    timeout: 1000,
});

export default axiosInstance;

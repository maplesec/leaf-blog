import axios from 'axios'
import config from '../../config/config.js'

axios.defaults.timeout = 15000
axios.defaults.baseURL = config.base_url;

axios.interceptors.request.use(
    config => {
        config.headers['token'] = 'test-token'
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default axios

import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const loading = {
  loadingInstance: null,
  //打开加载
  open () {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        target: ".app-main",
        background: 'rgba(0,0,0,0.5)',
        spinner: "el-icon-loading",
      })
    }
  },
  
  //关闭加载
  close () {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  }
}



// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.log('getoken',getToken())
      config.headers['authorization'] = getToken()
    }
    //打开加载窗口
    loading.open()
    return config
  },
  error => {
    //关闭加载窗口
    loading.close()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    //关闭加载窗口
    loading.close()
    return res

  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

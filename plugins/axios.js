//引入element-ui提示
import { Message } from 'element-ui'
//axios错误拦截
export default (data) => {
    // console.log(data);
    //该方法只会截取到错误
    data.$axios.onError((err) => {
        //err.response ：可以获取到服务器返回的整个返回的错误对象
        //解构出错误信息 statusCode:服务器返回的状态码，message: 错误提示 
        const { statusCode, message } = err.response.data
        if (statusCode === 400) {
            //提示用户
            Message.error(message)
        }
    })
}









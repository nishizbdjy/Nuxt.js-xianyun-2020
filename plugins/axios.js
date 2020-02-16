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
        //判断用户提交订单时，token传递错误(401)，或没传Authorization(403)错误的的处理
        if (statusCode === 401 || statusCode === 403) {
            //提示用户登陆
            Message.error('请先登陆...')
            //跳转到登陆页
            // data.redirect(状态码,路由地址，{参数})
            data.redirect(200, '/user/login', {returnUrl:data.route.fullPath})//传递当前页面整个路由，参数
        }
    })
}









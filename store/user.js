//库
export const state = () => {
    return { userinfo: {} }
}
//储存数据的方法
export const mutations = {
    stockpile(state, data) {
        state.userinfo = data
    }
}
//异步储存的方法
export const actions = {
    //登陆
    login(store, data) {
        return this.$axios({
            url: "/accounts/login",
            method: "post",
            data
        }).then(res => {
            const { data } = res;
            //存储到state
            store.commit("stockpile", data);
        })
    },
    //获取验证码 
    hqyanzhengma(store, data) {
        return this.$axios({
            url: "/captchas",
            method: "post",
            data: { tel: data }
        })
    },
    //注册
    register(store, data) {
        return this.$axios({
            url: "/accounts/register",
            method: "post",
            data
        }).then(res => {
            //存储数据
            store.commit('stockpile', res.data)
        });
    }
}
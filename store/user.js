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
    }
}
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
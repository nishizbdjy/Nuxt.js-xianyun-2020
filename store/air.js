//历史查询记录的存储
export const state = () => {
    return {
        history: []
    }
}
//存储历史查询的方法
export const mutations = {
    cunchuHistory(state, data) {
        //添加到历史数组里面
        state.history.push(data)
    }
}
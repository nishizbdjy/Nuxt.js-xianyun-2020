//历史查询记录的存储
export const state = () => {
    return {
        history: []
    }
}
//存储历史查询的方法
export const mutations = {
    cunchuHistory(state, data) {
        //从前面添加到历史数组里面
        state.history.unshift(data)
        //规定5条数据
        if (state.history.length > 5) {
            state.history.length = 5
        }
    }
}
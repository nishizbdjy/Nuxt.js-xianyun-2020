//历史查询记录的存储
export const state = () => {
    return {
        //历史查询记录
        history: [],
        //总价展示组件的机票数据
        orderDetail: {
            //防止异步加载
            seat_infos: {}
        },
        //总价格
        zongjia:{
            //总价格
            allPrice: 0,
            //人数
            multiple:1
        }
        
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
    },
    //存储总价展示组件的机票数据
    addOrderDetail(state, data) {
        state.orderDetail = data

    },
    //存储总价格的方法
    storageAllPrice(state, data) {
        state.zongjia.allPrice = data.allPrice
        state.zongjia.multiple = data.multiple
    }
}
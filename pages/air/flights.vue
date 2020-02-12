<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
       <FlightsListHead/>

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in FlighsListdata"
         :key="index"
         :data="item"
         />
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
//引入头部
import FlightsListHead from "@/components/air/flightsListHead.vue";
//机票列表组件
import FlightsItem from '@/components/air/flightsItem.vue'
export default {
  data() {
    return {
      //机票列表数据
      FlighsListdata: {}
    };
  },
  components:{
    FlightsListHead,//头部组件
    FlightsItem,//机票列表组件s
  },
  mounted(){
     //获取机票列表
     this.$axios({
       url : '/airs',
       params:this.$route.query
     }).then(res=>{
       console.log(res);
       //将列表信息解构出来
       const {flights} = res.data
       this.FlighsListdata = flights
     })
  },
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
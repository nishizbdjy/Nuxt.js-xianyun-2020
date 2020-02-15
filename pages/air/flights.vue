<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="Flighsdata" @getData="getDataShijian" />
        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div v-if="dataList.length!==0">
          <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
        </div>
        <div v-else class="meiyou">没有该航班o(´^｀)o</div>
        <!-- 分页组件 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="zongshu"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <flightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
//引入头部
import FlightsListHead from "@/components/air/flightsListHead.vue";
//机票列表组件
import FlightsItem from "@/components/air/flightsItem.vue";
//筛选模块
import FlightsFilters from "@/components/air/flightsFilters.vue";
//历史记录组件
import FlightsAside from "@/components/air/flightsAside";
export default {
  data() {
    return {
      //筛选的拷贝的机票列表
      Flighsdata: {
        info: {},
        flights: [],
        options: {},
        total: ""
      },
      //机票列表数据
      FlighsListdata: {
        info: {},
        flights: [],
        options: {},
        total: ""
      },
      pageIndex: 1, //当前页码
      pageSize: 5, //显示条数
      zongshu: 0 //总数
    };
  },
  components: {
    FlightsListHead, //头部组件
    FlightsItem, //机票列表组件
    FlightsFilters, //筛选组件
    FlightsAside //搜索历史组件
  },
  // watch: {
  //   //历史记录 监听参数的变化
  //   $route() {
  //     //调用获取机票列表
  //     this.huoquFlights();
  //     //重置当前页数
  //     this.pageIndex = 1;
  //   }
  // },
  //使用组件守卫的方式 搜索历史记录
  //路由改变 组件复用的时候执行
  beforeRouteUpdate(to, from, next) {
    //  to:目标路由对象
    //  from:当前路由对象
    //  next:下一步
    next();
    //调用获取机票列表
    this.huoquFlights();

    //重置当前页数
    this.pageIndex = 1;
  },
  mounted() {
    //调用获取机票列表
    this.huoquFlights();
  },
  computed: {
    dataList() {
      //没有值返回空数组
      if (this.FlighsListdata.length === 0) {
        return [];
      } else {
        //slice截取返回一个新的数组
        const arr = this.FlighsListdata.flights.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageSize * this.pageIndex
        );
        return arr;
      }
    }
  },
  methods: {
    //封装获取机票列表
    huoquFlights() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        // console.log(res);
        this.FlighsListdata = res.data;
        //拷贝一份
        this.Flighsdata = { ...res.data };
        //将总条数赋值
        this.zongshu = res.data.total;
      });
    },
    //切换每页显示数时触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //切换页码时处触发
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    //筛选是子组件传递的事件
    getDataShijian(arr) {
      //赋值给机票列表
      this.FlighsListdata.flights = arr;
      //总数量
      this.zongshu = arr.length;
    }
  }
};
</script>

<style scoped lang="less">
.meiyou {
  font-size: 15px;
  color: red;
  text-align: center;
  height: 50px;
  line-height: 48px;
}
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
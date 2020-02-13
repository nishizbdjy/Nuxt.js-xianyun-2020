<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item,index) in plane_size"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <!-- 计算属性必须调用一次 -->
    <span>{{filter}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      //机场的大小
      plane_size: [
        {
          name: "大",
          size: "L"
        },
        {
          name: "中",
          size: "M"
        },
        {
          name: "小",
          size: "S"
        }
      ],
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "" // 机型大小
    };
  },
  computed: {
    //筛选多个条件
    filter() {
      const newarr = this.data.flights.filter(v => {
        //反证法  假设所有条件都满足
        let valid = true;
        // 有数据的时候再执行
        //机场
        if (this.airport && this.airport !== v.org_airport_name) {
          //不满足不返回
          valid = false;
        }
        //出发时间
        if (this.flightTimes) {
          //拿到选择时间数组
          const arr = this.flightTimes.split(",");
          const trr = v.dep_time.split(":");
          if (
            !(
              Number(trr[0]) >= Number(arr[0]) &&
              Number(trr[0]) < Number(arr[1])
            )
          ) {
            //不满足
            valid = false;
          }
        }
        //航空公司
        if (this.company && this.company !== v.airline_name) {
          //不满足
          valid = false;
        }
        //机型大小
        if (this.airSize && this.airSize !== v.plane_size) {
          //不满足
          valid = false;
        }
        //retrun 如果 为true就将当前的循环项返回
        return valid;
      });
      //发送事件给父组件
      this.$emit("getData", newarr);
      //只需要执行不需要数据在页面展示返回空
      return "";
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      //   //循环判断满足条件
      //   const newarr = this.data.flights.filter(v => {
      //     return v.org_airport_name === value;
      //   });
      //   //发送事件给父组件
      //   this.$emit("getData", newarr);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      //   console.log(value);
      //   //拿到选择时间数组
      //   const arr = value.split(",");
      //   const newarr = this.data.flights.filter(v => {
      //     const trr = v.dep_time.split(":");
      //     return (
      //       Number(trr[0]) >= Number(arr[0]) && Number(trr[0]) < Number(arr[1])
      //     );
      //   });
      //   this.$emit("getData", newarr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      //   //循环判断满足条件
      //   const newarr = this.data.flights.filter(v => {
      //     return v.airline_name === value;
      //   });
      //   //发送事件给父组件
      //   this.$emit("getData", newarr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      //   //循环判断满足条件
      //   const newarr = this.data.flights.filter(v => {
      //     return v.plane_size === value;
      //   });
      //   //发送事件给父组件
      //   this.$emit("getData", newarr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {}
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
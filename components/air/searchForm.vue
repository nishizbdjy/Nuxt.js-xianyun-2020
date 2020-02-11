<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          @blur="chufaBlur"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          @blur="mubiaoBlur"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          v-model="form.departDate"
          @change="handleDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
//引入日期插件
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "", //出发的城市
        departCode: "", //出发城市英文
        destCity: "", //到达城市
        destCode: "", //到达城市英文
        departDate: "" //日期
      },
      //防止用户没点击出发城市的数据
      chufa: [],
      //防止用户没点击目标城市的数据
      mubiao: []
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },
    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      if (value) {
        //调用获取城市
        this.huoquChengshi(value).then(res => {
          //防止用户没点击，存在出发数组里面
          this.chufa = res;
          //给回调函数返回
          cb(res);
        });
      }
    },
    //防止用户没点击，出发城市失焦时触发
    chufaBlur() {
      if (this.chufa.length !== 0) {
        //根据自己需求，默认选中第一个
        this.form.departCity = this.chufa[0].value;
        this.form.departCode = this.chufa[0].sort;
      }
    },
    //目标城市失焦
    mubiaoBlur() {
      if (this.mubiao.length !== 0) {
        //根据自己需求，默认选中第一个
        this.form.destCity = this.mubiao[0].value;
        this.form.destCode = this.mubiao[0].sort;
      }
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      if (value) {
        //调用获取城市
        this.huoquChengshi(value).then(res => {
          //防止用户没点击，存在出发数组里面
          this.mubiao = res;
          //给回调函数返回
          cb(res);
        });
      }
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      //   console.log(item);
      this.form.departCity = item.value; //赋值给出发城市
      this.form.departCode = item.sort; //出发城市英文名
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value; //赋值给目标城市
      this.form.destCode = item.sort; //目标城市英文名
    },

    // 确认选择日期时触发
    handleDate(value) {
      //是要插件将日期转换为我们想要的格式
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      //   //解构出来
      //   const { departCity, departCode, destCity, destCode } = this.form;
      //   //交换赋值
      //   this.form.departCity = destCity;
      //   this.form.departCode = destCode;

      //   this.form.destCity = departCity;
      //   this.form.destCode = departCode;
      [this.form.departCity, this.form.destCity] = [
        this.form.destCity,
        this.form.departCity
      ];
      [this.form.departCode, this.form.destCode] = [
        this.form.destCode,
        this.form.departCode
      ];
    },

    // 提交表单是触发
    handleSubmit() {
      //   console.log(this.form);
      //跳转到机票列表页
      if (!this.form.departCity) {
        this.$message("请填写出发城市");
      } else if (!this.form.destCity) {
        this.$message("请填写目标城市");
      } else if (!this.form.departDate) {
        this.$message("请填写日期");
      } else {
        this.$router.push({ path: "/flights", query: this.form });
      }
    },
    huoquChengshi(value) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        //改造数据添加value
        let newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        //返回给调用接收
        return newData;
      });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>

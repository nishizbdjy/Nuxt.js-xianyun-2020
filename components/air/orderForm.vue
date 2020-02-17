<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in flightsData.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×${form.users.length}  最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <!-- 调用计算总价 -->
    <span>{{totalPrices}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        users: [{ username: "", id: "" }], //用户列表
        insurances: [], //保险id
        contactName: "", //联系人名字
        contactPhone: "", //联系人电话
        captcha: "", //手机验证码
        invoice: false, //是否需要发票
        seat_xid: this.$route.query.seat_xid, //座位id
        air: this.$route.query.id //航班id
      },
      flightsData: {} //存储机票详情数据
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({ username: "", id: "" });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },
    //选择保险
    handleInsurance(id) {
      //判断已是否存在id
      const index = this.form.insurances.indexOf(id);
      //说明已经存在，用户要取消选择
      if (index != -1) {
        //删除存在的
        this.form.insurances.splice(index, 1);
      } else {
        // 说明用户要添加
        this.form.insurances.push(id);
      }
    },
    // 发送手机验证码
    handleSendCaptcha() {
      //判断用户是否填写了手机号
      if (this.form.contactPhone) {
        //手机号是否符合格式
        let trr = /^1[3-9][0-9]{9}$/.test(this.form.contactPhone);
        if (!trr) {
          //格式错误
          this.$message("手机号格式错误!");
        } else {
          //调用发送验证码
          this.$store
            .dispatch("user/hqyanzhengma", this.form.contactPhone)
            .then(res => {
              this.$notify({
                //展示给用户
                message: `模拟验证码为${res.data.code}`,
                type: "success"
              });
            });
        }
      } else {
        this.$message("请输入手机号!");
      }
    },
    // 提交订单
    handleSubmit() {
      //自己创建验证规则
      const rules = {
        //用户列表
        users: {
          //错误时的提示
          errMessage: "乘机人信息不能为空",
          //判断是否符合的函数
          vaildator: () => {
            //假设符合
            let valid = true;
            // 列表循环判断
            this.form.users.forEach(e => {
              if (!e.username || !e.id) {
                //只要有一项不满足就为false
                valid = false;
              }
            });
            return valid;
          }
        },
        //联系人名字
        contactName: {
          errMessage: "联系人名字不能为空",
          vaildator: () => {
            return !!this.form.contactName;
          }
        },
        //联系人电话
        contactPhone: {
          errMessage: "联系人电话不能为空",
          vaildator: () => {
            return !!this.form.contactPhone;
          }
        },
        //手机验证码
        captcha: {
          errMessage: "请输入验证码",
          vaildator: () => {
            return !!this.form.captcha;
          }
        }
      };
      //循环以上方法找到为false的 提示用户
      let valid = true; //假设所有都是通过的
      Object.keys(rules).forEach(v => {
        //避免重复提示
        //return结束不了循环，但是可以终止函数下面代码的执行，所有当有一个不满足就一直为false阻止下面的代码执行，它还在循环已经没用的
        if (!valid) return;
        //调用每一个的验证函数
        const yanzheng = rules[v].vaildator();
        //判断是否false
        if (!yanzheng) {
          //提示用户
          this.$message(rules[v].errMessage);
          //设为false
          valid = false;
        }
      });
      //验证失败 返回
      if (!valid) return;
      //调用接口提交订单
      this.$axios({
        url: "/airorders",
        method: "POST",
        data: this.form,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userinfo.token
        }
      }).then(res => {
        // console.log(res);
        if(res.status ===200){
        //提示用户
        this.$message.success('提交成功，正在生成订单...')
        //跳转
        setTimeout(()=>{
            this.$router.push({path:'/air/pay',query:{id:res.data.data.id}})
        },1500)              
        }
      });
    }
  },
  computed: {
    //由于数据是一样的，在这里计算总价
    totalPrices() {
      //判断数据还没回来
      if (!this.flightsData.seat_infos) {
        return;
      }
      let price = 0; //价格
      //成人机票
      price += this.flightsData.seat_infos.org_settle_price;
      //机建/燃油
      price += this.flightsData.airport_tax_audlet;
      //保险
      //循环保险数据，判断用户选择的保险数组里面是否有对应的id
      this.flightsData.insurances.forEach(v => {
        const index = this.form.insurances.indexOf(v.id);
        if (index !== -1) {
          //说明该项保险有
          price += v.price;
        }
      });
      //根据乘机人*
      price *= this.form.users.length;
      //存储到store总价格
      this.$store.commit("air/storageAllPrice", {allPrice:price,multiple:this.form.users.length});
      return "";
    }
  },
  mounted() {
    //根据id获取机票信息
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: `/airs/${id}`,
      params: {
        seat_xid
      }
    }).then(res => {
      // console.log(res);
      this.flightsData = res.data;
      //调用 存储总价展示组件的机票数据 不会动它数据不用拷贝也可以
      this.$store.commit("air/addOrderDetail", { ...res.data });
    });
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
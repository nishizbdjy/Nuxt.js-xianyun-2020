<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{orderDetail.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas ref="qrcode"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
//引入二维码生成插件
import QRCode from "qrcode";
export default {
  data() {
    return {
      //订单详情
      orderDetail: {},
      //定时器
      timer: ""
    };
  },
  mounted() {
    //store未回来的情况 setTimeout会等组件加载完成后执行
    setTimeout(() => {
      //获取订单详情
      this.$axios({
        url: `/airorders/${this.$route.query.id}`,
        //token
        headers: {
          Authorization: "Bearer " + this.$store.state.user.userinfo.token
        }
      }).then(res => {
        // console.log(res);
        //要生成的字符串
        const { code_url } = res.data.payInfo;
        //赋值给订单详情
        this.orderDetail = res.data;
        //使用插件生成二维码
        QRCode.toCanvas(this.$refs.qrcode, code_url, { width: 200 });
        //使用定时器的方式不停发送请求，获取支付状态
        this.timer = setInterval(() => {
          //调用获取支付状态
          this.isPay();
        }, 3000);
      });
    }, 0);
  },
  //该钩子函数会在组件销毁的时候触发
  destroyed() {
    //加入用户取消支付，回到其他页面，定时器还会执行，我们要将它停止
    clearInterval(this.timer);
  },
  methods: {
    //获取订单支付状态
    isPay() {
      // 订单id 金额 订单编号
      const { id, price, orderNo } = this.orderDetail;
      this.$axios({
        url: "/airorders/checkpay",
        method: "POST",
        data: {
          id,
          nonce_str: price,
          out_trade_no: orderNo
        },
        //token
        headers: {
          Authorization: "Bearer " + this.$store.state.user.userinfo.token
        }
      }).then(res => {
        //判断是否登陆
        if (res.data.statusTxt === "支付完成") {
          //结束定时
          clearInterval(this.timer);
          //提示用户支付成功
          this.$alert(`订单${res.data.statusTxt}`, "感谢购票", {
            confirmButtonText: "确定",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
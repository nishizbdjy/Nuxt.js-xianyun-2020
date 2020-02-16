<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <OrderForm />
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="$store.state.air.orderDetail"/>
      </div>
    </el-row>
  </div>
</template>

<script>
//引入表单组件
import OrderForm from "@/components/air/orderForm.vue";
//总价的展示
import OrderAside from "@/components/air/orderAside.vue";
export default {
  components: {
    OrderForm, //表单组件
    OrderAside //总价的展示
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>
<template>
  <div class="container">
    <div class="block">
      <el-carousel height="700px" class="Carousel">
        <el-carousel-item v-for="(item,index) in imgurl" :key="index">
          <div
          class="lbt"
            :style="`background:url(${$axios.defaults.baseURL + item.url}) center center no-repeat;
          background-size:contain contain;`"
          ></div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgurl: []
    };
  },
  mounted() {
    this.$axios({
      url: "/scenics/banners"
    }).then(res => {
      const { data } = res.data;
      this.imgurl = data;
    });
  }
};
</script>

<style lang="less" scoped>

.lbt {
  height: 700px;
}
.Carousel {
  width: 100%;
  min-width: 1000px;
}
</style>

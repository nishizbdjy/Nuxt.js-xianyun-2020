<template>
  <div class="box">
    <!-- 头部公共组件 -->
    <!-- 注意约定：公共组件不要写在子文件里面 -->
    <el-row type="flex" class="header" align="middle" justify="space-between">
      <div class="logo">
        <img src="/logo.jpg" alt />
      </div>
      <el-row type="flex" class="center" align="middle">
        <!-- 首页 -->
        <nuxt-link to="/">首页</nuxt-link>
        <!-- 旅游攻略 -->
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <!-- 酒店 -->
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <!-- 国内机票 -->
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>
      <!-- 登陆/注册 -->
      <nuxt-link to="/user/login" class="login">登陆 / 注册</nuxt-link>
      <!-- 登陆后的状态 -->
      <!-- <el-dropdown>
        <span class="el-dropdown-link">
            <img src="/logo.jpg" alt />
          名字
          <i data-v-1992e634 class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.center {
  flex: 1;
  margin: 0 20px;
  .nuxt-link-exact-active {
  background-color: #409eff;
  color: #fff;
  &:hover {
    color: #fff !important;
  }
}
  a {
      display: block;
    box-sizing: border-box;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
  }
  a:hover {
    border-bottom: 4px solid #409eff;
    color: #409eff;
  }
}
.logo {
  width: 156px;
  margin-top: 8px;
  img {
    height: 100%;
    width: 100%;
  }
}
.box {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 3px 0 #f5f5f5;
  z-index: 2;
  min-width: 1000px;
  box-sizing: border-box;
}
/deep/.header {
  width: 1000px;
  height: 60px;
  margin: 0 auto;
  .login {
    color: #666;
    border-bottom: 1px solid #fff;
    font-size: 14px;
    &:hover {
      color: #409eff;
      border-bottom: 1px solid #409eff;
    }
  }
}

.el-dropdown-link{
    cursor: pointer;

  img{
    width: 36px;
    height: 36px;
    border-radius: 50px;
    vertical-align:middle;
    border: 1.5px solid #fff;
    &:hover{
      border: 1.5px solid #409eff;
    }
  }
}
</style>
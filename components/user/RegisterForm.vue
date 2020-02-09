<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPass">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPass"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    //密码的验证
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        //输入值不为空，判断确认密码是否为空
        if (this.form.checkPass !== "") {
          //手动调用 验证确认密码和密码是否一致
          this.$refs.form.validateField("checkPass");
        }
        //确认密码为空
        callback();
      }
    };
    //确认密码的验证
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
        // 判断是否等于密码
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //手机号的验证
    const yanzhengUsername = (rule, value, callback) => {
      //正则
      let trr = /^1[3-9][0-9]{9}$/.test(value);
      if (value == "") {
        callback(new Error("请输入手机号"));
      } else if (trr) {
        callback();
      } else {
        callback(new Error("手机号格式错误"));
      }
    };
    return {
      // 表单数据
      form: {
        username: "", //手机号
        captcha: "", //验证码
        nickname: "", //名字
        password: "", //密码
        checkPass: "" //确认密码
      },
      // 表单规则
      rules: {
        username: [{ validator: yanzhengUsername, trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      //验证手机号
      let trr = /^1[3-9][0-9]{9}$/.test(this.form.username);
      if (trr) {
        //发送请求获取验证码
        this.$store
          .dispatch("user/hqyanzhengma", this.form.username)
          .then(res => {
            //提示用户验证码
            this.$notify.success("模拟验证码：" + res.data.code);
          });
      } else {
        this.$message("手机号格式错误");
      }
    },

    // 注册
    handleRegSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //发送注册请求
          //不需要checkPass，解构出来
          const { checkPass, ...data } = this.form;
          //调用注册方法
          this.$store.dispatch("user/register", data).then(() => {
            this.$message.success("注册成功");
            //跳转页面
            this.$router.push({ path: "/" });
          });
        }
      });
      //   console.log(this.form);
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
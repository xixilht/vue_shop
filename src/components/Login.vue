<template>
  <div class="login_container">

    <div class="login_box">

      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- 不需要切换显示隐藏密码框效果，可直接写 type="password"，不写 show-password -->
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" show-password></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  data() { // data 双向数据绑定
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // 这个this指向当前登录页面的 Vue 实例对象
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      /**
       * validate 函数接收一个回调函数，拿到验证的结果。
       * @param {boolean} valid 验证的结果
       */
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginForm)

        if (res.meta.status !== 200) return this.$message.error('登录失败')

        this.$message.success('登录成功')

        /*
        需求：项目中除了登录之外的其他 API 接口，必须在登录之后才能访问
        实现：token 只在当前网站打开期间生效。
        将登录成功后的 token 保存在客户端 sessionStorage 中，以后每次请求其他 API，就判断 token
        */
        window.sessionStorage.setItem('token', res.data.token)

        // 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  /* 添加位移，根据自身盒子大小在横轴上（左边）移动-50%，在纵轴上（上边）也移动-50% */
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  /* 给头像边框添加向外扩散10像素颜色为#ddd的阴影 */
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    /* less语法嵌套 */
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

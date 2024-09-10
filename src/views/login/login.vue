<template>
  <div class="wrapper">
    <img class="head" src="@/assets/images/login/login_title.png" alt="" />
    <div class="login_content">
      <el-form ref="formRef" :model="loginForm" :rules="rules" class="login_form">
        <!-- elform 输入账号密码 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号">
            <template #prepend>
              <img width="48" height="48" src="@/assets/images/login/user_name.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码">
            <template #prepend>
              <img width="48" height="48" src="@/assets/images/login/password.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">登&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref, getCurrentInstance } from "vue";
import { useUserStore } from "@/store/user";
// import Search from '@/assets/images/login/user_name.png'

const userStore = useUserStore();
const router = useRouter();
const formRef = ref();
// 定义loginForm
const loginForm = reactive({
  username: "",
  password: "",
});
const { proxy } = getCurrentInstance();
// 校验
const rules = reactive({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 提交
const onSubmit = async (formEl) => {
  await formEl.validate((valid, filelds) => {
    if (valid) {
      userStore.login(...Object.values(loginForm)).then(
        (res) => {
          proxy.$message.success("登录成功");
          router.push('/').catch(() => { });
        },
        (err) => {
          proxy.$message.error(err.msg);
        }
      );
    }
  });
};
</script>
<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/login/login_bg.png");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.head {
  height: 85px;
  margin: 0px 12px 29px;
}

.login_content {
  border-radius: 6px;
  width: 739px;
  height: 406px;
  /* padding: 45px 65px; */
  background-image: url("@/assets/images/login/login_box.png");
  background-size: cover;
}

.login_form {
  width: 55%;
  margin: auto;
  margin-top: 116px;

  :deep() .el-input__wrapper {
    background: #143a5d;
  }

  :deep() .el-input-group__prepend {
    background: linear-gradient(-30deg, #2780e3 0%, #2da4ef 100%);
    box-shadow: none;
    padding: 0;
  }

  .el-button {
    padding: 20px;
    width: 100%;
    background: linear-gradient(-90deg, #2780e3 0%, #1abcfe 100%);
    border-radius: 5px;

    span {
      // font-family: Alibaba PuHuiTi;
      font-weight: bold;
      font-size: 24px;
      color: #cbddf2;
      text-shadow: 0px 2px 5px rgba(13, 26, 59, 0.47);
    }
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

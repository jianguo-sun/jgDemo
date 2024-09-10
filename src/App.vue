<template>
  <!-- <el-config-provider :locale="zhCn"> -->
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
  <!-- </el-config-provider> -->
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
// import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>

<template>
  <div class="main_bg">
    <div class="screen_container" id="screenContainer" ref="screenContainer">
      <img class="head_line" src="@/assets/images/head_line.png" alt="" />
      <left-layout class="left_content"></left-layout>
      <div class="right_content">
        <RightHeader></RightHeader>
        <Information></Information>
        <ShipBox></ShipBox>
        <MjEfficiency></MjEfficiency>
        <MapContent @showDialog="clickMap"></MapContent>
        <!-- <rightCenter></rightCenter> -->
      </div>
    </div>
    <SyDialog v-model:open="open"></SyDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePageScale } from "@/hooks/usePageScale.js";
import RightHeader from "@/views/bigScreen/RightComponents/RightHeader.vue";
import SyDialog from "@/views/bigScreen/RightComponents/SyDialog/SyDialog.vue";
import Information from "@/views/bigScreen/RightComponents/Information.vue";
import MapContent from "@/views/bigScreen/RightComponents/MapContent.vue";
import MjEfficiency from "@/views/bigScreen/RightComponents/MjEfficiency.vue";
import ShipBox from "@/views/bigScreen/RightComponents/ShipBox.vue";
import LeftLayout from "./LeftLayout";
const screenContainer = ref(null);
usePageScale(screenContainer);

onMounted(() => { });

const clickMap = (params) => {
  showModal();
};

// 弹窗
const open = ref(false);
const showModal = () => {
  open.value = true;
};
const handleOk = () => {
  console.log(e);
  open.value = false;
};
</script>

<style>
.main_bg {
  overflow: hidden;
  background-size: 100% 100%;
  background-color: #000;
  width: 100vw;
  height: 100vh;
  /* background: linear-gradient(to right, #141f36, #165480); */
  background-image: url("@/assets/images/bg.png");
}

.screen_container {
  width: 1920px;
  height: 1080px;
  display: flex;
  /* transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms; */
  position: relative;
  overflow: hidden;
  z-index: 100;
  transform-origin: left top;
  background: transparent;
}

.left_content {
  width: 450px;
}

.right_content {
  margin-left: 20px;
  flex: 1;
  position: relative;
}


.head_line {
  width: 1920px;
  position: absolute;
  top: 59px;
}
</style>

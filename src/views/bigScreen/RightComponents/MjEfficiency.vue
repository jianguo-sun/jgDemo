<template>
  <div class="efficiency_div">
    <div class="containerBox">
      <img :src="HeadIcon" class="head_img" alt="" />
      <div class="container_div">
        <div class="title">门机效率</div>
        <div class="cardList">
          <div v-for="(item, index) in MjData" class="mj_card" :key="index">
            <div class="mj_num">{{ index }}#</div>
            <span class="num">&nbsp;{{ item }}</span><span class="unit">&nbsp;吨/时</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getMjInfo } from "@/api/index.js";
import { useTimeChange } from "@/hooks/useTimeChange.js";
import HeadIcon from "@/assets/images/icon_head.png";

const MjData = ref(useTimeChange(getMjInfo));

</script>

<style scoped lang="scss">
.efficiency_div {
  width: 100%;
  display: flex;
  justify-content: end;
}

.containerBox {
  width: 1006px;
  height: 68px;
  background: rgba(22, 41, 86, 0.68);
  border-radius: 5px;
  border: 1px solid transparent;
  border-image: linear-gradient(to right, #1dadf8, #3389e2) 1;
  margin-right: 16px;

  .head_img {
    width: 3px;
    height: 30px;
    float: left;
    margin-top: 18px;
  }
}

.container_div {
  margin: 5px 10px;

  .title {
    font-size: 18px;
    margin-left: 5px;
    font-weight: bold;
    color: #5bbeef;
  }

  .cardList {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }

  .mj_card {
    display: flex;

    // width: 120px;
    .mj_num {
      background-image: url("@/assets/images/icon_head_box.png");
      background-size: cover;
      background-repeat: no-repeat;
      width: 36px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
    }

    .num {
      color: #fcb73a;
      font-size: 16px;
      font-weight: bold;
      transform: skewX(-15deg);
    }

    .unit {
      font-weight: bold;
      font-size: 16px;
      color: #fff;
      transform: skewX(-15deg);
    }

    // height: 100%;
    /* background: #fff; */
    // align-items: center;
    // margin-right: 20px;
  }

  .label {
    width: 35px;
    line-height: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #5bbeef;
    margin: 0px 15px 0px 10px;
  }
}
</style>

<template>
  <div class="ship_div">
    <template v-if="shipList.length > 0">
      <div class="grid-container">
        <div v-for="item in shipList" class="grid-item" :key="item.shipName">
          <img :src="ShipImg" alt="" width="144px" height="40px" />
          <div class="ship_name">
            {{ item.shipName }}
          </div>
        </div>
      </div>
      <img :src="MaodiImg" alt="" height="20px" />
    </template>
    <NoData v-else></NoData>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NoData from "@/components/NoData.vue";
import ShipImg from "@/assets/images/shipright.png";
import MaodiImg from "@/assets/images/maodi.png";
import { getArShipInfo } from "@/api/index.js";
import { useTimeChange } from "@/hooks/useTimeChange.js";

const shipList = ref(useTimeChange(getArShipInfo));
onMounted(() => { });
</script>

<style scoped lang="scss">
.ship_div {
  text-align: center;
  position: absolute;
  left: 20px;
  top: 157px;
  width: 390px;
  height: 316px;
  border-radius: 25px;
  border: 1px solid #3389e2;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 40px;
  width: 390px;
  height: 297px;
  padding: 30px 35px;
  box-sizing: border-box;
  /* 包括 padding 和 border 在内的尺寸计算 */
}

.grid-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .ship_name {
    width: 96px;
    height: 20px;
    line-height: 20px;
    background: rgba(10, 18, 41, 0.48);
    border-radius: 10px;
    font-size: 16px;
    text-align: center;
    border: 1px solid #24f1ff;
    color: #fff;
    letter-spacing: 2px;
  }
}

// .containerBox {
//   width: 390px;
//   height: 316px;
//   background: rgba(22, 41, 86, 0.58);
//   border-radius: 25px;
//   border: 1px solid #3389e2;
//   display: grid;
//   grid-template-columns: repeat(2, 1fr); /* 两列，每列宽度相等 */
//   grid-template-rows: repeat(3, 1fr); /* 三行，每行高度相等 */
//   grid-gap: 5px;
//   justify-content: center; /* 居中对齐网格 */
// }</style>

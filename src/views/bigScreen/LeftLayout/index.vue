<template>
  <div>
    <div class="title">
      <img width="394" src="@/assets/images/head_title.png" alt="" />
    </div>
    <el-scrollbar class="scroll_h">
      <template v-if="showDetail">
        <ShipInDetail @goBack="handleGoBack" :currTimeStr="currTimeStr" :rowId="rowId" :inoutType="inoutType">
        </ShipInDetail>
      </template>
      <template v-else>
        <ShipInOut :dataList="filterWarnType(['3', '4'])"></ShipInOut>
        <ShipIn :dataList="filterWarnType('2')" @handleDetail="handleDetail" inoutType="in"></ShipIn>
        <ShipIn :dataList="filterWarnType('5')" @handleDetail="handleDetail" inoutType="out"></ShipIn>
      </template>
    </el-scrollbar>
  </div>
</template>
<script setup>
import ShipInOut from "./components/ShipInOut";
import ShipIn from "./components/ShipIn";
import ShipInDetail from "./components/ShipInDetail";
import bus from "@/utils/mitt";
import { useTimeChange } from "@/hooks/useTimeChange.js";
import { getPlanInfoList, getPlanInfo } from "@/api/index.js";

import { ref, computed } from "vue";
let showDetail = ref(false);
const inoutType = ref('in')
const currTimeStr = ref('')
const rowId = ref('')
const handleGoBack = () => {
  showDetail.value = !showDetail.value;
};
const handleDetail = (item) => {
  rowId.value = item.rowId;
  inoutType.value = item.inoutType;
  showDetail.value = true
};
const closeDetail = (time) => {
  currTimeStr.value = time
}
bus.on('changeTime', closeDetail);
// 所有类型计划数据
const planList = ref(useTimeChange(getPlanInfoList));
// 过滤某计划类型  2：入库；5：出库；3：进港；4：出港；
const filterWarnType = computed(() => {
  return (type) => {
    return planList.value.filter((item) => type.includes(item.planType)) || [];
  };
});

</script>
<style scoped>
.title {
  /* width: 359px;
  height: 34px; */
  /* text-align:center;
  font-family: YouSheBiaoTiHei;
  font-weight: 600;
  font-size: 34px;
  color: #ECEDEF; */
  padding: 20px 0 0 17px;
  margin-bottom: 20px;
  /* text-shadow: 0px 4px 1px rgba(19,80,143,0.66);
  background: linear-gradient(0deg, rgba(119,186,255,0.45) 0%, rgba(233,248,255,0.45) 73.3154296875%, rgba(255,255,255,0.45) 100%);
  opacity: 0.89;
  -webkit-background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
}

.scroll_h {
  height: 990px;
}
</style>

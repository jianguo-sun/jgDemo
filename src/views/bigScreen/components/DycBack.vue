<template>
  <SliderBtn></SliderBtn>
  <a-flex justify="space-between" class="time_box">
    <div>开始时间：<span class="time">{{ backData.startTime }}</span></div>
    <div>结束时间：<span class="time">{{ backData.endTime }}</span></div>
  </a-flex>
  <a-table :dataSource="tableDataFilter" :columns="getTableCol('dyBack')" :bordered="false" :pagination="false"
    :scroll="{ x: auto, y: 300 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'type'">
        <span class="point_type">{{ getTypeName(record.type) }}</span>
      </template>
    </template>
  </a-table>
</template>
<script setup>
import SliderBtn from "./SliderBtn";
import {
  getTableCol,
} from "../RightComponents/mapInfo.js";
import { onMounted, ref } from "vue";
const props = defineProps({
  tableData: [],
  backData: {
    type: Object,
  },
});
const tableDataFilter = ref([]);
onMounted(() => {
  tableDataFilter.value = props.tableData.filter(
    (item) => item.type == "3" || item.type == "4" || item.type == "9"
  );
});
// type: 3-回皮；4-装车；9-过重
const getTypeName = (type) => {
  switch (type) {
    case "3":
      return "回皮";
    case "4":
      return "装车";
    case "9":
      return "过重";
    default:
      return "";
  }
};
</script>
<style lang="scss" scoped>
.point_type {
  color: rgba(51, 232, 253, 1);
}

.time_box {
  font-weight: 400;
  font-size: 14px;
  color: #a2b9d3;
  margin-bottom: 10px;

  span {
    color: #d7e6f7;
  }
}
</style>

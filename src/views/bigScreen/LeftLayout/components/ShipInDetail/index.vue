<template>
  <div class="detail_box">
    <img width="54" src="@/assets/images/left/left_back.png" class="back_img" @click="goBack" alt="" />
    <div class="detail_t"><span class="title">计划信息</span></div>
    <a-row size="small" class="list">
      <a-flex justify="space-between" align="center" class="planhead">
        <div class="plancode">{{ detailData.planCode }}</div>
        <div class="planship">{{ detailData.shipName }}</div>
      </a-flex>
      <a-col :class="index == 2 || index == 3 ? 'even' : 'odd'" v-for="(item, index) in dataPlan" :key="index"
        :span="12" class="item_row">
        <div v-if="item.isPercent">
          {{ item.label }}：
          <span class="progress_t">{{ detailData[item.prop] || 0 }}%</span>
          <a-progress v-if="detailData[item.prop]" type="circle" :percent="detailData[item.prop] || 0" :size="20"
            strokeColor="#F5A51C" trailColor="rgba(23, 93, 171, 0.5)" :showInfo="true" />
        </div>
        <div v-else>
          {{ item.label }}：<span class="ton">{{
      detailData[item.prop] || 0
    }}</span><span class="unit">吨</span>
        </div>
      </a-col>
    </a-row>
    <div class="detail_t"><span class="title">货物信息</span></div>
    <a-list size="small" :data-source="dataGoods" class="list">
      <template #header>
        <a-flex justify="space-between" align="center" class="goods">
          <div>
            货类：<span class="ton">{{ detailData.goodsName }}</span>
          </div>
          <div>
            货主：<span class="ton">{{ detailData.goodsOwnerName }}</span>
          </div>
          <div>
            代理：<span class="ton">{{ detailData.goodsProxyName }}</span>
          </div>
        </a-flex>
      </template>
    </a-list>
    <div class="detail_t"><span class="title">作业场地</span></div>
    <a-list size="small" :data-source="dataGoods" class="list">
      <template #header>
        <a-flex justify="space-between" align="center" class="site">
          <template v-if="props.inoutType == 'in'">
            <div>
              卸船泊位：<span class="ton">{{ detailData.berthName }}</span>
            </div>
            <div>
              入库货位：<span class="ton">{{ detailData.inPositionName }}</span>
            </div>
          </template>
          <div v-else>
            出库货位：<span class="ton">{{ detailData.outPositionName }}</span>
          </div>
          <div></div>
        </a-flex>
      </template>
    </a-list>
    <div class="work_t">
      <div class="detail_t">
        <span class="title">作业预估</span>
      </div>
      <span :class="detailData.delayHour == '正常' ? 'sta_normal' : ''" class="work_status">{{ detailData.delayHour
        }}</span>
    </div>
    <a-row size="small" class="list">
      <a-col :class="index % 2 == 0 ? 'even' : 'odd'" v-for="(item, index) in dataWork" :key="index" :span="24"
        class="item_row">
        <div v-if="item.reason">
          原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因：
          <span class="ton">{{ detailData[item.prop] }}</span>
        </div>
        <div v-else>
          {{ item.label }}：<span class="ton">{{ detailData[item.prop] }}</span>
        </div>
      </a-col>
    </a-row>
    <div class="detail_t"><span class="title">作业派工</span></div>
    <a-list size="small" :data-source="dataGoods" class="list">
      <template #renderItem="{ index }">
        <a-list-item v-if="index == 0" :class="index % 2 == 0 ? 'even' : 'odd'">
          <a-flex justify="space-between" align="center" class="item_row">
            <div v-for="(img, idx) in carTypes" :key="idx">
              <a-flex align="center" class="car_box">
                <img :src="img.carSrc" width="32" @click="showCarInfo(img.type)" alt="" />
                <div class="car_num" @click="showCarInfo(img.type)">
                  &nbsp;&nbsp;×&nbsp;&nbsp;{{ detailData[img.count] || 0 }}
                </div>
              </a-flex>
            </div>
          </a-flex>
        </a-list-item>
        <a-list-item v-if="index != 0 && showCarInfos" :class="index % 2 == 0 ? 'even' : 'odd'">
          <a-flex justify="space-between" align="center" class="item_row">
            <a-row :gutter="8" class="machine_box">
              <a-col v-for="(car, idx) in carInfoList" :key="idx" :span="car.machineType == '1' ? 8 : 6">
                <a-button type="primary" ghost :class="currentMachineId == car.machineId
        ? 'work_chosedbtn'
        : 'work_btn'
      " @click="showCarQuan(car.machineId, null, car)">{{ car.machineName }}</a-button>
              </a-col>
            </a-row>
          </a-flex>
        </a-list-item>
      </template>
    </a-list>
    <template v-if="showCarQuans">
      <div class="detail_t"><span class="title">轨迹回放</span></div>
      <a-list size="small" :data-source="dataQuan" class="list">
        <template #renderItem="{ item, index }">
          <a-list-item :class="{
      even: index % 2 == 0,
      odd: index % 2 != 0,
      warning: getIsPersonOrCarWarning(item),
    }" @click="getWarning(item)">
            <a-flex justify="space-between" align="center" class="item_row">
              <!-- 倒运车3 -->
              <div v-if="currentMachineType == '3'">
                <span class="ton">{{ item.runCount }}</span>
              </div>
              <!-- 门机2 、装载机1、人5-->
              <div v-if="currentMachineType == '2' ||
      currentMachineType == '1' ||
      currentMachineType == '5'
      ">
                <span>{{ index + 1 }}</span>
              </div>
              <div v-if="currentMachineType == '2' || currentMachineType == ''">
                <span class="ton">{{ item.carPlate }}</span>
              </div>
              <div>{{ item.startTime }}-{{ item.endTime.substring(11) }}</div>
              <a-button type="primary" ghost class="review_btn" @click="playBack(item, $event)">轨迹回放</a-button>
            </a-flex>
          </a-list-item>
        </template>
        <template #loadMore>
          <div class="more" v-if="showMoreBtn">
            <a-button type="primary" ghost @click="onLoadMore()">更&nbsp;&nbsp;&nbsp;&nbsp;多</a-button>
          </div>
        </template>
      </a-list>
      <!-- <div class="detail_t"><span class="title">告警记录</span></div>
            <a-list size="small" :data-source="data" class="list">
                <template #renderItem="{ item,index }">
                    <a-list-item :class="index%2==0?'even':'odd'">
                        <a-flex justify="space-between" align="center" class="item_row">
                            <div><span class="ton">冀C56K32</span></div>
                            <div>2024-07-23 14:34 - 14:50:09</div>
                        </a-flex>
                    </a-list-item>
                </template>
            </a-list> -->
    </template>
  </div>
</template>
<script setup>
import menji from "@/assets/images/left/menji.png";
import zhuangzj from "@/assets/images/left/zhuangzj.png";
import daoyc from "@/assets/images/left/daoyc.png";
import people from "@/assets/images/left/people.png";
import { getPlanInfo, getMachineDetail } from "@/api/index.js";
import bus from "@/utils/mitt";
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  currTimeStr: "",
  rowId: "",
  inoutType: "",
});
const emit = defineEmits(["goBack"]);
const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
];
let dataPlan = [];
const dataInPlan = [
  { label: "卸船计划量", prop: "planTon" },
  { label: "船入计划量", prop: "planTon" },
  { label: "卸船作业量", prop: "workTon" },
  { label: "卸船进度", prop: "xcPercent", isPercent: true },
  { label: "入库作业量", prop: "workTon" },
  { label: "入库进度", prop: "percent", isPercent: true },
];
const dataOutPlan = [
  { label: "出库计划量", prop: "planTon" },
  { label: "船入计划量", prop: "planTon" },
  { label: "出库作业量", prop: "workTon" },
  { label: "出库进度", prop: "percent", isPercent: true },
];
const dataWork = [
  { label: "作业开始时间", prop: "planStartTime" },
  { label: "标准结束时间", prop: "planStandardEndTime" },
  { label: "预计结束时间", prop: "planExpectedEndTime" },
  { label: "原因", prop: "workRemark", reason: true },
];
dataPlan = props.inoutType == "in" ? dataInPlan : dataOutPlan;
const detailData = ref({});
const dataGoods = [{}, {}];
const showCarInfos = ref(false);
const showCarQuans = ref(false);
const showBack = ref(false);
const carNum = ref(null);
const dataQuan = ref([]);
const currentMachineId = ref("");
const currentMachineType = ref("");
const showMoreBtn = ref(true);
const pageNum = ref(1);
const pageSize = ref(10);
const carTypes = [
  { carSrc: menji, type: "mjList", count: "mjCount" },
  { carSrc: zhuangzj, type: "zzjList", count: "zzjCount" },
  { carSrc: daoyc, type: "dycList", count: "dycCount" },
  { carSrc: people, type: "yrList", count: "yrCount" },
];
const carInfoList = ref(null);
watch(
  () => props.currTimeStr,
  (newVal) => {
    pageNum.value = 1;
    if (props.rowId) {
      handleDetail();
    }
  }
);

const handleDetail = () => {
  getPlanInfo({ currTimeStr: props.currTimeStr, rowId: props.rowId }).then(
    (res) => {
      detailData.value = res.data;
      const params = {
        rowId: props.rowId,
        positionId:
          detailData.value.outPositionId || detailData.value.inPositionId,
      };
      bus.emit("getPlanMachineInfo", params);
    }
  );
};
const goBack = () => {
  bus.emit("getPlanMachineInfo", null);
  emit("goBack");
};
const showCarInfo = (type) => {
  showCarInfos.value = true;
  showCarQuans.value = false;
  carInfoList.value = detailData.value[type];
};
const showCarQuan = (machineId, type, car) => {
  if (type) {
    pageNum.value++;
  }
  getMachineDetail({
    currTimeStr: props.currTimeStr,
    machineId,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }).then((res) => {
    if (type) {
      dataQuan.value = dataQuan.value.concat(res.data.moCarworkInfoExtendList);
    } else {
      currentMachineId.value = machineId;
      currentMachineType.value = car.machineType;
      dataQuan.value = res.data.moCarworkInfoExtendList || [];
    }
    if (dataQuan.value.length == res.data.total) {
      showMoreBtn.value = false;
    }
    showCarQuans.value = true;
  });
};
const playBack = (item, event) => {
  event && event.stopPropagation();
  item.machineType = currentMachineType.value;
  bus.emit("playBack", item);
};
const handleShowDialog = (isShow) => {
  showBack.value = isShow;
};
// 加载更多
const onLoadMore = () => {
  showCarQuan(currentMachineId.value, "1");
};
// 是否有人员和车辆告警
const getIsPersonOrCarWarning = (item) => {
  return (
    item.warningCount != "0" &&
    (currentMachineType.value == "3" || currentMachineType.value == "5")
  );
};
// 打开告警
const getWarning = (item) => {
  getIsPersonOrCarWarning(item) && bus.emit("openWarningDetail", item);
};
onMounted(() => {
  handleDetail();
});
</script>
<style lang="scss" scoped>
.back_img,
.car_box {
  cursor: pointer;
}

.detail_box {
  background: rgba(8, 20, 54, 0.96);
  padding: 7px 0 38px 0;
  border-radius: 6px;
  border: 1px solid #1a4b7d;
}

.work_t {
  position: relative;

  .work_status {
    font-weight: 500;
    font-size: 16px;
    color: #fb433f;
    font-style: italic;
    position: absolute;
    right: 31px;
    top: 3px;
  }

  .sta_normal {
    color: #3fbfae;
  }
}

.detail_t {
  font-weight: bold;
  font-size: 16px;
  color: #b9d0ef;
  font-style: italic;
  width: 60%;
  padding: 5px;
  background-image: url("@/assets/images/left/detail_t_bg.png");
  background-size: cover;

  .title {
    margin-left: 20px;
  }
}

.list {
  // font-family: Alibaba PuHuiTi;
  margin: 10px 20px;
  margin-bottom: 18px;

  .ant-list-item,
  .ant-col {
    padding: 12px 16px;
    border-bottom: 1px solid rgb(41, 137, 255, 0.38);
  }

  .even {
    background: rgba(41, 137, 255, 0.24);
  }

  .odd {
    background: rgba(41, 137, 255, 0.14);
  }
}

.item_row,
.goods,
.site {
  width: 100%;
  color: #a8b9d6;

  .progress_t {
    font-weight: bold;
    font-size: 18px;
    color: #e0eaf3;
    font-style: italic;
    margin-right: 20px;
  }

  .ton {
    font-weight: 500;
    color: #33e8fd;
  }

  .unit {
    color: #d6e1eb;
    margin-left: 8px;
  }

  .time {
    color: #cad6eb;
  }
}

.ant-list-header {
  border-block-end: 0 !important;
  padding-block: 0 !important;
}

.planhead,
.goods,
.site {
  background: rgba(18, 111, 217, 0.61);
  font-weight: 500;
  font-size: 16px;
  font-style: italic;
  padding: 10px 12px;
  width: 100%;

  .plancode {
    color: #e0eaf3;
  }

  .planship {
    color: #fcbd3c;
  }
}

.car_num {
  color: #cad6eb;
}

.work_btn {
  font-weight: 500 !important;
  font-size: 14px;
  color: #7dcef8 !important;
  background-image: url("@/assets/images/left/work_unchosed.png");
  background-size: cover;
}

.work_chosedbtn {
  font-weight: 500 !important;
  font-size: 14px;
  color: #b2fff5 !important;
  background-image: url("@/assets/images/left/work_chosed.png");
  background-size: cover;
}

.review_btn {
  font-weight: bold;
  color: #16fdff !important;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42);
  font-style: italic;
  background-image: url("@/assets/images/left/guij_bg.png");
  background-size: cover;
}

.more {
  text-align: center;
  margin-top: 10px;
}

.machine_box {
  width: 100%;

  .ant-col {
    border: none;
  }
}

.warning {
  background: linear-gradient(-90deg,
      rgba(253, 84, 77, 0.8) 0%,
      rgba(253, 84, 77, 0.11) 52%,
      rgba(253, 84, 77, 0.8) 100%) !important;
  cursor: pointer;
}
</style>

<template>
  <div class="info_container">
    <div class="warning_div containerBox">
      <img :src="HeadIcon" class="head_img" alt="" />
      <a-flex align="center" style="width: 150px">
        <img width="46px" src="@/assets/images/icon_info_warning.png" alt="" />
        <span class="title">告警信息</span>
      </a-flex>

      <div class="scrollBorad">
        <div v-for="(item, index) in warnShowData" class="warn_card" @click="showWarnDialog(index + 1)" :key="index">
          <a-divider type="vertical" class="divider" style="margin-right: 12px" />
          <img :src="item.icon" width="32px" alt="" />
          <a-badge :count="filterWarnType(index + 1).length" :offset="[-10, 3]">
            <div class="label">
              {{
        item.warnType == TypeEnum.Car
          ? "车辆告警"
          : item.warnType == TypeEnum.Crane
            ? "门机告警"
            : "人员告警"
      }}
            </div>
          </a-badge>
          <div class="">{{ item.warnTitle }}</div>
        </div>
      </div>
    </div>
    <div class="machine_div containerBox">
      <img :src="HeadIcon" class="head_img" alt="" />
      <img width="46px" src="@/assets/images/icon_info_work.png" alt="" />
      <span class="title">作业资源</span>
      <div v-for="(item, index) in machineList" class="machine_item" :key="index"
        :class="{ selectType: selectTypes.indexOf(item.machineType) > -1 }" @click="choseMachineType(item.machineType)">
        <a-divider type="vertical" class="divider" />
        <img class="icon" :src="item.icon" alt="" />
        <span class="">× {{ warnAllData.length > 0 ? item.num : 0}}</span>
      </div>
    </div>
  </div>
  <SyDialog v-model:open="showDialog" :title="selectType == TypeEnum.Car
        ? '车辆警告'
        : selectType == TypeEnum.Crane
          ? '门机警告'
          : '人员警告'
        ">
    <!-- <SyCells :colList="colList" :showData="showData"></SyCells> -->
    <a-table :dataSource="warnDataList" :columns="columns" :bordered="false" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'detail'">
          <a-button type="primary" ghost class="review_btn" @click="showDetail(record)">查看详情</a-button>
        </template>
      </template>
    </a-table>
  </SyDialog>
  <SyDialog v-model:open="showDetailDialog" :width="showData?.warnType == TypeEnum.Person ? '980px' : '500px'"
    :title="showData?.warnTitle + '-' + showData?.code">
    <div class="detail_content">
      <div :style="showData?.warnType == TypeEnum.Person
        ? 'width: 450px'
        : 'width: 500px'
        ">
        <SyCells :colList="showCols(showData.warnType)" :showData="showData"></SyCells>
        <div v-if="showData?.warnType != TypeEnum.Crane &&
        showData?.moCarworkInfoExtendList?.length > 0
        ">
          <div class="detail_t"><span class="title">轨迹回放</span></div>
          <a-list size="small" :data-source="showData?.moCarworkInfoExtendList" class="list">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-flex justify="space-between" align="center" class="item_row">
                  <div>
                    <span style="font-weight: 500; color: #33e8fd">{{
        item.carPlate
      }}</span>
                  </div>
                  <div style="font-weight: 500; color: #fff">
                    {{ item.startTime }}
                  </div>
                  <a-button type="primary" ghost class="review_btn" @click="playBack(item)">轨迹回放</a-button>
                </a-flex>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
      <div v-if="showData?.warnType == TypeEnum.Person">
        <img width="500px" height="446px" src="@/assets/images/warn_person.png" alt="" />
      </div>
    </div>
  </SyDialog>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance, onUnmounted } from "vue";
import SyDialog from "@/views/bigScreen/RightComponents/SyDialog/SyDialog.vue";
import SyCells from "@/views/bigScreen/RightComponents/SyCells/SyCells.vue";
import CarIcon from "@/assets/images/icon_info_car.png";
import MenjiIcon from "@/assets/images/icon_info_menji.png";
import PersonIcon from "@/assets/images/icon_info_person.png";
import ZzjIcon from "@/assets/images/icon_info_zzj.png";
import HeadIcon from "@/assets/images/icon_head.png";
import { getWarningInfo } from "@/api/index.js";
import { useTimeChange } from "@/hooks/useTimeChange.js";
import bus from "@/utils/mitt";
const warnDataList = ref([]);
// 所有类型告警信息
const warnAllData = ref(useTimeChange(getWarningInfo));
// 过滤某种类型告警
const filterWarnType = computed(() => {
  return (type) => {
    return warnAllData.value.filter((item) => item.warnType == type);
  };
});
const warnShowData = ref([]);
watch(warnAllData, (newValue, oldValue) => {
  warnShowData.value = [];
  // 每种类型取第一个元素展示
  for (let index = 0; index < 3; index++) {
    // 过滤告警类型数据
    const filterData = filterWarnType.value(index + 1);
    if (filterData.length > 0) {
      warnShowData.value.push(filterData[0]);
    }
  }
});

const machineList = ref([
  { icon: MenjiIcon, num: "8", machineType: "2" },
  { icon: ZzjIcon, num: "3", machineType: "1" },
  { icon: CarIcon, num: "24", machineType: "3" },
  { icon: PersonIcon, num: "2", machineType: "5" },
]);
const selectTypes = ref([]);
const choseMachineType = (machineType) => {
  const index = selectTypes.value.indexOf(machineType);
  if (index > -1) {
    selectTypes.value.splice(index, 1);
  } else {
    selectTypes.value.push(machineType);
  }
  bus.emit("choseMachineType", selectTypes.value);
  // const
};

const workers = ref(["张明明", "李国庆", "刘辛"]);
const currentWorker = ref("");
// 告警详情 弹窗
const showDetailDialog = ref(false);
const getWarningList = (type, item, data = warnAllData.value) => {
  warnDataList.value = JSON.parse(JSON.stringify(data));
  if (item) {
    const rowIds = item.moWarningInfoTList
    warnDataList.value = warnDataList.value.filter(item => rowIds.includes(item.rowId) && item.warnType == type)
  } else {
    warnDataList.value = warnDataList.value.filter(item => item.warnType == type)
  }
  showDialog.value = true;
}
// 从轨迹关联告警详情
bus.on('openWarningDetail', (item => {
  getWarningInfo({ rowIds: item.moWarningInfoTList.join(',') }).then(
    (res) => {
      if (item.machineType == '3') {
        selectType.value = TypeEnum.Car
      } else if (item.machineType == '5') {
        selectType.value = TypeEnum.Person
      }
      getWarningList(selectType.value, item, res.data)
    }
  );

}))
const showDetail = (item) => {
  showDetailDialog.value = true;
  item.position = item.lon + " , " + item.lat;
  showData.value = item;
};

// 告警类型
const TypeEnum = {
  Car: "1", // 车辆
  Crane: "2", //门机
  Person: "3", // 人员
};

// 弹窗展示信息
const showData = ref();

// 过滤某中类型告警
const showCols = computed(() => {
  return (type) => {
    return detailColList.filter((item) => item.showType.indexOf(type) > -1);
  };
});

const detailColList = [
  {
    label: "组别:",
    prop: "group",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person],
  },
  {
    label: "车牌号:",
    prop: "gantryCraneNumber",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Car],
  },
  {
    label: "门机编号:",
    prop: "gantryCraneNumber",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
  {
    label: "所在泊位:",
    prop: "berth",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
  {
    label: "司机姓名:",
    prop: "driverName",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane, TypeEnum.Car],
  },
  {
    label: "离线位置:",
    prop: "position",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
  {
    label: "警告位置:",
    prop: "position",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Car],
  },
  {
    label: "所在计划:",
    prop: "plan",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person, TypeEnum.Crane, TypeEnum.Car],
  },
  {
    label: "位置:",
    prop: "position",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person],
  },
  {
    label: "速度:",
    prop: "speed",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person, TypeEnum.Car],
  },
  {
    label: "作业时长:",
    prop: "workTime",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person],
  },
  {
    label: "备注:",
    prop: "warnContent",
    labelStyle: "width:100px",
    valueStyle: { color: "#FF6856" },
    col: 24,
    showType: [TypeEnum.Person],
  },
  {
    label: "警告时间:",
    prop: "startTime",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Person],
  },
  {
    label: "离线时间:",
    prop: "offlineTime",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
  {
    label: "警告时间:",
    prop: "offlineTime",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Car],
  },
  {
    label: "状态:",
    prop: "status",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
  {
    label: "离线时长:",
    prop: "offlineDuration",
    labelStyle: "width:100px",
    col: 24,
    showType: [TypeEnum.Crane],
  },
];

// 车辆轨迹回放
const playBack = (item) => {
  showDialog.value = false;
  showDetailDialog.value = false;
  item.warnType = showData.value.warnType
  bus.emit('playBack', item)
};
// 派单逻辑
const value1 = ref("1");

const { proxy } = getCurrentInstance();
const dispatch = () => {
  proxy.$message.success("派单成功");
  // 模拟延时
  setTimeout(() => {
    showDetailDialog.value = false;
  }, 1000);
};
// 弹窗数据
const showDialog = ref(false);
const selectType = ref(TypeEnum.Car);
const showWarnDialog = (type) => {
  selectType.value = type;
  getWarningList(selectType.value)
};

const columns = [
  {
    title: "所属计划",
    dataIndex: "plan",
    key: "plan",
    width: 150,
  },
  {
    title: "警告编号",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "警告信息",
    dataIndex: "warnContent",
    key: "warnContent",
  },
  {
    title: "",
    dataIndex: "detail",
    key: "warnContent",
    width: 80,
  },
];
const chosedWorker = (item) => {
  currentWorker.value = item;
};
onUnmounted(() => {
  bus.off('openWarningDetail');
});
</script>

<style scoped lang="scss">
.info_container {
  display: flex;
  height: 56px;
  margin: 15px 16px;
  color: #fff;
  font-size: 16px;
  justify-content: end;
}

.containerBox {
  background: rgba(22, 41, 86, 0.68);
  border-radius: 5px;
  border: 1px #1dadf8 solid;
  display: flex;
  align-items: center;
  position: relative;

  .head_img {
    width: 3px;
    margin-right: 6px;
  }

  .title_div {
    width: 150px;
  }

  .title {
    font-size: 18px;
    margin-left: 5px;
    color: #5bbeef;
  }
}

.icon {
  vertical-align: bottom;
  width: 32px;
  height: 32px;
  margin: 0px 5px 0px 10px;
}

.divider {
  height: 20px;
  background-color: #4295f2;
  margin: 0px;
  vertical-align: text-bottom;
}

.warning_div {
  width: 875px;
  justify-content: space-between;
}

.scrollBorad {
  display: flex;
  flex: 1;
  justify-content: space-between;
  height: 100%;
  margin-right: 30px;

  .warn_card {
    display: flex;
    height: 100%;
    /* background: #fff; */
    cursor: pointer;
    align-items: center;
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

.machine_div {
  width: 500px;
  margin-left: 9px;
  user-select: none;

  .machine_item {
    margin-left: 9px;
    font-size: 18px;
    cursor: pointer;
  }

  .selectType {
    background: rgba(222, 222, 222, 0.28);
  }
}

.detail_content {
  width: 1000px;
  display: flex;
}

.btn {
  float: right;
  margin-right: 30px;
  margin-bottom: 10px;
}

.repaire_div {
  color: #a2b9d3;
  font-size: 16px;
  position: relative;

  .repaire_divider {
    position: absolute;
    height: 400px;
    background-color: #4295f2;
    top: 10px;
    left: -50px;
  }

  .select {
    margin: 25px;
  }

  .dispatch {
    position: absolute;
    bottom: 10px;
    right: 30px;
  }
}

.chosed_worker {
  color: #fff;
  background-color: #4295f2;
  border: 1px solid;
  border-radius: 3px;
  padding: 2px;
}

.list {
  // font-family: Alibaba PuHuiTi;
  margin: 10px 20px;
  margin-bottom: 18px;

  .ant-col {
    padding: 12px 16px;
    border-bottom: 1px solid rgb(41, 137, 255, 0.38);
  }
}

.item_row {
  width: 100%;
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
</style>

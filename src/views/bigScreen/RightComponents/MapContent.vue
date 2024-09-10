<template>
  <div class="mapContent">
    <img ref="imgRef" :src="imgUrl" width="0" alt="Example Image" />
    <div class="btn_box"></div>
    <div id="map" ref="mapbox"></div>
    <SyDialog
      v-model:open="showDialog"
      :title="dialogTitle"
      :width="getDialogWidth(currentImgId)"
    >
      <SyCells
        :colList="getFormCol(currentImgId)"
        :showData="showData"
      ></SyCells>
      <a-table
        v-if="getTableCol(currentImgId)?.length > 0"
        :dataSource="dataSource"
        :columns="getTableCol(currentImgId)"
        :bordered="false"
        :pagination="false"
        :scroll="{ y: 300 }"
        :loading="tableLoading"
        :customRow="customRow"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column?.dataIndex == 'index'">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-if="column?.dataIndex == 'back'">
            <div class="text_r">
              <a-button
                type="primary"
                ghost
                class="review_btn"
                @click="playBack(record, $event)"
                >轨迹回放</a-button
              >
            </div>
          </template>
          <template v-if="column?.dataIndex == 'carPlate'">
            <div class="text_color">
              {{ record[column?.dataIndex] }}
            </div>
          </template>
        </template>
      </a-table>
      <div class="more" v-if="showMoreBtn">
        <a-button
          type="primary"
          ghost
          @click="onLoadMore(currentImgId)"
          size="small"
          >更&nbsp;&nbsp;多</a-button
        >
      </div>
    </SyDialog>
    <MenjiBack v-if="showBack" :backData="backData"></MenjiBack>
    <ImportantPoints v-if="showPoint" :backData="pointsData"></ImportantPoints>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import SyDialog from "@/views/bigScreen/RightComponents/SyDialog/SyDialog.vue";
import SyCells from "@/views/bigScreen/RightComponents/SyCells/SyCells.vue";
import MenjiBack from "@/views/bigScreen/components/MenjiBack";
import ImportantPoints from "@/views/bigScreen/components/ImportantPoints";
import * as L from "leaflet";
import "leaflet-polylinedecorator";
import "leaflet/dist/leaflet.css";
import bus from "@/utils/mitt";
import { parseTime } from "@/utils/tool";
import {
  getFormCol,
  getTableCol,
  getDialogTitle,
  getDialogWidth,
  staticImgList,
  menjiImgList,
  menjiBounds,
  warnImg,
} from "./mapInfo.js";

import {
  getAllTypesPointsNow,
  getPointInfo,
  getPointQuanList,
  getArShipInfo,
  getBaYardPosition,
  getWeightRoomInfo,
} from "@/api/index.js";
import imgUrl from "@/assets/images/background.png"; //底图
import transCar from "@/assets/images/transCar.png"; //货车
import dyc_out from "@/assets/images/dyc_out.png"; //倒运车-出库
import dyc_green from "@/assets/images/dyc_green.png"; //倒运车-入库正常
import dyc_red from "@/assets/images/dyc_red.png"; //倒运车-入库不正常
import zzc from "@/assets/images/zzc.png"; //装载车
import person from "@/assets/images/person.png"; //人
import menji_point from "@/assets/images/menji_point.png"; //门机移动点

const emit = defineEmits(["showDialog"]);
const mapbox = ref(null);
const pause = ref(false);
const linePercent = ref(0);
const dialogTitle = ref(null);
const currentImgId = ref(null);
const showData = ref({ num: 33 });
const showBack = ref(false);
const showPoint = ref(false);
const tableLoading = ref(false);
const backData = ref({});
const pointsData = ref({});
const currTimeStr = ref();
const showMoreBtn = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const currentMachineId = ref("");
//绘制图层
let img = new Image();
let drawnGroup = new L.FeatureGroup();

// 动态元素  车 人
let dynamicGroup = new L.FeatureGroup();

let noNeedWatchZoom = false; //是否需要监听zoom
let map = null; //地图对像
let currentPoint; //当前坐标
let anim = null; //定时器对象
let centerX = null;
let centerY = null;
let dynamicImgList = [];
let planId = "";

// 弹窗
const showDialog = ref(false);
const dataSource = ref([]);
// debugger
let refreshInterval = null;

// 过滤类型
const filterMachineType = ref([]);

const imgRef = ref(null);
// 背景范围
onMounted(() => {
  const img = imgRef.value;
  img.addEventListener("load", () => {
    initMap();
  });
  bus.on("changeTime", queryData);
  bus.on("choseMachineType", (type) => {
    filterMachineType.value = type;
    // 清除 动态点位数据
    generateDynamicItems();
  });
  refreshCurrentInfo();
});
// 设置刷新
const refreshCurrentInfo = () => {
  refreshInterval = setInterval(function () {
    // 字符串转成 Date 类型
    if (currTimeStr.value?.indexOf("2024-08-20") > -1) {
      const datePart = currTimeStr.value?.split(" ")[0] ?? "";
      const timePart = currTimeStr.value?.split(" ")[1] ?? "";
      const [year = "2024", month = "01", day = "01"] = datePart.split("-");
      const [hour = "00", minute = "00", second = "00"] = timePart.split(":");
      const after20sTime =
        new Date(year, month - 1, day, hour, minute, second).getTime() + 20000;
      queryData(parseTime(new Date(after20sTime)));
    }
  }, 20000);
};
onUnmounted(() => {
  clearInterval(refreshInterval);
  clearInterval(anim);
});

let menjiItms = [];
// 请求码头信息
const queryData = (time) => {
  if (time) {
    currTimeStr.value = time;
  }
  const params = {
    currTimeStr: currTimeStr.value,
  };
  if (planId) {
    params.planId = planId;
  }
  // 更新货垛
  updateHuoDuo();
  getAllTypesPointsNow(params).then((res) => {
    const points = res.data;
    formatShipList(points);
    // 没有门机时加载 已有门机不需要处理
    if (menjiItms.length == 0) {
      menjiItms = points
        .filter((item) => item.machineType === "2")
        .map((item) => ({
          bounds: menjiBounds[item.machineId - 1],
          imgurl: menjiImgList[item.machineId - 1],
          imgId: "menjimachine" + item.id,
          ...item,
        }));
      menjiItms.forEach((item) => {
        loadImgs(item.bounds, item.imgurl, item.imgId);
      });
    }
    generateDynamicItems();
  });
};

// 加载动态展示元素 车 人 门机
const generateDynamicItems = () => {
  // 清除动态点位数据
  dynamicGroup.clearLayers();
  // 加载动态点位
  dynamicImgList.forEach((item) => {
    if (
      filterMachineType.value.indexOf(item.machineType) > -1 ||
      filterMachineType.value.length == 0
    ) {
      loadImgs(item.bounds, item.imgurl, item.imgId, dynamicGroup);
    }
  });
  nextTick(() => {
    dynamicImgList.forEach((item) => {
      const element = document.querySelector(`.${item.imgId}`);
      if (element && item.machineType != "2") {
        const computedStyle = getComputedStyle(element);
        const currentTransform =
          computedStyle.transform === "none" ? "" : computedStyle.transform;
        element.style.transform = `${currentTransform} rotate(${-item.directionOri}deg)`;
        element.style.transformOrigin = "center";
      }
    });
  });
};

const initMap = () => {
  if (map) {
    return;
  }
  img.src = imgUrl;
  const w = Number(img.width);
  const h = Number(img.height);
  const bounds = [
    [0, 0],
    [h, w],
  ];
  centerX = Number(Math.floor(h / 2));
  centerY = Number(Math.floor(w / 2)); // 地图实际宽高
  //地图容器
  map = L.map("map", {
    //参考坐标系
    crs: L.CRS.Simple,
    //显示中心
    center: [centerX, centerY],
    //最小显示等级
    minZoom: -2,
    //最大显示等级
    maxZoom: 5,
    //当前显示等级
    zoom: 0,
    //设置缩放控件不显示
    zoomControl: false,
    noWrap: true,
    //设置版权属性值的显示内容
    // attribution: "",
    attributionControl: false,
  }).on({
    zoomstart() {
      dynamicGroup?.clearLayers();
    },
    zoomend() {
      !noNeedWatchZoom && generateDynamicItems();
    },
  });
  L.imageOverlay(imgUrl, bounds).addTo(map);
  // 初始化动态items组
  dynamicGroup.addTo(map);
  drawnGroup.addTo(map);
  staticImgList.forEach((item) => {
    loadImgs(item.bounds, item.imgurl, item.imgId);
  });
};
const formatShipList = (points = []) => {
  dynamicImgList = [];
  points.forEach((item) => {
    if (item.machineType == "1") {
      //装载机
      const point = {
        bounds: [
          [item.x, item.y],
          [item.x + 15, item.y + 34],
        ],
        imgurl: zzc,
        imgId: "zzcmachine" + item.id,
        ...item,
      };
      dynamicImgList.push(point);
    } else if (item.machineType == "3") {
      //倒运车
      const point = {
        bounds: [
          [item.x, item.y],
          [item.x + 15, item.y + 34],
        ],
        imgurl: getDycImg(item),
        imgId: "dycmachine" + item.id,
        ...item,
      };
      dynamicImgList.push(point);
    } else if (item.machineType == "5") {
      //人
      const point = {
        bounds: [
          [item.x, item.y],
          [item.x + 17, item.y + 8],
        ],
        imgurl: person,
        imgId: "personmachine" + item.id,
        ...item,
      };
      dynamicImgList.push(point);
    }
  });
};
// 获取倒运车展示图片
const getDycImg = (item) => {
  // planType:5出库，2入库
  if (item.planType == "5") {
    return dyc_out;
  } else {
    return item.workStatus == "正常" ? dyc_green : dyc_red;
  }
};
// 加载各可点击的图片图层
const loadImgs = (bounds, imgurl, imgId = "", ctx = map) => {
  L.imageOverlay(imgurl, bounds, {
    id: imgId,
    className: imgId,
    interactive: true, //可点击
  })
    .on({
      click(e) {
        handleImgClick(imgId);
      },
    })
    .addTo(ctx);
};
// 点击图片图层方法
const handleImgClick = (imgId) => {
  showMoreBtn.value = false;
  currentImgId.value = imgId;
  dialogTitle.value = "作业资源-" + getDialogTitle(imgId);
  if (imgId.includes("ship")) {
    getShipinfo(imgId);
  } else if (imgId.includes("yardpos")) {
    getYardPosinfo(imgId);
  } else if (imgId.includes("bangfang")) {
    getBangfangInfo(imgId);
  } else {
    pageNum.value = 1;
    showMoreBtn.value = true;
    const mindex = imgId.indexOf("machine");
    const type = imgId.substring(0, mindex);
    const id = imgId.substring(mindex + 7);
    getPointDetail(type, id);
    getPointQuan(id);
    showDialog.value = true;
  }
};
const getPointDetail = (type, id) => {
  getPointInfo({ id }).then((res) => {
    showData.value = res.data;
  });
};
const getPointQuan = (id, type) => {
  if (type) {
    pageNum.value++;
  } else {
    dataSource.value = [];
  }
  tableLoading.value = true;
  getPointQuanList({
    id,
    currTimeStr: currTimeStr.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }).then((res) => {
    if (type) {
      dataSource.value = dataSource.value.concat(res.data);
    } else {
      currentMachineId.value = id;
      dataSource.value = res.data;
    }
    if (dataSource.value.length == res.total) {
      showMoreBtn.value = false;
    }
    tableLoading.value = false;
  });
};
// 查询大船信息
const getShipinfo = (imgId) => {
  const mindex = imgId.indexOf("ship");
  const id = imgId.substring(mindex + 4);
  getArShipInfo({ currTimeStr: currTimeStr.value, rowId: id }).then((res) => {
    if (res.data.length > 0) {
      const shipInfo = res.data[0];
      dialogTitle.value = "货场资源-" + shipInfo.shipName;
      showData.value = shipInfo;
    } else {
      dialogTitle.value = "货场资源-";
      showData.value = {};
    }
    showDialog.value = true;
  });
};
// 查询货垛信息
const getYardPosinfo = (imgId) => {
  const mindex = imgId.indexOf("yardpos");
  const id = imgId.substring(mindex + 7);
  getBaYardPosition({ currTimeStr: currTimeStr.value, rowId: id }).then(
    (res) => {
      const shipInfo = res.data;
      dialogTitle.value = "货场资源-" + shipInfo.positionName;
      showData.value = shipInfo;
      dataSource.value = res.data.positionCarWorkDtoList || [];
      showDialog.value = true;
    }
  );
};
// 查询磅房信息
const getBangfangInfo = (imgId) => {
  const mindex = imgId.indexOf("bangfang");
  const id = imgId.substring(mindex + 8);
  getWeightRoomInfo({ currTimeStr: currTimeStr.value, weightRoomId: id }).then(
    (res) => {
      const shipInfo = res.data;
      dialogTitle.value = "货场资源-" + shipInfo.weightRoomName;
      showData.value = shipInfo;
      dataSource.value = res.data.positionCarWorkDtoList || [];
      showDialog.value = true;
    }
  );
};
// 请求路径数据
let passedPointArray = [];

const trans = (pointsXY) => {
  var pointList = [];
  for (var i = 0; i <= pointsXY.length - 2; i++) {
    pointList[i] = [parseFloat(pointsXY[i].x), parseFloat(pointsXY[i].y)];
  }
  return pointList;
};

// 移动路径 相关数据
let drawnLine = null;
let drawnLinePlane = null;
let arrowOffset = 0;
// 绘画路径底层图层
let baseLine = null;
let baseLinePlane = null;

const startMove = (currentOffset, time = 500) => {
  arrowOffset = currentOffset ?? arrowOffset;
  if (anim) {
    clearInterval(anim);
  }
  if (drawnLinePlane && drawnLine) {
    if (currentOffset > -1) {
      // 如果暂停 从暂停位置继续
      drawnLine.setLatLngs([]);
      const newArray = passedPointArray.slice(0, currentOffset);
      newArray.forEach((item) => {
        drawnLine.addLatLng([item.x, item.y]);
      });
    }
    anim = setInterval(function () {
      if (arrowOffset < passedPointArray.length) {
        currentPoint = [
          passedPointArray[arrowOffset].x,
          passedPointArray[arrowOffset].y,
        ];
        drawnLine.addLatLng(currentPoint);
        drawnLinePlane.setPaths(drawnLine);
        arrowOffset += 1;
        // 设置进度
        linePercent.value = (arrowOffset / passedPointArray.length) * 100;
        bus.emit("getSliderPercent", linePercent.value);
      } else {
        clearInterval(anim);
        return;
      }
    }, time);
  }
};
//添加路径动画
const updateMovePathUI = (isCar) => {
  if (anim != null) {
    clearInterval(anim);
  }
  drawnGroup.clearLayers();
  //添加路径
  const drawnLinePoints = trans(passedPointArray[0]);
  // 底层灰线
  setBaseLine();
  // 轨迹移动路径点
  drawnLine = L.polyline(drawnLinePoints, {
    color: "#4bbc84",
    weight: 8,
    opacity: "0.9",
  });
  drawnLine.addTo(drawnGroup);
  drawnLine.setLatLngs([]);

  drawnLinePlane = L.polylineDecorator(drawnLine, {
    patterns: [
      {
        offset: "100%",
        repeat: "0%",
        symbol: L.Symbol.marker({
          rotate: true,
          // angleCorrection: -90,
          markerOptions: {
            icon: L.icon({
              iconSize: isCar ? [20, 40] : [20, 20],
              iconUrl: isCar ? transCar : menji_point,
              iconAnchor: isCar ? [10, 20] : [10, 10],
            }),
          },
        }),
      },
    ],
  }).addTo(drawnGroup);
  startMove();
};

const setBaseLine = () => {
  const basePoints = passedPointArray.map((item) => {
    return [item.x, item.y];
  });
  baseLine = L.polyline(basePoints, {
    color: "#eeeeee",
    weight: 8,
    opacity: "0.8",
  });
  baseLine.addTo(drawnGroup);
  baseLinePlane = L.polylineDecorator(baseLine, {
    patterns: [
      {
        offset: 30, // 箭头起始位置距离线条两端的距离
        repeat: 40, // 箭头重复的间隔
        symbol: L.Symbol.arrowHead({
          pixelSize: 5, // 箭头大小
          headAngle: 75, // 角度
          polygon: false,
          pathOptions: { stroke: true, weight: 2, color: "#fff" },
        }),
      },
    ],
  }).addTo(drawnGroup);
};

bus.on("startAndPurse", (isPause) => {
  startAndPurse(isPause);
});
bus.on("afterTimeChange", (data) => {
  afterChange(data);
});
// 开始或者暂停
const startAndPurse = (isPause) => {
  pause.value = isPause;
  if (pause.value) {
    clearInterval(anim);
  } else {
    startMove();
  }
};
const afterChange = (percent) => {
  const curPointNum = Math.floor((percent / 100) * passedPointArray.length);
  startMove(curPointNum);
};

const addMarkers = (parent) => {
  passedPointArray.forEach((item, i) => {
    // 1起点，2终点，3磅房（停四十秒），4门机（停三分钟），5，6普通节点，7卸货地点，8装货地点
    if (["3", "4", "7", "9"].includes(item.type)) {
      let marker = L.circleMarker(new L.LatLng(item.x, item.y), {
        // 创建点 (38, 107)为经纬度
        color: "#000", //线颜色
        weight: 2, //线宽度
        opacity: 0.8, //透明度
        fillColor: "#FAFAFA", //填充色
        fillOpacity: 0.8, //填充透明度
        radius: 7, //半径
      })
        .addTo(drawnGroup)
        .on({
          click(e) {
            handleImportantPoint({ ...parent, ...item });
          },
        });
    }
  });
};
const findLayers = (layerName) => {
  //根据图层名称查找图层
  if (!map) {
    return null;
  }
  let gisMap_layers = map._layers;
  let layer = null;
  for (let i in gisMap_layers) {
    if (gisMap_layers[i].options.id == layerName) {
      layer = gisMap_layers[i];
    }
  }
  return layer;
};

let huoDuoChangeHour = "";
const yardList = [
  {
    imgId: "yardpos1",
    maxBounds: [
      [469, 100],
      [294, 212],
    ],
  },
  {
    imgId: "yardpos4",
    maxBounds: [
      [280, 1100],
      [336, 1264],
    ],
  },
  {
    imgId: "yardpos5",
    maxBounds: [
      [70, 480],
      [126, 557],
    ],
  },
];

// 更新货垛大小
const updateHuoDuo = () => {
  if (currTimeStr.value?.indexOf("2024-08-20") > -1) {
    // 获取当前小时时间 占全天得百分比
    const timePart = currTimeStr.value?.split(" ")[1] ?? "";
    const nowHour = timePart.split(":")[0] ?? "00";
    const yellowValue = yellowId.value;
    if (huoDuoChangeHour != nowHour || yellowValue) {
      huoDuoChangeHour = nowHour;
      yardList.forEach((item) => {
        const { maxBounds, imgId } = item;
        // 原始数据
        const orginYard = staticImgList.filter((staticItem) => {
          return staticItem.imgId == imgId;
        });
        // 计算增加高度
        const scaleBounds = (Number(nowHour) + 1) / 24;
        let layer = findLayers(imgId);
        // 删除原图片 重新加载 新bounds
        map.removeLayer(layer);
        const { bounds, imgurl, yellowUrl, yardId } = orginYard[0];
        if (nowHour > 8) {
          loadImgs(
            calculateBounds(bounds, maxBounds, scaleBounds),
            yardId == yellowValue ? yellowUrl : imgurl,
            imgId
          );
        } else {
          loadImgs(bounds, imgurl, imgId);
        }
      });
    }
  }
};

const calculateBounds = (originalBounds, maxBounds, t) => {
  return [
    [
      originalBounds[0][0] + t * (maxBounds[0][0] - originalBounds[0][0]),
      originalBounds[0][1] + t * (maxBounds[0][1] - originalBounds[0][1]),
    ],
    [
      originalBounds[1][0] + t * (maxBounds[1][0] - originalBounds[1][0]),
      originalBounds[1][1] + t * (maxBounds[1][1] - originalBounds[1][1]),
    ],
  ];
};

//放大展示轨迹
const changeCenterAndZoom = (latlng, zoom = 1) => {
  noNeedWatchZoom = true;
  map.flyTo(latlng, zoom);
};
bus.on("playBack", (data) => {
  // 接收数据
  playBack(data);
});
// 关闭回放，清除轨迹数据
bus.on("closeplayBack", (data) => {
  showBack.value = false;
  drawnGroup?.clearLayers(); //清除划线
  clearInterval(anim); //清除进度条
  arrowOffset = 0;
  changeCenterAndZoom([centerX, centerY], 0); //缩小
  noNeedWatchZoom = false;
  queryData();
  refreshCurrentInfo(); //开始刷新

  let layer = findLayers("posWaring");
  if (layer) {
    map.removeLayer(layer);
  }
});
// 轨迹回放弹窗
const playBack = (item, event) => {
  event?.stopPropagation();
  clearInterval(refreshInterval); //暂停刷新
  dynamicGroup.clearLayers(); //先清除轨迹外人车
  showDialog.value = false;
  backData.value = item;
  passedPointArray = item.passedCoordinates;
  updateMovePathUI(item.machineType == "3"); //除了倒运车都用小黄点
  addMarkers(item);
  // 增加越界围栏
  if (item?.warnType == "3") {
    const { bounds, imgurl, imgId } = warnImg;
    let layer = findLayers(imgId);
    // 删除原图片 重新加载 新bounds
    layer && map.removeLayer(layer);
    loadImgs(bounds, imgurl, imgId);
  }
  let latlng = item.middleLocation.split(",").map((item) => Number(item));
  changeCenterAndZoom(latlng); //地图变大
  showBack.value = true;
};
// 重要点位弹窗
const handleImportantPoint = (item) => {
  pointsData.value = item;
  showPoint.value = true;
};
bus.on("closePoints", (data) => {
  showPoint.value = false;
});

// 监听是否进入计划详情 data有值进入详情 data没值推出详情 positionId : 关联货位
bus.on("getPlanMachineInfo", (data) => {
  planId = data?.rowId || "";
  queryData();
  // 计划关联货垛变黄
  changeYardColor(data);
});

const yellowId = ref(-1);

// 改变关联货场颜色
const changeYardColor = (data) => {
  yellowId.value = data?.positionId || -1;
  updateHuoDuo();
};

const getWarning = (item) => {
  bus.emit("openWarningDetail", item);
};
// 警告增加样式和事件
const customRow = (record, index) => {
  if (
    record.warningCount != "0" &&
    (dialogTitle.value.indexOf("倒运车") > -1 ||
      dialogTitle.value.indexOf("人员") > -1)
  ) {
    return {
      style: {
        background:
          "linear-gradient(-90deg, rgba(253, 84, 77, 0.8) 0%, rgba(253, 84, 77, 0.11) 52%, rgba(253, 84, 77, 0.8) 100%) !important",
        // background: "rgb(251,67,63)",
        cursor: "pointer",
      },
      // 鼠标单击行
      onClick: (event) => {
        getWarning(record);
      },
    };
  }
};
// 加载更多
const onLoadMore = () => {
  getPointQuan(currentMachineId.value, "1");
};
onUnmounted(() => {
  bus.off("changeTime");
  bus.off("choseMachineType");
  bus.off("startAndPurse");
  bus.off("afterTimeChange");
  bus.off("closePoints");
  bus.off("playBack");
  bus.off("closeplayBack");
  bus.off("getPlanMachineInfo");
});
</script>

<style scoped lang="scss">
.mapContent {
  width: 100%;
  height: 839px;
  background: transparent;
  position: relative;
}

#map {
  width: 100%;
  height: 839px;
  background: transparent;
}

.btn_box {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;

  .ant-btn-primary:disabled {
    border-color: #1677ff;
    color: #fff;
    background-color: #1677ff;
  }
}

.slider_box {
  width: 10%;
  margin-right: 20px;

  :deep() .ant-slider-rail {
    background-color: #cccccc2e;
  }
}

.review_btn {
  font-weight: bold;
  color: #16fdff !important;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42);
  font-style: italic;
  background-image: url("@/assets/images/left/guij_bg.png");
  background-size: cover;
}

.text_r {
  text-align: right;

  .a-button {
    cursor: pointer;
  }
}

.text_color {
  color: #33e8fd;
}

.warning_text {
  color: #fb433f;
  cursor: pointer;
}

.more {
  text-align: center;
  margin-top: 10px;
}
</style>

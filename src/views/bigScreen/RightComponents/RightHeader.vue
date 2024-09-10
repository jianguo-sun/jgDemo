<template>
  <div class="right_header">
    <div class="content_box">
      <div class="triangle"></div>
      <div class="num_div" v-for="(item, index) in numList" :key="index">
        <div>{{ item.label }}</div>
        <div>
          <span class="num">{{ sumData[item.prop] || 0 }}</span><span>吨</span>
        </div>
        <a-divider v-if="index != numList.length - 1" type="vertical" class="divider" />
      </div>
    </div>
    <div class="content_box">
      <div class="weather_div" v-for="(item, index) in weatherList" :key="index">
        <template v-if="item.type == TYPE_DATE">
          <div class="date_div">
            <div class="time">{{ parseTime(showTime)?.split(" ")[1] }}</div>
            <div class="date">{{ parseTime(showTime)?.split(" ")[0] }}</div>
            <a-date-picker class="datePicker" v-model:value="dateValue" :format="dateFormat" :value-format="dateFormat"
              :locale="locale" showTime @openChange="dateOpenChange" @ok="changeDate">
              <template #dateRender="{ current }">
                <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
                  {{ current.date() }}
                </div>
              </template>
            </a-date-picker>
          </div>
        </template>
        <template v-else>
          <img v-if="item.icon" :src="item.icon" class="weather_icon" :style="item.iconStyle ?? {}" alt="" />
          <div>
            <div class="weather_value" :style="item.valueStyle">
              {{ weatherData[item.value] }}&nbsp;{{ item.unit }}
            </div>
            <div class="weather_label" :style="item.labelStyle">
              {{ item.label || weatherData[item.labelProp] }}
            </div>
          </div>
        </template>
        <a-divider v-if="index != weatherList.length - 1" type="vertical" class="divider" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { getWeather, getSumInfo } from "@/api/index.js";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN.js";
import fengsu from "@/assets/images/icon_wheather_fengsu.png";
import hailang from "@/assets/images/icon_wheather_hailang.png";
import qzdy from "@/assets/images/icon_wheather_qzdy.png";
import shidu from "@/assets/images/icon_wheather_shidu.png";
import wendu from "@/assets/images/icon_wheather_wendu.png";
import bus from "@/utils/mitt";
import { parseTime } from "@/utils/tool";

const numList = [
  { label: "累计吞吐量", prop: "sum_tuntu" },
  { label: "汽车运输量", prop: "sum_qiyun" },
  { label: "火车运输量", prop: "sum_huoyun" },
];
const TYPE_DATE = "customDate";
const weatherList = [
  { label: "温度", value: "temperature", unit: "℃", icon: wendu },
  { label: "湿度", value: "moderate", unit: "%", icon: shidu },
  { label: "风速", value: "windSpeed", unit: "m/s", icon: fengsu },
  { label: "海浪", value: "seaWave", unit: "m", icon: hailang },
  {
    type: TYPE_DATE,
  },
  {
    labelProp: "temperatureRange",
    value: "temperatureString",
    valueStyle: { color: "#BFDFFF", textAlign: "right" },
    labelStyle: { "font-size": "18px", color: "#E1EDFF" },
    icon: qzdy,
    iconStyle: { width: "32px", height: "32px" },
  },
];
const getCurrentStyle = (current) => {
  const style = {};
  if (current.date() === 20 && current.year() == 2024 && current.month() == 7) {
    style.border = "3px solid #1677cc"; // 选中边框样式
    style.boxSizing = "content-box"; // 选中边框样式
  }
  return style;
};
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const dateValue = ref(parseTime(new Date()));
const showTime = ref(new Date());
const changeDate = (value) => {
  // 字符串转成 Date 类型
  const [datePart, timePart] = value.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hour, minute, second] = timePart.split(":");
  showTime.value = new Date(year, month - 1, day, hour, minute, second);
  bus.emit("changeTime", value);
  getData();
};

const dateOpenChange = (status) => {
  if (status) {
    dateValue.value = parseTime(showTime.value)
  }
}

const weatherData = ref({});
const sumData = ref({});
const getData = () => {
  getWeather({ currTimeStr: dateValue.value }).then((res) => {
    weatherData.value = res.data;
  });
  getSumInfo({ currTimeStr: dateValue.value }).then((res) => {
    sumData.value = res.data;
  });
};
let timeInterval = null;

const addTime = () => {
  timeInterval = setInterval(() => {
    showTime.value = new Date(showTime.value.getTime() + 1000);
  }, 1000);
};

onMounted(() => {
  getData();
  addTime();
  nextTick(() => {
    bus.emit("changeTime", dateValue.value);
  });
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>
<style scoped lang="scss">
:deep(.ant-picker) {
  width: 120px;
  background-color: transparent;
  border: none;
}

:deep(.ant-picker-input) {
  display: none;
}

.right_header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 71px;
}

.content_box {
  margin: 20px 16px 0px 88px;
  display: flex;
  color: #d5e6f6;
  font-size: 14px;
}

.num_div {
  margin-right: 35px;
  height: 42px;
  position: relative;
  min-width: 120px;

  .num {
    color: #33e8fd;
    font-size: 20px;
    line-height: 20px;
    // font-family: "DIN-Black";
    font-weight: 600;
    margin-right: 10px;
  }
}

.divider {
  height: 15px;
  background-color: #4295f2;
  position: absolute;
  right: -20px;
  top: 15px;
  vertical-align: text-bottom;
}

// .num_div:not(:last-child)::after {
//   position: absolute;
//   left: 160px;
//   bottom: 10px;
//   content: "|";
//   color: #4295f2;
// }

.weather_div {
  // padding: 5px 15px;
  position: relative;
  margin-left: 30px;
  display: flex;

  .weather_icon {
    margin-right: 8px;
    margin-top: 12px;
    width: 20px;
    height: 20px;
  }

  .weather_value {
    color: #fff;
  }

  .date_div {
    position: relative;
    cursor: pointer;
  }

  .date {
    color: #edf3fd;
    text-align: right;
  }

  .datePicker {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .time {
    margin-top: -10px;
    width: 100px;
    text-align: right;
    // font-family: DIN Black;
    font-weight: 600;
    font-size: 22px;
    color: #edf3fd;
    // text-shadow: 0px 1px 3px rgba(5, 12, 25, 0.54);
  }
}
</style>

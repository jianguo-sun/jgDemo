import { ref, onMounted, onUnmounted } from "vue";
import bus from "@/utils/mitt";
export function useTimeChange(func, params) {
  const data = ref([]);
  const getData = (time) => {
    func({ currTimeStr: time, ...params }).then((res) => {
      data.value = res.data;
    });
  };
  const changeTime = "changeTime";
  const handleTimeChange = (time) => {
    getData(time);
  };
  onMounted(() => {
    bus.on(changeTime, handleTimeChange);
  });

  onUnmounted(() => {
    bus.off(changeTime, handleTimeChange);
  });

  return data;
}

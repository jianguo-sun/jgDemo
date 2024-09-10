<template>
  <a-col
    :span="props.colItem.col || 24"
    class="col"
    :class="{ background: props.colItem.background }"
  >
    <div class="label" :style="colItem?.labelStyle ?? {}">{{ props.colItem?.label }}</div>
    <div v-if="colItem?.prop" class="value" :style="colItem?.valueStyle ?? {}">{{ props.showData&&props.showData[colItem?.prop] }}</div>
    <div v-if="colItem?.text" class="value" :style="colItem?.valueStyle ?? {}">{{  props.colItem?.text}}</div>
  </a-col>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  colItem: {},
  showData: {},
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.col {
  padding: 8px 16px;
  margin-bottom: 6px;
  display: flex;
}
.label {
  color: #a2b9d3;
  font-size: 16px;
  width: 100px;
  // text-align: end;
}

.value {
  flex :1;
  color: #d7e6f7;
  font-size: 16px;
  margin-left: 10px;
}

.background {
  background: rgba(11, 24, 49, 0.5);
}
</style>

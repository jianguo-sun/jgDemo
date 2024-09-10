<template>
  <div>
    <div v-for="item in colList" :key="item.prop">
      <a-row v-if="item.rows">
        <ColItem
          v-for="(colItem, index) in item.rows"
          :key="index"
          v-bind="$attrs"
          :colItem="colItem"
        />
      </a-row>
      <ColItem v-else v-bind="$attrs" :colItem="item" />
      <!-- <a-col
      v-else
      :span="item.col || 24"
      class="col"
      :class="{ background: item.background }"
    >
      <div class="label">{{ item.label }}</div>
      <div class="value">{{ props.showData[item.prop] }}</div>
    </a-col> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ColItem from "./SyCellItem.vue";
const props = defineProps({
  colList: { type: Array },
});

onMounted(() => {});
</script>

<style scoped lang="scss"></style>

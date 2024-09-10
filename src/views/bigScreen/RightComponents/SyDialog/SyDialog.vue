<template>
  <a-modal
    ref="modalRef"
    :key="Math.random()"
    :model-value="isOpen"
    :wrap-style="{ overflow: 'hidden' }"
    :width="props.width || '520px'"
    :footer="null"
    :maskClosable="false"
    v-bind="$attrs"
    @update:model-value="handleModelValueChange"
    @ok="handleOk"
  >
    <div class="modal_body">
      <div class="header" ref="modalTitleRef">
        <div class="title">{{ props.title }}</div>
      </div>
      <div class="body_div">
        <slot></slot>
      </div>
    </div>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useDraggable } from "@vueuse/core";

// Define props
const props = defineProps({
  modelValue: Boolean,
  title: String,
  width: String,
});
const emit = defineEmits(["update:modelValue"]);

// Reactive state
const isOpen = ref(props.modelValue);
const modalTitleRef = ref(null);
const { x, y, isDragging } = useDraggable(modalTitleRef);

const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);

const dragRect = ref({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

let startX = 0;
let startY = 0;
let startedDrag = false;

// Handle dragging logic
watch([x, y], () => {
  if (!startedDrag) {
    startX = x.value;
    startY = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value = {
      left: 0,
      right: bodyRect.width - titleRect.width,
      top: 0,
      bottom: bodyRect.height - titleRect.height,
    };
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag = true;
});

watch([x, y, () => isDragging.value], () => {
  if (startedDrag) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY;
  }
});

// Computed transform style
const transformStyle = computed(() => ({
  transform: `translate(${transformX.value}px, ${transformY.value}px)`,
}));

// Sync `isOpen` with `modelValue`
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
  }
);

// Emit `modelValue` change
watch(isOpen, (newVal) => {
  emit("update:modelValue", newVal);
});

const handleModelValueChange = (value) => {
  isOpen.value = value;
};

onMounted(() => {});

const handleOk = () => {
  isOpen.value = false;
};
</script>
<style scoped lang="scss">
:deep(.ant-modal-content) {
  min-width: 400px;
  min-height: 240px;
  background: linear-gradient(
    0deg,
    rgba(15, 37, 64, 0.8) 0%,
    rgba(17, 66, 134, 0.8) 100%
  );
  border: 1px solid rgba(66, 149, 242, 0.78);
  border-radius: unset;
  padding: 10px;
}

/* 添加到你的样式文件中 */
:deep(.ant-modal-content::before) {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/modal_left_up.png"),
    url("./images/modal_left_down.png");
  background-repeat: no-repeat, no-repeat;
  background-position: top left, bottom left;
  background-size: 20px 20px;
  pointer-events: none;
}

/* 添加到你的样式文件中 */
:deep(.ant-modal-content::after) {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/modal_right_up.png"),
    url("./images/modal_right_down.png");
  background-repeat: no-repeat, no-repeat;
  background-position: top right, bottom right;
  background-size: 20px 20px;
  pointer-events: none;
}

:deep(.ant-modal-close-x) {
  color: #d4e3f6;
}

/* 设置表头背景颜色 */
:deep(.ant-table-thead > tr > th) {
  background-color: #0d73c7;
  color: #d7e6f7;
  /* 设置表头文字颜色以确保可读性 */
  height: 20px;
  line-height: 20px;
  padding: 8px 16px;
  border-bottom: none;
}

:deep().ant-table-thead > tr > th::before {
  display: none !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #0d73c7;
  height: 42px !important;
  color: #d7e6f7;
  /* 设置表头文字颜色以确保可读性 */
}

/* 设置单元格背景颜色 */
:deep(.ant-table-tbody > tr > td) {
  background-color: rgba(13, 115, 199, 0.25) !important;
  color: #d7e6f7;
  height: 20px;
  line-height: 20px;
  padding: 8px 16px;
  border: none !important;
}

/* 设置选中或悬浮的单元格背景颜色 */
:deep(.ant-table-tbody > tr:hover) {
  background-color: rgba(13, 115, 199, 0.5);
}

:deep(.ant-table) {
  background-color: transparent;
}

:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: rgba(13, 115, 199, 0.5) !important;
}

.modal_body {
  .header {
    width: 80%;
    height: 37px;
    cursor: move;
    background: linear-gradient(
      to right,
      rgba(54, 143, 243, 0.8) 0%,
      rgba(4, 130, 231, 0.1) 56%,
      transparent 100%
    );

    .title {
      transform: skewX(-15deg);
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      line-height: 36px;
      margin-left: 10px;
      text-shadow: 1px 2px 6px rgba(41, 128, 220, 0.59);
    }
  }

  .body_div {
    margin-top: 10px;
  }
}

.dia_box {
  :deep() .ant-modal {
    width: 600px;
  }
}

:deep() .ant-table-cell {
  box-shadow: none !important;
}
</style>

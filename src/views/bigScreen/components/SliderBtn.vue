<template>
    <div>
        <a-slider class="slider_box" v-model:value="linePercent" @blur="afterChange" />
        <div class="btn_box">
            <img src="@/assets/images/continue.png" @click="startAndPurse(false)" alt="" />
            <img src="@/assets/images/pause.png" @click="startAndPurse(true)" alt="" />
        </div>
    </div>
</template>
<script setup>
import { ref, onUnmounted } from "vue";
import bus from "@/utils/mitt";
const props = defineProps({
    // carNum: "",
    backData: {}
});
const linePercent = ref(0);
const showDialog = ref(true);
bus.on('getSliderPercent', (data) => {// 接收数据
    linePercent.value = data;
})
// 开始或者暂停
const startAndPurse = (isPause) => {
    bus.emit('startAndPurse', isPause)
};
const afterChange = () => {
    bus.emit('afterTimeChange', linePercent.value)
};
onUnmounted(() => {
    bus.off('getSliderPercent');
});
</script>
<style lang="scss" scoped>
:deep() .col {
    margin-bottom: 0;
    background: none;
}

.slider_box {
    width: 90%;
    margin-right: 20px;

    :deep() .ant-slider-rail {
        background-color: #cccccc2e;
    }
}

.continue {
    background-image: url('@/assets/images/continue.png');
    background-size: cover;
    // width:15px;
}

.btn_box {
    margin-top: 10px;
    margin-bottom: 10px;

    img {
        width: 40px;
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>
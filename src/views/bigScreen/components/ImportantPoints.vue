<template>
    <SyDialog v-model:open="showDialog" :title="diaTitle" width="600px" :mask="false">
        <a-row align="middle">
            <a-col :span="14">
                <SyCells :colList="getFormCol(formName)" :showData="backData"></SyCells>
            </a-col>
            <a-col :span="10">
                <img width="100%" src="@/assets/images/dyc_point.jpg" alt="" />
            </a-col>
        </a-row>

    </SyDialog>
</template>
<script setup>
import SyDialog from "@/views/bigScreen/RightComponents/SyDialog/SyDialog.vue";
import SyCells from "@/views/bigScreen/RightComponents/SyCells/SyCells.vue";
import { getFormCol } from "../RightComponents/mapInfo.js"
import { onMounted, ref, watch } from "vue";
import bus from "@/utils/mitt";
const props = defineProps({
    backData: {}
});
const showDialog = ref(false);
const formName = ref('')
const diaTitle = ref('')
watch(showDialog, (newVal) => {
    !newVal && bus.emit("closePoints", newVal);
});
onMounted(() => {
    getpointsName()
})
const getpointsName = () => {
    formName.value = 'points' + props.backData.type;
    diaTitle.value = props.backData.carPlate
    showDialog.value = true
}
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
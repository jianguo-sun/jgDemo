<template>
    <SyDialog v-model:open="showDialog" :title="diaTitle" width="600px" :mask="false">
        <DycBack v-if="backData.machineType == '3'" :backData="backData" :tableData="backData?.passedCoordinates">
        </DycBack>
        <a-row v-else align="middle">
            <a-col :span="14">
                <SyCells :colList="getFormCol(formName)" :showData="backData"></SyCells>
            </a-col>
            <a-col :span="10">
                <SliderBtn></SliderBtn>
                <img v-if="props.backData.machineType == '5'" :src="personImg" width="100%" alt="" />
                <video v-else :src="videoUrl" controls width="100%">
                    <track kind="subtitles" src="@/assets/video/subtitles.vtt" srclang="en" label="English">
                    <track kind="descriptions" src="@/assets/video/descriptions.vtt" srclang="en"
                        label="English Descriptions">
                </video>
            </a-col>
        </a-row>

    </SyDialog>
</template>
<script setup>
import SyDialog from "@/views/bigScreen/RightComponents/SyDialog/SyDialog.vue";
import SyCells from "@/views/bigScreen/RightComponents/SyCells/SyCells.vue";
import zzjVideo from "@/assets/images/video/zzj.mp4"
import personImg from "@/assets/images/video/person.jpg"
import menjiVideo from "@/assets/images/video/menji.mp4"
import DycBack from "./DycBack"
import SliderBtn from "./SliderBtn"
import { getFormCol, getTableCol, getDialogTitle } from "../RightComponents/mapInfo.js"
import { onMounted, ref, watch } from "vue";
import bus from "@/utils/mitt";
const props = defineProps({
    backData: Object
});
const showDialog = ref(false);
const formName = ref('')
const diaTitle = ref('')
const videoUrl = ref('')
watch(showDialog, (newVal) => {
    !newVal && bus.emit("closeplayBack", newVal);
});
onMounted(() => {
    machineName()
})
const machineName = () => {
    if (props.backData.machineType == '1') {
        formName.value = 'zcBack';
        diaTitle.value = props.backData.carPlate;
        videoUrl.value = zzjVideo;
    } else if (props.backData.machineType == '5') {
        formName.value = 'perBack'
        diaTitle.value = props.backData.driverName
        videoUrl.value = personImg;
    } else if (props.backData.machineType == '2') {
        formName.value = 'mjBack'
        diaTitle.value = props.backData.loaderName;
        videoUrl.value = menjiVideo;
    } else if (props.backData.machineType == '3') {
        diaTitle.value = '点位轨迹'
    }
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
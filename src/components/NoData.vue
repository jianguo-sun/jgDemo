<template>
    <div class="nodata_box">
        <img src="@/assets/images/icon_nodata.png" alt="" />
        <div class="text">暂无数据</div>
    </div>
</template>
<script setup>
</script>
<style lang="scss" scoped>
.nodata_box {
    position: relative;

    img {
        width: 100%;
        padding-top: 35px;
        margin: 10px 0px;
        background: linear-gradient(90deg, rgba(32, 63, 144, 0.4) 0%, rgba(9, 18, 29, 0.4) 99%);
        // border: 1px solid #3D60BB;
    }

    .text {
        position: absolute;
        font-size: 14px;
        color: #3E92EF;
        bottom: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
    }

}
</style>
<template>
  <div>
    <a-flex align="center" class="title_box">
      <img class="title_img" src="@/assets/images/left/ship_plan.png" alt="" />
      <div class="title_font">
        12H船舶进出港计划
        <span class="sub_font">SHIP ENTRY AND EXIT PLAN</span>
      </div>
    </a-flex>
    <a-list v-if="props.dataList.length > 0" class="demo-loadmore-list" item-layout="horizontal"
      :data-source="props.dataList">
      <template #loadMore>
        <div v-if="!initLoading && !loading"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        </div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta :description="item.planStartTime">
              <template #title>
                <div>{{ item.shipName }}
                  <!-- <a-progress :steps="10" :percent="50" /> -->
                </div>
              </template>
              <template #avatar>
                <img src="@/assets/images/left/ship_pic.png" class="item_img" alt="" />
              </template>
            </a-list-item-meta>

          </a-skeleton>
          <template #actions>
            <img width="62" alt="logo" :src="item.planType == '3' ? shipinbg : shipoutbg" />
          </template>
        </a-list-item>
      </template>
    </a-list>
    <NoData v-else></NoData>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import NoData from "@/components/NoData.vue"
import shipinbg from "@/assets/images/left/shipinbg.png";
import shipoutbg from "@/assets/images/left/shipoutbg.png";
const props = defineProps({
  dataList: { type: Array },
})
const count = 3;

const initLoading = ref(true);
const loading = ref(false);
const data = ref([]);
onMounted(() => {
});
</script>
<style scoped lang="scss">
@import "@/assets/css/left-list.scss";

// .demo-loadmore-list {
//   // min-height: 350px;
// }
:deep() .ant-list-item {
  //     background-image: linear-gradient(to right, #20449b 0%, transparent 100%);
  //     border: 1px solid #41c3fa !important;
  //     margin: 0.8rem 1rem;
  padding: 0.5rem 0 0.5rem 0.5rem;
  //     border-radius: 2px;
  //     .ant-list-item-action>li{
  //       padding: 0 0 0 8px;
}

// }
:deep() .ant-list-item-meta {
  align-items: center !important;

  .ant-list-item-meta-title {
    //  font-family: AlibabaPuHuiTiM !important;
    font-size: 18px !important;
    color: #FFFFFF !important;
  }

  .ant-list-item-meta-description {
    // font-family: AlibabaPuHuiTiR !important;
    font-size: 14px !important;
    color: #FFFFFF !important;
    opacity: 0.6 !important;
  }
}

:deep() .ant-list-item-meta-avatar {
  // width: 5rem !important;
  padding: 5px 5px 0;
  background: linear-gradient(90deg, #203F90 0%, #09121D 99%);
  border: 1px solid #4295F2;
}

.item_img {
  width: 140px;
}
</style>
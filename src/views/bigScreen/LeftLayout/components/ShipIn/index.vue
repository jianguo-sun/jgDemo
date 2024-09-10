<template>
  <div>
    <a-flex align="center" class="title_box">
      <img v-if="props.inoutType == 'in'" class="title_img" src="@/assets/images/left/planin.png" alt="" />
      <img v-else class="title_img" src="@/assets/images/left/planout.png" alt="" />
      <div class="title_font">
        12H{{ props.inoutType == "in" ? "入" : "出" }}库计划
        <span class="sub_font">{{
        props.inoutType == "in" ? "WAREHOUSING PLAN" : "DELIVERY FROM SRORAGE"
      }}</span>
      </div>
    </a-flex>
    <a-list v-if="props.dataList?.length" class="demo-loadmore-list" item-layout="horizontal" :data-source="dataList">
      <template #loadMore>
        <div v-if="!loading" :style="{
        textAlign: 'center',
        marginTop: '12px',
        height: '32px',
        lineHeight: '32px',
      }"></div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item @click="handleClick(item)">
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta>
              <template #title>
                <a-flex align="center">
                  <div class="list_mid">
                    <span class="company">
                      {{ item.shipName }}
                      <span class="ship_num">{{ item.planTon }}</span>吨
                      <span class="ship_status" :class="item.delayRemark != '正常'
        ? 'status_delay'
        : 'status_nor'
        ">{{ item.delayRemark }}</span>
                    </span>

                    <a-progress :steps="25" :percent="item.percent || 0" size="small">
                      <template #format="percent">
                        <span>{{ item.percent || 0 }}%</span>
                      </template>
                    </a-progress>
                  </div>
                  <a-progress type="circle" :percent="item.percent || 0" :size="40">
                    <template #format="percent">
                      <span style="color: #ffffff">{{ item.percent || 0 }}%</span>
                    </template>
                  </a-progress>
                </a-flex>
              </template>
              <template #avatar>
                <div class="ship_name">{{ item.goodsName }}</div>
              </template>
            </a-list-item-meta>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
    <NoData v-else></NoData>
  </div>
</template>
<script setup>
import NoData from "@/components/NoData.vue"
import { onMounted, ref } from "vue";

const emit = defineEmits(["handleDetail"]);
const props = defineProps({
  dataList: { type: Array },
  inoutType: { type: String },
});
const count = 3;
const loading = ref(false);
const handleClick = (item) => {
  item.inoutType = props.inoutType
  emit("handleDetail", item);
};
onMounted(() => {
});
</script>
<style scoped lang="scss">
@import "@/assets/css/left-list.scss";

// .demo-loadmore-list {
//   min-height: 350px;
// }
.ant-list-item {
  cursor: pointer;
}

:deep() .ant-list-item-meta {
  align-items: center !important;

  .ant-list-item-meta-title {
    color: #ffffff !important;
    margin-bottom: 0;
  }

  .ant-list-item-meta-description {
    color: #cccccc !important;
  }
}

:deep() .ant-list-item-meta-avatar {
  width: 115px !important;
}

.ship_name {
  text-align: center;
  color: #3fb9f2;
  font-weight: 500;
  font-size: 15px;
  padding: 0.25rem 1rem;
  background: #10213a;
}

.company {
  color: #ffffff;
  padding: 6px 10px;
  background: linear-gradient(90deg, #1c65b6 0%, rgba(5, 20, 33, 0) 100%);

  .ship_num {
    color: #37b6f7;
    margin: 0 10px;
  }

  .ship_status {
    font-size: 12px;
    padding: 1px 13px;
    background-size: cover;
    float: right;
  }

  .status_nor {
    background-image: url("@/assets/images/left/status_bg.png");
    color: #43f7ff;
  }

  .status_delay {
    background-image: url("@/assets/images/left/status_delay.png");
    color: #ff7418;
  }
}

:deep() .ant-progress {
  .ant-progress-steps-item {
    min-width: 4px;
    margin-top: 10px;
    background: #103762;
    margin-left: 2px;
  }

  .ant-progress-steps-item-active {
    // color: #103762;
    background: linear-gradient(90deg, #3892f4 0%, #38c1f4 100%);
  }
}

:deep() .ant-progress-line {
  margin-bottom: 0;
}

:deep() .list_mid .ant-progress-text {
  display: none;
}
</style>

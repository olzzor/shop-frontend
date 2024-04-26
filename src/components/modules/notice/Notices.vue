<template>
  <div class="notices">
    <div class="title"></div>

    <div class="content" v-if="state.notices.length > 0">
      <div class="notices-grid">
        <div class="notice-item" v-for="n in state.notices" :key="n.id">
          <div class="notice-img">
            <router-link :to="{ name: 'NoticeDetail', params: { id: n.id }}">
              <img :src="`${n.noticeMainImage.fileUrl}`" />
            </router-link>
          </div>
          <div class="notice-title"><b>{{ n.title }}</b></div>
          <div class="notice-details">
            <div class="notice-type">{{ n.type }}</div>
            <div class="notice-date">{{ formatter.getFormattedDate(n.regDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content no-notice-data" v-else>내용이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import formatter from "@/scripts/formatter";

export default {
  name: 'Notices',
  components: {},
  setup() {
    const route = useRoute();
    const state = reactive({
      notices: [],
    })

    const load = () => {
      axios.get(`/api/notice/active-items/${route.params.cat}`).then(({data}) => {
        state.notices = data;
      });
    }

    // 컴포넌트가 마운트되었을 때 load 함수를 호출
    onMounted(load);

    watch(() => route.params.cat, load);

    return {
      formatter,
      state,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/notice/notices";
</style>
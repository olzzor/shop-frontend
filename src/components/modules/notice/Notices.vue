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
            <div class="notice-date">{{ lib.getFormattedDate(n.regDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="margin: 30px 0 0 15px">내용이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";

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
      lib,
      state,
    }
  }
}
</script>

<style scoped>
.notices {
  padding: 70px 0 20px 0;
  display: flex;
  flex-direction: column;
}

.title {
}

.content {
  font-size: 12px;
}

.notices-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px; /* Adjust this value as needed for spacing between items */
}

.notice-item {
//border: 1px solid #e3e3e3; padding: 15px;
  display: flex;
  flex-direction: column;
  position: relative; /* 자식 요소의 위치를 기준으로 지정할 수 있게 합니다. */
  overflow: hidden; /* 이미지가 그리드를 넘어서면 숨깁니다. */
}

.notice-img {
  width: 100%; /* 그리드의 전체 너비를 사용하도록 설정 */
  height: 0;
  padding-bottom: 75%; /* 4:3 비율의 높이를 설정. 필요에 따라 조정할 수 있습니다. */
  position: relative; /* .notice-img 내부의 img 요소의 위치를 기준으로 지정 */
}

.notice-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute; /* .notice-img를 기준으로 위치를 지정 */
  top: 0;
  left: 0;
}

.notice-title {
  box-sizing: border-box;   /* box-sizing 속성을 border-box로 설정합니다. */
  text-align: left; /* 왼쪽 정렬을 설정 */
  width: 100%; /* 부모 요소의 전체 너비를 사용하도록 설정 */
  margin-top: 10px; /* 상단 여백을 추가 (선택 사항) */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 라인 수를 제한합니다. */
  -webkit-box-orient: vertical;
  overflow: hidden; /* 추가 텍스트를 숨깁니다. */
  height: 40px;
}

.notice-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 컨테이너의 전체 너비를 사용하도록 설정 */
}

.notice-type {
  padding: 0.35em 0.65em;
  color: #fff;
  background-color: #000;
  border-radius: 10rem;
  line-height: 1;
}

</style>
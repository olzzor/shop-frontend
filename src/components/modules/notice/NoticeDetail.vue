<template>
  <div class="notice-detail">

    <div class="title"><p></p></div>

    <div class="content">
      <div class="notice-title">
        {{ state.notice.title }}
      </div>

      <div class="notice-date">
        <small>
          {{ lib.getFormattedDate(state.notice.regDate, 'YYYY-MM-DD') }}
          <span v-if="isModDateAfterRegDate">(최근 수정 {{ lib.getFormattedDate(state.notice.modDate, 'YYYY-MM-DD') }})</span>
        </small>
      </div>

      <div class="notice-content">
        <div v-html="lib.convertMarkdownToHtml(state.notice.content)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  name: "NoticeDetail",
  data() {
    return {
      notice: Object
    };
  },

  setup() {
    const route = useRoute();
    const state = reactive({
      notice: {
        id: 0, type: '', title: '', content: '', startDate: '', endDate: '', status: '', regDate: '', modDate: '',
        files: [],
      }
    })

    const setNotice = (data) => {
      state.notice = {
        id: data.id,
        title: data.title,
        content: data.content,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        regDate: data.regDate,
        modDate: data.modDate,
        files: data.noticeImages,
      };
    }

    const isModDateAfterRegDate = computed(() => {
      // 년월일 형식으로 날짜 포맷팅
      const modDateFormatted = lib.getFormattedDate(state.notice.modDate, 'YYYY-MM-DD');
      const regDateFormatted = lib.getFormattedDate(state.notice.regDate, 'YYYY-MM-DD');

      // 문자열 비교로 날짜 비교
      return modDateFormatted > regDateFormatted;
      // const modDate = new Date(state.notice.modDate);
      // const regDate = new Date(state.notice.regDate);
      // return modDate > regDate;
    });

    const load = () => {
      axios.get(`/api/notice/${route.params.id}`).then(({data}) => {
        setNotice(data);
      })
    };

    onMounted(load);

    return {
      lib,
      state,
      isModDateAfterRegDate,
    }
  }
}
</script>

<style scoped>
.notice-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}

.notice-detail .title {
}

.notice-detail .content {
  padding-inline: 15px;
}

.notice-detail .notice-title {
  font-size: 20px;
  font-weight: bold;
}

.notice-detail .notice-date {
  color: darkgray;
  margin-bottom: 15px;
}

.notice-detail .notice-content {
  width: 100%;
  padding: 20px;
}

.notice-detail .notice-content img {
  max-width: 100%; /* 이미지의 최대 너비를 notice-content의 너비로 제한 */
  height: auto; /* 높이를 자동으로 조절하여 이미지의 원래 비율을 유지 */
}

</style>

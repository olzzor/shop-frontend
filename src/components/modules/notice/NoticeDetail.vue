<template>
  <div class="notice-detail">
    <div class="title"></div>

    <div class="content">
      <div class="notice-title">
        {{ state.notice.title }}
      </div>

      <div class="notice-date">
        <small>
          {{ formatter.getFormattedDate(state.notice.regDate, 'YYYY-MM-DD') }}
          <span v-if="isModDateAfterRegDate">(최근 수정 {{ formatter.getFormattedDate(state.notice.modDate, 'YYYY-MM-DD') }})</span>
        </small>
      </div>

      <div class="notice-content">
        <div class="ck-content" v-html="formatter.convertMarkdownToHtml(state.notice.content)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import formatter from "@/scripts/formatter";

export default {
  name: "NoticeDetail",
  components: {},
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
      const modDateFormatted = formatter.getFormattedDate(state.notice.modDate, 'YYYY-MM-DD');
      const regDateFormatted = formatter.getFormattedDate(state.notice.regDate, 'YYYY-MM-DD');

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
      formatter,
      state,
      isModDateAfterRegDate,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/notice/notice-detail";
@import "@/assets/content-styles.css";
</style>

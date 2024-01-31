<template>
<!--  Home.vue 로 이동-->
<!--  <div class="modal-overlay" v-if="state.show"></div>-->

  <div class="modal-content" v-if="state.show">
    <div class="notice-image">
      <router-link :to="{ name: 'NoticeDetail', params: { id: notice.id }}">
        <img :src="`${notice.noticeModalImage.fileUrl}`" />
      </router-link>
    </div>

    <div class="actions">
      <label class="checkbox-wrapper" @click="state.doNotShowToday = !state.doNotShowToday">
        <i v-if="state.doNotShowToday" class="bi bi-check-square-fill"></i>
        <i v-else class="bi bi-square"></i>
        오늘 하루 보지 않기
      </label>

      <span class="close-text" @click="close">닫기 X</span>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import dayjs from "dayjs";

export default {
  name: "NoticeModal",
  props: ['notice', 'show'],
  setup(props, {emit}) {

    const state = reactive({
      show: true,
      doNotShowToday: false,
    });

    onMounted(() => {
      const modals = JSON.parse(localStorage.getItem('modals') || '[]');
      const currentModal = modals.find(m => m.noticeId === props.notice.id);

      if (currentModal && currentModal.hideDate === dayjs().format('YYYY-MM-DD')) {
        state.show = false;
      } else {
        emit('showOverlay');
      }
    });

    const close = () => {
      if (state.doNotShowToday) {
        const modals = JSON.parse(localStorage.getItem('modals') || '[]');
        const currentModal = modals.find(m => m.noticeId === props.notice.id);

        const today = dayjs().format('YYYY-MM-DD');

        if (currentModal) {
          currentModal.hideDate = today;
        } else {
          modals.push({noticeId: props.notice.id, hideDate: today});
        }

        localStorage.setItem('modals', JSON.stringify(modals));
      }
      state.show = false;

      emit('close');
    }

    return {
      state,
      close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/notice/notice-modal";
</style>

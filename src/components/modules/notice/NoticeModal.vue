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

<style scoped>
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-size: .75rem;
}

.notice-image img {
  max-width: 100%; /* 이미지의 너비를 조정 */
  height: auto; /* 이미지의 높이를 조정 */
}

.actions {
  display: flex;
  justify-content: space-between; /* 체크박스는 왼쪽, 닫기 버튼은 오른쪽으로 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 20px;
}

.close-text {
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
}
</style>

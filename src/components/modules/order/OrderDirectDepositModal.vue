<template>
  <div class="modal-overlay"></div>

  <div class="modal-content">
    <div class="announce-message">
      <p class="account-info">입금 계좌: 국민 이슬아 123456-78-901234</p>
      <p class="deadline-info">입금 기한: 주문일로부터 24시간 이내</p>
      <p class="additional-info">※ 주문자명과 입금자명이 다를 경우, 주문번호와 함께 고객센터로 연락 바랍니다.</p>
    </div>

    <div class="actions">
      <button type="button" class="button btn-confirm" @click="confirm" :disabled="state.isSubmitting">확인</button>
      <button type="button" class="button btn-cancel" @click="close">취소</button>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: "DirectDepositModal",
  emits: ['confirm', 'close'],
  setup(props, {emit}) {
    const state = reactive({
      isSubmitting: false,
    });

    const confirm = () => {
      state.isSubmitting = true;
      emit('confirm');
    };

    const close = () => {
      emit('close');
    };

    return {
      state, confirm, close,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-direct-deposit-modal";
</style>
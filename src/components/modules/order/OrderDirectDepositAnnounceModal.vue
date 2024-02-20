<template>
  <div class="modal-overlay"></div>

  <div class="modal-content">
    <div class="announce-message">
      <p class="account-info">입금 계좌: 국민 이슬아 123456-78-901234</p>
      <p class="deadline-info">입금 기한: {{ deadline }}까지</p>
      <p class="additional-info">※ 주문자명과 입금자명이 다를 경우, 주문번호와 함께 고객센터로 연락 바랍니다.</p>
    </div>

    <div class="actions">
      <span class="close-text" @click="close">닫기 X</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DirectDepositAnnounceModal",
  props: {deadline: String},
  emits: ['close'],
  setup(props, {emit}) {
    const close = () => {
      emit('close');
    };

    return {
      close,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-direct-deposit-announce-modal";
</style>
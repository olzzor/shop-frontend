<!-- 아임포트 결제 리다이렉트 페이지 -->
<template>
  <div class="order-redirect-iamport">
    <div class="spinner-container">
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <p>Loading...</p>

<!--    <div v-if="error" class="error-message">-->
<!--      결제 처리 중 오류가 발생했습니다: {{ errorMessage }}-->
<!--    </div>-->
<!--    <div v-if="success" class="success-message">-->
<!--      결제가 성공적으로 처리되었습니다.-->
<!--    </div>-->
  </div>
</template>

<script>

export default {
  name: "OrderRedirectIamport",
  setup() {
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-redirect-iamport";
</style>

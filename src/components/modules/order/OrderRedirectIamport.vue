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
  </div>
</template>

<script>

import axios from "axios";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import router from "@/scripts/router";

export default {
  name: "OrderRedirectIamport",
  setup() {
    const route = useRoute();

    const load = () => {
      const imp_uid = route.query.imp_uid; // URL에서 imp_uid 값을 추출

      axios.post(`/api/payment/payment-gateway/mobile/${imp_uid}`).then(() => {
        window.alert('결제가 완료되었습니다.');
        router.push({name: 'OrderHistory'});

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        router.push({name: 'Cart'});

      }).finally(() => {
        // state.isSubmitting = false;
        // router.push({name: 'OrderHistory'});
      });
    };

    onMounted(load);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-redirect-iamport";
</style>

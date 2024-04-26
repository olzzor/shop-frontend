<template>
  <div class="return-exchange">
    <div class="title">
      <span>반품/교환 안내</span>
    </div>

    <div class="content">
      반품 시 먼저 판매자와 연락하셔서 반품 사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 반품 상품을 발송해 주시기 바랍니다.<br><br>

      판매자 지정택배사<br><br>
      한진택배<br>
      <hr>

      반품 배송비<br><br>
      편도 3,000원 (최초 배송비 무료인 경우 6,000원 부과)<br>
      <hr>

      교환 배송비<br><br>
      6,000원<br>
      <hr>

      보내실 곳<br><br>
      서울특별시 영등포구 도림로 125길 16 빈스 가레-지 (우: 07290)<br>
      <hr>

      반품/교환 사유에 따른 요청 가능 기간<br><br>
      구매자 단순 변심은 상품 수령 후 7일 이내 (구매자 반품 배송비 부담)<br>
      표시/광고와 상이, 계약 내용과 다르게 이행된 경우 상품 수령 후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터 30일 이내 (판매자 반품 배송비 부담)<br>
      둘 중 하나 경과 시 반품/교환 불가<br>
      <hr>

      반품/교환 불가능 사유<br><br>
      1. 반품 요청 기간이 지난 경우<br>
      2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외)<br>
      3. 구매자의 책임 있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된 경우 (예: 식품, 화장품, 향수류, 음반 등)<br>
      4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우 (라벨이 떨어진 의류 또는 태그가 떨어진 명품관 상품인 경우)<br>
      5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우<br>
      6. 고객의 요청사항에 맞춰 제작에 들어가는 맞춤 제작 상품의 경우 (판매자에게 회복 불가능한 손해가 예상되고, 그러한 예정으로 청약철회권 행사가 불가하다는 사실을 서면 동의 받은 경우)<br>
      7. 복제가 가능한 상품 등의 포장을 훼손한 경우 (CD/DVD/GAME/도서의 경우 포장 개봉 시)<br>

    </div>

<!--    <ContactUsModal v-if="state.showContactUsModal" :show="state.showContactUsModal"-->
<!--                    @close="state.showContactUsModal = false" @updated="load" />-->
  </div>
</template>

<script>
import {reactive} from "vue";
// import ContactUsModal from "@/components/modules/contact/ContactUsModal.vue";

export default {
  name: "ReturnExchange",
  // components: {ContactUsModal},
  setup() {
    const state = reactive({
    });

    return {
      state
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/support/return-exchange";
</style>
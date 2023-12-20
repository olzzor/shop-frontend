<template>
  <div class="order">
    <div class="title">주문 및 결제</div>

    <div class="content">
      <div class="shipping-info">
        <ShippingInfo ref="addressRef" @do-order="order"/>
      </div>

      <div class="price-summary">
        <PriceSummary :cartProducts="cartProducts" @update-price="totalPrice"/>
      </div>

      <div class="action-buttons">
        <button class="button btn-payment" type="button" @click="order" :disabled="state.isSubmitting">결제하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import ShippingInfo from "@/components/modules/order/OrderShippingInfo.vue";
import PriceSummary from "@/components/modules/order/OrderPriceSummary.vue";
import {ref, onMounted, reactive} from 'vue';
import {useRoute} from "vue-router";
import axios from "axios";
import router from "@/scripts/router";

const {IMP} = window;

export default {
  name: "Order",
  components: {ShippingInfo, PriceSummary},
  setup() {
    const state = reactive({
      isSubmitting: false,
      items: [],
      form: {items: "",}
    });

    const price = ref(0);
    const addressRef = ref(null);
    const route = useRoute();
    const cartProducts = ref(route.query.cartProducts || []);

    const totalPrice = (amount) => {
      price.value = amount;
    };

    onMounted(() => {
      document.cookie = "safeCookie1=foo; SameSite=Lax";
      document.cookie = "safeCookie2=foo";
      document.cookie = "crossCookie=bar; SameSite=None; Secure";
    });

    const order = () => {
      state.isSubmitting = true;

      // 상품 재고 상태 검사
      axios.get('/api/order/check-stock').then(({data}) => {
        if (data) {
          payment(); // 상품 재고가 충분한 경우 결제 프로세스 진행

        } else {
          window.alert('재고가 부족한 상품이 존재합니다.');
          state.isSubmitting = false;
        }

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              window.alert(error.response.data.message);
              break;
            default:
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        }

        state.isSubmitting = false;
      });
    };

    const payment = () => {
      if (addressRef.value.checkInput()) {
        const addressInfo = addressRef.value.getAddress();

        IMP.init("imp13050435");

        IMP.request_pay({ // param
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: new Date().getTime(), // 상점에서 관리하는 주문 번호를 전달
          name: "주문명: 테스트",
          amount: price.value, // 총 결제 금액
          buyer_email: addressInfo.email,
          buyer_name: addressInfo.name,
          buyer_tel: addressInfo.phone,
          buyer_addr: addressInfo.address2 ? `${addressInfo.address1} ${addressInfo.address2}` : addressInfo.address1,
          buyer_postcode: addressInfo.zipCode
        }, rsp => { // callback
          console.log(rsp);
          const imp_uid = rsp.imp_uid;

          if (rsp.success) {
            axios.post(`/api/verifyIamport/${imp_uid}`).then((result) => {
              if (rsp.paid_amount === result.data.response.amount) {
                alert("결제가 완료되었습니다.");
              } else {
                alert("결제에 실패했습니다." + "에러코드 : " + rsp.error_code + "에러 메시지 : " + rsp.error_message);
              }

            }).finally(() => {
              state.isSubmitting = false;
              router.push({path: "/member/order-history"});
            });

          } else {
            state.isSubmitting = false;
            alert("결제에 실패했습니다.");
          }
        });

      } else {
        state.isSubmitting = false;
      }
    };

    return {
      price, state, addressRef, cartProducts,
      totalPrice, order
    };
  }
}
</script>

<style scoped>
.order {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* content가 넘칠 경우 다음 줄로 넘어가게 설정 */
}

.shipping-info {
  flex: 1; /* 각각의 flex item이 동일한 너비를 차지하도록 설정 */
}

.price-summary {
  width: 200px;
}

.action-buttons {
  width: 100%; /* 전체 너비를 차지하게 설정 */
  text-align: center; /* 버튼을 중앙에 배치 */
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 100%;
  margin-block: 10px;
  border-radius: 5px;
  border: none; /* 테두리 제거 */
}

.btn-payment {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  margin-inline: auto;
  display: block; /* block으로 설정하여 width를 제어합니다. */
  width: 50%;
}

</style>
<template>
  <div class="order">
    <div class="title">주문 및 결제</div>

    <div class="content">
      <div class="checkout-details">
        <CheckoutDetails ref="checkoutDetailsRef" @do-order="order" />
      </div>

      <div class="price-summary">
        <PriceSummary @payment-amount="totalPrice" />
      </div>

      <div class="action-buttons">
        <button class="button btn-payment" type="button" @click="order" :disabled="state.isSubmitting">결제하기</button>
      </div>
    </div>

    <DirectDepositModal v-if="state.directDepositModal.show" :show="state.directDepositModal.show"
                        @close="closeDirectDepositModal" @confirm="confirmDirectDeposit"/>
  </div>
</template>

<script>
import {ref, onMounted, reactive} from 'vue';
import axios from "axios";
import router from "@/scripts/router";
import iamport from "@/scripts/iamport";
import CheckoutDetails from "@/components/modules/order/OrderCheckoutDetails.vue";
import PriceSummary from "@/components/modules/order/OrderPriceSummary.vue";
import DirectDepositModal from "@/components/modules/order/OrderDirectDepositModal.vue";
import store from "@/scripts/store";

const {IMP} = window;

export default {
  name: "Order",
  components: {DirectDepositModal, CheckoutDetails, PriceSummary},
  setup() {
    const checkoutDetailsRef = ref(null);
    const paymentAmount = ref(0);
    const state = reactive({
      isSubmitting: false,
      cartProducts: [],
      directDepositModal: { show: false },
    });

    const totalPrice = (amount) => {
      paymentAmount.value = amount;
    };

    const order = () => {
      state.isSubmitting = true;

      // 상품 재고 상태 검사
      axios.get('/api/order/check-stock').then(({data}) => {
        if (data) { // 상품 재고가 충분한 경우 결제 프로세스 진행
          if (checkoutDetailsRef.value.checkInput()) { // 입력값 체크
            if (checkoutDetailsRef.value.getCheckoutDetails().paymentMethod === 'direct_bank') {
              // 무통장 입금의 경우, 입금 안내 모달 표시
              state.directDepositModal.show = true;
            } else {
              // 무통장 입금이 아닌 경우, PG사 연동
              payment();
            }
          } else {
            state.isSubmitting = false;
          }
        } else {
          window.alert('재고가 부족한 상품이 존재합니다.');
          state.isSubmitting = false;
        }

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }

        state.isSubmitting = false;
      });
    };

    const payment = () => {
      const checkoutDetailsInfo = checkoutDetailsRef.value.getCheckoutDetails();
      const pg = checkoutDetailsInfo.paymentMethod;

      IMP.init(iamport.getUserCodeByPg(pg)); // 가맹점 식별 코드

      IMP.request_pay({ // param
        pg: pg, // PG사
        pay_method: iamport.getMethodsByPg(pg), // 결제수단
        merchant_uid: new Date().getTime(), // 주문번호
        name: "주문명: 테스트", // 주문명
        amount: paymentAmount.value, // 결제금액
        buyer_email: checkoutDetailsInfo.email, // 구매자 이메일
        buyer_name: checkoutDetailsInfo.name, // 구매자 이름
        buyer_tel: checkoutDetailsInfo.phone, // 구매자 전화번호
        buyer_addr: checkoutDetailsInfo.address2 ? `${checkoutDetailsInfo.address1} ${checkoutDetailsInfo.address2}` : checkoutDetailsInfo.address1, // 구매자 주소
        buyer_postcode: checkoutDetailsInfo.zipCode, // 구매자 우편번호
        // m_redirect_url: "https://bridgeshop.dev:3000/order/redirect/iamport",
        m_redirect_url: "http://bridgeshop.kro.kr:3000/order/redirect/iamport",

      }, rsp => { // callback
        console.log(rsp);
        const imp_uid = rsp.imp_uid;

        if (rsp.success) {
          axios.post(`/api/payment/payment-gateway/${imp_uid}`).then(() => {
            window.alert('결제가 완료되었습니다.');

          }).finally(() => {
            state.isSubmitting = false;
            router.push({name: 'OrderHistory'});
          });

        } else {
          state.isSubmitting = false;
          window.alert('결제에 실패했습니다.' + '\n에러 코드 : ' + rsp.error_code + '\n에러 메시지 : ' + rsp.error_msg);
        }
      });
    };

    const confirmDirectDeposit = () => {
      const checkoutDetailsInfo = checkoutDetailsRef.value.getCheckoutDetails();
      const payload = {
        payMethod: checkoutDetailsInfo.paymentMethod, // 결제수단
        merchantUid: new Date().getTime(), // 주문번호
        amount: paymentAmount.value, // 결제금액
        buyerEmail: checkoutDetailsInfo.email, // 구매자 이메일
        buyerName: checkoutDetailsInfo.name, // 구매자 이름
        buyerTel: checkoutDetailsInfo.phone, // 구매자 전화번호
        buyerAddr: checkoutDetailsInfo.address2 ? `${checkoutDetailsInfo.address1} ${checkoutDetailsInfo.address2}` : checkoutDetailsInfo.address1, // 구매자 주소
        buyerPostcode: checkoutDetailsInfo.zipCode, // 구매자 우편번호
      };

      axios.post(`/api/payment/direct-deposit`, payload).then(() => {
        window.alert("주문이 접수되었습니다.");
        router.push({name: 'OrderHistory'});

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        router.push({name: 'Order'});

      }).finally(() => {
        state.isSubmitting = false;
      });
    };

    const closeDirectDepositModal = () => {
      state.directDepositModal.show = false;
      state.isSubmitting = false;
    };

    const load = () => {
      axios.get('/api/cart/get').then(({data}) => {
        state.cartProducts = data.map(cp => {
          cp.selectedCoupon = cp.coupon ? cp.coupon.id : null;
          cp.availableCoupons = []; // 각 상품마다 사용 가능한 쿠폰 목록
          return cp;
        });

        const payload = data.map(d => {
          return {
            cartProductId: d.id,                    // 카트 상품 ID
            productId: d.product.id,                // 상품 ID
            categoryId: d.product.category.id       // 카테고리 ID
          };
        });

        axios.post('/api/coupon/list/available', payload).then(({data}) => {
          state.cartProducts.forEach(cp => {
            cp.availableCoupons = data.find(d => d.cartProductId === cp.id).coupons;
          });
        });

        store.commit('setCartProducts', state.cartProducts);
      });
    };

    onMounted(load);

    return {
      checkoutDetailsRef, paymentAmount, state,
      confirmDirectDeposit, closeDirectDepositModal, totalPrice, order
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order";
</style>
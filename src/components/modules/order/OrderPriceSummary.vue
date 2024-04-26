<template>
  <div class="price-summary">
    <div class="title"></div>

    <div class="content">
      <div class="total-product-amount">
        <span class="label">총 상품 금액</span>
        <span class="price">{{ formatter.getFormattedNumber(totalProductAmount) }}원</span>
      </div>

      <div class="total-discount-amount">
        <span class="label">총 할인 금액</span>
        <span class="price">- {{ formatter.getFormattedNumber(totalDiscountAmount) }}원</span>
      </div>

      <div class="delivery-fee">
        <span class="label">배송비</span>
        <span class="price">{{ formatter.getFormattedNumber(deliveryFee) }}원</span>
      </div>

      <div class="final-payment-amount">
        <span class="label">총 결제 금액</span>
        <span class="price">{{ formatter.getFormattedNumber(finalPaymentAmount) }}원</span>
      </div>

      <div class="coupon-application" @click="toggleCouponSelection">
        <div class="coupon-selection-trigger">
          <span>쿠폰 선택 * 중복 사용 불가</span>
          <i class="bi" :class="{'bi-chevron-down': !showAvailableCoupons, 'bi-chevron-up': showAvailableCoupons}"></i>
        </div>
        <div v-if="showAvailableCoupons" class="available-coupons" @change="updateCoupon">
          <div v-for="ac in state.availableCoupons" :key="ac.id" @click.stop>
            <input type="radio" :id="`coupon-${ac.id}`" :value="ac.id" v-model="state.selectedCouponId">
            <label :for="`coupon-${ac.id}`">{{ ac.name }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import formatter from "@/scripts/formatter"
import price from "@/scripts/price";
import store from "@/scripts/store";

export default {
  name: "PriceSummary",
  setup(props, { emit }) {
    const state = reactive({
      availableCoupons: [],
      selectedCouponId: 0,
    });

    const cartProducts = computed(() => store.getters.cartProducts);

    const totalProductAmount = computed(() => {
      let totalProductAmount = 0;

      for (let cp of cartProducts.value) {
        totalProductAmount += cp.product.price * cp.quantity;
      }

      return totalProductAmount;
    });

    const totalDiscountAmount = computed(() => {
      let totalDiscountAmount = 0;

      for (let cp of cartProducts.value) {
        totalDiscountAmount += (price.getDiscountPrice(cp.product) + price.getCouponPrice(cp)) * cp.quantity;
      }

      return totalDiscountAmount;
    });

    const deliveryFee = computed(() => {
      return (totalProductAmount.value - totalDiscountAmount.value > 100000) ? 0 : 3000;
    });

    const finalPaymentAmount = computed(() => {
      const amount = totalProductAmount.value - totalDiscountAmount.value + deliveryFee.value;
      emit('payment-amount', amount);
      return amount;
    });

    const showAvailableCoupons = ref(false);

    const toggleCouponSelection = () => {
      showAvailableCoupons.value = !showAvailableCoupons.value;
    };

    // const handleCouponSelect = (selectedCoupon) => {
    //   if (selectedCoupon.selected) { // 쿠폰을 선택한 경우
    //     state.selectedCouponId.push(selectedCoupon);
    //
    //   } else { // 쿠폰을 선택 해제한 경우
    //     const index = state.selectedCoupons.findIndex(coupon => coupon.id === selectedCoupon.id);
    //     if (index !== -1) {
    //       state.selectedCoupons.splice(index, 1);
    //     }
    //   }
    // };

    const getSelectedCoupon = () => {
      axios.post("/api/coupon/get-user-select").then(({data}) => {
        state.selectedCouponId  = data;
      });
    };

    const getAvailableCoupons = () => {
      axios.post("/api/coupon/get-available-list").then(({data}) => {
        state.availableCoupons = data;
      });
    };

    const updateCoupon =  () => {
      axios.post(`/api/cart/update/coupon/${state.selectedCouponId}`).then(() => {
      });
    };

    const load = () => {
      getSelectedCoupon();
      getAvailableCoupons();
    };

    onMounted(load);

    return {
      formatter,
      state,
      totalProductAmount, totalDiscountAmount, deliveryFee, finalPaymentAmount,
      showAvailableCoupons, toggleCouponSelection,
      updateCoupon,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-price-summary";
</style>
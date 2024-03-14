<template>
  <div class="price-summary">
    <div class="title"></div>

    <div class="content">
      <div class="total-product-amount">
        <span class="label">총 상품 금액</span>
        <span class="price">{{ lib.getFormattedNumber(totalProductAmount) }}원</span>
      </div>
      <div class="total-discount-amount">
        <span class="label">총 할인 금액</span>
        <span class="price">- {{ lib.getFormattedNumber(totalDiscountAmount) }}원</span>
      </div>
      <div class="delivery-fee">
        <span class="label">배송비</span>
        <span class="price">{{ lib.getFormattedNumber(deliveryFee) }}원</span>
      </div>
      <div class="final-payment-amount">
        <span class="label">총 결제 금액</span>
        <span class="price">{{ lib.getFormattedNumber(finalPaymentAmount) }}원</span>
      </div>
    </div>
  </div>
</template>

<script>
import {computed} from "vue";
import lib from "@/scripts/lib";
import price from "@/scripts/price";
import store from "@/scripts/store";

export default {
  name: "PriceSummary",
  setup(props, { emit }) {
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

    return {
      lib,
      totalProductAmount, totalDiscountAmount, deliveryFee, finalPaymentAmount,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-price-summary";
</style>
<template>
  <div class="order-detail">
    <div class="title">주문 내역 상세</div>

    <div class="content" v-if="state.order.orderDetails && state.order.orderDetails.length > 0">

      <p class="subtitle">결제 수단</p>
      <div class="payment-info">
        {{ state.order.paymentMethod }}<br>
        <span v-if="state.order.cardNumber"> {{ state.order.cardNumber }}</span><br>
      </div>

      <p class="subtitle">배송지</p>
      <div class="shipping-address">
        {{ state.order.orderDetails[0].shipment.recipientName }}<br>
        {{ state.order.orderDetails[0].shipment.recipientPhone }}<br>
        {{ state.order.orderDetails[0].shipment.shippingAddress }}<br>
      </div>

      <p class="subtitle">주문 상품</p>
      <ul class="product-info">
        <li v-for="(od, idx) in state.order.orderDetails" :key="idx">
          <div class="order-product">
            <div class="product-image">
              <router-link :to="{ name: 'ProductDetail', params: { id: od.product.id }}">
                <img :src="`${od.product.productImages[0].fileUrl}`" />
              </router-link>
            </div>

            <div class="product-details">
              {{ od.product.name }}<br>
              {{ od.productSize.size }}<br><br>
              {{ lib.getFormattedNumber(calculateItemTotalPrice(od))}}원 (수량: {{ od.quantity }})
            </div>

            <div class="product-shipment">
              <div class="shipment-status">{{lib.getShipmentStatusName(od.shipment.status)}}</div>
              <div class="shipment-info">
                {{ lib.getCourierCompanyName(od.shipment.courierCompany) }}<br>
                {{ od.shipment.trackingNumber }} <!-- TODO: 링크 작성-->
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="pricing-summary">
        상품 합계 {{ lib.getFormattedNumber(calculateOrderTotalPrice(state.order.orderDetails)) }}원<br>
        배송비 {{ lib.getFormattedNumber(calculateShipmentPrice(state.order)) }}원<br>
        합계 {{ lib.getFormattedNumber(state.order.paymentAmount) }}원
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import {useRoute} from "vue-router";

export default {
  name: 'OrderDetail',
  components: {},
  setup() {
    const route = useRoute();
    const orderId = route.params.id;
    const state = reactive({
      order: {},
    });

    const calculateItemTotalPrice = (orderDetail) => {
      return orderDetail.finalPrice * orderDetail.quantity;
    };

    const calculateOrderTotalPrice  = (orderDetails) => {
      return orderDetails.reduce((total, orderDetail) => {
        return total + calculateItemTotalPrice(orderDetail);
      }, 0); // 초기 total 값
    };

    const calculateShipmentPrice  = (order) => {
      return Math.max(order.paymentAmount - calculateOrderTotalPrice(order.orderDetails), 0);
    };

    const load = () => {
      axios.get(`/api/order/detail/${orderId}`).then(({data}) => {
        state.order = data;
      });
    }

    onMounted(load);

    return {
      lib,
      state,
      calculateItemTotalPrice , calculateOrderTotalPrice, calculateShipmentPrice
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-detail";
</style>
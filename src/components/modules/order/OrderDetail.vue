<template>
  <div class="order-detail">
    <div class="title">주문 내역 상세</div>

    <div class="content" v-if="state.order.orderDetails && state.order.orderDetails.length > 0">

      <p class="subtitle">결제 수단</p>
      <div class="payment-info">
        {{ state.order.paymentMethod }}<br>
        <span v-if="state.order.cardNumber"> {{ state.order.cardNumber }}<br></span>
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
              {{ formatter.getFormattedNumber(calculateItemTotalPrice(od))}}원 (수량: {{ od.quantity }})
            </div>

            <div class="product-interaction">
              <div class="product-shipment">
                <div class="shipment-status">{{formatter.getShipmentStatusName(od.shipment.status)}}</div>
                <div class="shipment-info">
                  {{ formatter.getCourierCompanyName(od.shipment.courierCompany) }}<br>
                  {{ od.shipment.trackingNumber }} <!-- TODO: 링크 작성-->
                </div>
              </div>

              <div v-if="state.isReviewable" class="product-review">
                <button type="button" v-if="od.review" class="button btn-edit-review" @click="editReview(od.review.id)">리뷰 수정</button>
                <button type="button" v-else class="button btn-write-review" @click="writeReview(od.id)">리뷰 작성</button>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="pricing-summary">
        상품 합계 {{ formatter.getFormattedNumber(calculateOrderTotalPrice(state.order.orderDetails)) }}원<br>
        배송비 {{ formatter.getFormattedNumber(calculateShipmentPrice(state.order)) }}원<br>
        합계 {{ formatter.getFormattedNumber(state.order.paymentAmount) }}원
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import formatter from "@/scripts/formatter";
import {useRoute} from "vue-router";
import router from "@/scripts/router";

export default {
  name: 'OrderDetail',
  components: {},
  setup() {
    const route = useRoute();
    const orderId = route.params.id;
    const state = reactive({
      order: {},
      isReviewable: false,
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

    const canWriteReview = (status) => {
      // 주문 상태가 '결제 완료', '취소 요청', '취소 완료'인 경우에, 리뷰를 작성할 수 있음
      const reviewableStatuses = ['PAYMENT_COMPLETED', 'CANCEL_REQUESTED', 'CANCEL_COMPLETED'];
      return reviewableStatuses.includes(status);
    };

    const writeReview = (orderDetailId) => {
      router.push({name: 'WriteReview', params: {orderId: orderId, orderDetailId: orderDetailId}});
    };

    const editReview = (reviewId) => {
      router.push({name: 'EditReview', params: {orderId: orderId, reviewId: reviewId}});
    };

    const load = () => {
      axios.get(`/api/order/detail/${orderId}`).then(({data}) => {
        state.order = data;
        state.isReviewable = canWriteReview(data.status);
      });
    }

    onMounted(load);

    return {
      formatter,
      state,
      calculateItemTotalPrice , calculateOrderTotalPrice, calculateShipmentPrice,
      writeReview, editReview,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-detail";
</style>
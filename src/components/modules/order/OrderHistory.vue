<template>
  <div class="order-history">
    <div class="title">주문 이력</div>

    <div class="content" v-if="state.orders.length>0">
      <ul>
        <li v-for="(order, idx) in state.orders" :key="idx">
          <div class="order">
            <div class="order-image">
              <router-link :to="{ name: 'ProductDetail', params: { id: order.orderDetails[0].product.id }}">
                <img :src="`${order.orderDetails[0].product.productImages[0].fileUrl}`" />
              </router-link>
            </div>

            <div class="order-details">
              <router-link :to="{ name: 'OrderDetailForCustomer', params: { id: order.id }}">
                주문 상세
              </router-link>
              <br><br>
              주문 상태 : {{ formatter.getOrderStatusName(order.status) }}
              <span v-if="order.status === 'PAYMENT_PENDING'">
                ({{ getDepositDeadline(order.regDate) }}까지 입금)
                <i class="bi bi-box-arrow-up-right" @click="openDirectDepositAnnounceModal(state.regDate)"></i>
                <DirectDepositAnnounceModal v-if="state.directDepositAnnounceModal.show"
                                            :show="state.directDepositAnnounceModal.show"
                                            :deadline="state.directDepositAnnounceModal.deadline"
                                            @close=closeDirectDepositAnnounceModal />
              </span><br>
              주문 번호 : {{ order.orderNumber }}<br>
              구매 상품 : {{ order.orderDetails[0].product.name }} 포함 총 {{ getTotalQuantity(order.orderDetails) }}건<br>
              구매 금액 : {{ formatter.getFormattedNumber(order.paymentAmount) }}원<br>
              주문 날짜 : {{ formatter.getFormattedDate(order.regDate, 'YYYY-MM-DD HH:mm') }}<br>
              반품 기간 : {{ getReturnDate(order.regDate) }}까지<br>
            </div>

            <div class="action-buttons">
              <div v-if="isReviewable(order.status)">
                <button type="button" class="button btn-edit-review" @click="editReview(order.review.id)" v-if="order.review">리뷰 수정</button>
                <button type="button" class="button btn-write-review" @click="writeReview(order.id)" v-else>리뷰 작성</button>
              </div>
              <button type="button" class="button btn-order-cancel" @click="cancelOrder(order.id)" :disabled="!isCancelable(order.status)">주문 취소</button>
            </div>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <button type="button" @click="goToPage(1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-double-left"></i></button>
        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-left"></i></button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-right"></i></button>
        <button type="button" @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-double-right"></i></button>
      </div>
    </div>
    <div class="content no-order-data" v-else>주문 이력이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import dayjs from 'dayjs';
import axios from "axios";
import formatter from "@/scripts/formatter";
import router from "@/scripts/router";
import DirectDepositAnnounceModal from "@/components/modules/order/OrderDirectDepositAnnounceModal.vue";

export default {
  name: 'OrderHistory',
  components: {DirectDepositAnnounceModal},
  setup() {
    const tableHeaders = ['주문 번호', '수령인', '배송 주소', '결제 수단', '결제 금액', '구입 항목', '주문 상태', '주문 날짜'];

    const state = reactive({
      orders: [],
      page: {pageSize: 3, currentPage: 1, totalPages: 0},
      directDepositAnnounceModal: { show: false, deadline: ''}
    });

    const openDirectDepositAnnounceModal = (regDate) => {
      state.directDepositAnnounceModal.deadline = getDepositDeadline(regDate);
      state.directDepositAnnounceModal.show = true;
    };

    const closeDirectDepositAnnounceModal = () => {
      state.directDepositAnnounceModal.deadline = '';
      state.directDepositAnnounceModal.show = false;
    };

    const writeReview = (orderId) => {
      router.push({name: 'WriteReview', params: {orderId: orderId}});
    };

    const editReview = (reviewId) => {
      router.push({name: 'EditReview', params: {reviewId: reviewId}});
    };

    const isReviewable = (status) => {
      // 주문 상태가 '결제 완료', '취소 요청', '취소 완료'인 경우에, 리뷰를 작성할 수 있음
      const reviewableStatuses = ['PAYMENT_COMPLETED', 'CANCEL_REQUESTED', 'CANCEL_COMPLETED'];
      return reviewableStatuses.includes(status);
    };

    const isCancelable = (status) => {
      // 주문 상태가 '결제 대기', '결제 완료'인 경우에, 주문을 취소할 수 있음
      const cancelableStatuses  = ['PAYMENT_PENDING', 'PAYMENT_COMPLETED'];
      return cancelableStatuses .includes(status);
    };

    /** 페이지 변경 */
    const goToPage = (page) => {
      state.page.currentPage = page;
      load();
    };

    /** 페이지 로드 */
    const load = () => {
      axios.get("/api/order/history?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize).then(({data}) => {
        state.orders = data.orders;
        state.page.totalPages = data.totalPages;
      });
    }

    const getTotalQuantity = (orderDetails) => {
      return orderDetails.reduce((sum, detail) => sum + detail.quantity, 0);
    };

    const getDepositDeadline = (date) => {
      return dayjs(date).add(24, 'hours').format('YYYY-MM-DD HH:mm');
    };

    const getReturnDate = (date) => {
      return dayjs(date).add(7, 'days').format('YYYY-MM-DD');
    };

    const cancelOrder = (orderId) => {
      if (window.confirm('주문을 취소하시겠습니까?')) {
        axios.post(`/api/order/cancel/${orderId}`).then(({data}) => {
          window.alert(data);
          window.location.reload();
        });
      }
    };

    onMounted(load);

    return {
      formatter,
      state, tableHeaders,
      openDirectDepositAnnounceModal, closeDirectDepositAnnounceModal,
      writeReview, editReview,
      isReviewable, isCancelable, goToPage,
      getTotalQuantity, getDepositDeadline, getReturnDate,
      cancelOrder
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/order/order-history";
</style>
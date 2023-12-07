<template>
  <div class="order-history">
    <div class="title">주문 이력</div>

    <div class="content" v-if="state.orders.length>0">
      <ul>
        <li v-for="(order, idx) in state.orders" :key="idx">
          <div class="order">
            <div class="order-image">
              <router-link :to="{ name: 'ProductDetail', params: { id: order.orderDetails[0].product.id }}">
                <img :src="`${order.orderDetails[0].product.productImages[0].filePath}${order.orderDetails[0].product.productImages[0].fileName}`" />
              </router-link>
            </div>

            <div class="order-details">
              <router-link :to="{ name: 'OrderDetailForCustomer', params: { id: order.id }}">
                주문 상세
              </router-link>
              <br><br>
              주문 상태 : {{ lib.getOrderStatusName(order.status) }}<br>
              주문 번호 : {{ order.orderNumber }}<br>
              구매 상품 : {{ order.orderDetails[0].product.name }} 포함 총 {{ getTotalQuantity(order.orderDetails) }}건<br>
              구매 금액 : {{ lib.getFormattedNumber(order.paymentAmount) }}원<br>
              주문 날짜 : {{ lib.getFormattedDate(order.regDate, 'YYYY-MM-DD HH:mm') }}<br>
              반품 기간 : {{ getReturnDate(order.regDate) }}까지<br>
            </div>

            <div class="action-buttons">
              <button class="button btn-edit-review" @click="editReview(order.review.id)" v-if="order.review">리뷰 수정
              </button>
              <button class="button btn-write-review" @click="writeReview(order.id)" v-else>리뷰 작성</button>
              <button class="button btn-order-confirm" @click="confirmOrder(order.id)"
                      :disabled="!isConfirmable(order.status)">주문 확정
              </button>
              <button class="button btn-order-cancel" @click="cancelOrder(order.id)"
                      :disabled="!isCancelable(order.status)">주문 취소
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <button @click="goToPage(1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-double-left"></i>
        </button>
        <button @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i
            class="bi bi-chevron-left"></i></button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button @click="goToPage(state.page.currentPage + 1)"
                :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-right"></i>
        </button>
        <button @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages"><i
            class="bi bi-chevron-double-right"></i></button>
      </div>
    </div>
    <div v-else>주문 이력이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import router from "@/scripts/router";
import dayjs from 'dayjs';

export default {
  name: 'OrderHistory',
  setup() {
    const tableHeaders = ['주문 번호', '수령인', '배송 주소', '결제 수단', '결제 금액', '구입 항목', '주문 상태', '주문 날짜'];

    const state = reactive({
      orders: [],
      page: {pageSize: 3, currentPage: 1, totalPages: 0},
    });

    const writeReview = (orderId) => {
      router.push({name: 'WriteReview', params: {orderId: orderId}});
    };

    const editReview = (reviewId) => {
      router.push({name: 'EditReview', params: {reviewId: reviewId}});
    };

    const isConfirmable = (status) => {
      // 주문 상태가 '주문 접수', '주문 확인', '배송 준비' 인 경우, 주문을 확정할 수 있음
      return status === 'ORDER_RECEIVED' || status === 'ORDER_CONFIRMED' || status === 'SHIPMENT_PREPARING';
    };

    const isCancelable = (status) => {
      // 주문 상태가 '주문 접수', '주문 확인' 인 경우, 주문을 취소할 수 있음
      return status === 'ORDER_RECEIVED' || status === 'ORDER_CONFIRMED';
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
    //
    // const getTotalPrice = (orderDetails) => {
    //   return orderDetails.reduce((sum, detail) => sum + detail.unitPrice, 0);
    // };

    const getReturnDate = (date) => {
      return dayjs(date).add(7, 'days').format('YYYY-MM-DD');
    };

    const confirmOrder = (orderId) => {
      if (window.confirm('주문을 확정하시겠습니까?')) {
        axios.post(`/api/order/confirm/${orderId}`).then(({data}) => {
          window.alert(data);
          window.location.reload();
        });
      }
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
      lib,
      state, tableHeaders,
      writeReview, editReview,
      isConfirmable, isCancelable, goToPage,
      getTotalQuantity, getReturnDate,
      confirmOrder, cancelOrder
    }
  }
}
</script>

<style scoped>
.order-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-inline: auto;
  max-width: 800px;
}

.title {
  display: flex; /* Flexbox 적용 */
  align-items: center; /* 수직 중앙 정렬 */
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.order {
  font-size: 12px;
  display: flex; /* Flexbox 적용 */
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: space-between;
  width: 100%;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  display: flex;
  border-bottom: 1px solid #eee;
}

ul li img {
  width: 150px;
  height: 180px;
}

.order-image {
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px 10px 20px;
}

.order-details {
  flex-grow: 1;
}

.action-buttons {
  align-items: center; /* 아이콘들을 수직 중앙에 위치시킵니다. */
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px 10px 20px;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  width: 100px;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
}

.btn-write-review {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: 2.3rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.btn-edit-review {
  border-color: black;
  color: black;
  height: 2.3rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.btn-order-confirm {
  background-color: transparent;
  border-color: rgb(0, 0, 0);
  height: 1.7rem;
  margin-bottom: 4px;
}

.btn-order-cancel {
  background-color: transparent;
  border-color: rgb(0, 0, 0);
  height: 1.7rem;
}

.pagination {
  font-size: 12px;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.pagination button {
  border: none;
  background-color: transparent;
}
</style>
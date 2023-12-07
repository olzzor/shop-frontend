<template>
  <div class="coupon-list">
    <div class="title">내 쿠폰</div>

    <div class="content" v-if="state.coupons.length>0">
      <ul class="coupons">
        <li v-for="c in state.coupons" :key="c.id">
          <div class="coupon-header">
            <span>[{{ lib.getCouponTypeName(c.type) }}] {{ c.name }}</span>
          </div>

          <div class="coupon-details">
            기간:
            {{ lib.getFormattedDate(c.startValidDate, 'YYYY-MM-DD') }} ~ {{ lib.getFormattedDate(c.endValidDate, 'YYYY-MM-DD') }}<br>
            최소 이용 금액: {{ lib.getFormattedNumber(c.minAmount) }}원<br>
            <span v-if="c.discountType === 'AMOUNT_DISCOUNT'">할인 금액: {{ c.discountValue }}원<br></span>
            <span v-else>할인율: {{ c.discountValue }}%<br></span>
            <span v-if="c.categories.length > 0">대상 카테고리: {{ getCategoryNames(c.categories) }}<br></span>
            <span v-if="c.categories.products > 0">대상 상품: {{ getProductNames(c.products) }}<br></span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>사용 가능한 쿠폰이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  name: 'CouponList',
  setup() {
    const state = reactive({
      coupons: [],
    });

    const getCategoryNames = (categories) => {
      return categories.map(category => lib.getCategoryName(category.code)).join(', ');
    };

    const getProductNames = (products) => {
      return products.map(product => product.name).join(', ');
    };

    const load = () => {
      axios.get("/api/coupon/list/available/user").then(({data}) => {
        state.coupons = data;
      });
    };

    onMounted(load);

    return {
      lib,
      state,
      getCategoryNames,getProductNames
    }
  }
}
</script>

<style scoped>
.coupon-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}

.title {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: .75rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.coupons li {
  border: 1px solid #ccc; /* 선의 색상과 두께 조절 */
  border-radius: 5px; /* Optional: for rounded corners */
  padding: 10px 20px; /* 선과 내용 사이의 간격 조절 */
  margin-bottom: 10px; /* 아래 요소와의 간격 조절 */
}

.coupon-header {
  display: flex;
  justify-content: space-between; /* 버튼들을 좌우로 정렬 */
  width: 100%; /* 컨테이너의 너비를 최대로 설정 */
  margin-top: 10px; /* 버튼 컨테이너와 그 위의 요소와의 간격 설정 */
}

.coupon-header span {
  font-size: 1.2em; /* 글자 크기 변경 */
  font-weight: bold; /* 글자 굵기 변경 */
}

.coupon-details {
  margin-block: 5px; /* 버튼 컨테이너와 그 위의 요소와의 간격 설정 */
}

</style>
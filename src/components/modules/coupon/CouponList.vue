<template>
  <div class="coupon-list">
    <div class="title">내 쿠폰</div>

    <div class="content" v-if="state.coupons.length>0">
      <ul class="coupons">
        <li v-for="c in state.coupons" :key="c.id">
          <div class="coupon-header">
            <span>[{{ formatter.getCouponTypeName(c.type) }}] {{ c.name }}</span>
          </div>

          <div class="coupon-details">
            기간:
            {{ formatter.getFormattedDate(c.startValidDate, 'YYYY-MM-DD') }} ~ {{ formatter.getFormattedDate(c.endValidDate, 'YYYY-MM-DD') }}<br>
            최소 이용 금액: {{ formatter.getFormattedNumber(c.minAmount) }}원<br>
            <span v-if="c.discountType === 'AMOUNT_DISCOUNT'">할인 금액: {{ c.discountValue }}원<br></span>
            <span v-else>할인율: {{ c.discountValue }}%<br></span>
            <span v-if="c.categories.length > 0">대상 카테고리: {{ getCategoryNames(c.categories) }}<br></span>
            <span v-if="c.categories.products > 0">대상 상품: {{ getProductNames(c.products) }}<br></span>
          </div>
        </li>
      </ul>
    </div>
    <div class="content no-coupon-data" v-else>사용 가능한 쿠폰이 없습니다.</div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import formatter from "@/scripts/formatter";

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
      formatter,
      state,
      getCategoryNames,getProductNames
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/coupon/coupon-list";
</style>
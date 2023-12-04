<template>
  <div class="order-summary">
    <div class="title"></div>

    <div class="content">
      <div>
        <div class="total-product-amount">
          <span class="label">총 상품 금액</span>
          <span class="price">{{ lib.getFormattedNumber(computedPrice) }}원</span>
        </div>
        <div class="total-discount-amount">
          <span class="label">총 할인 금액</span>
          <span class="price">- {{ lib.getFormattedNumber(computedDiscountPrice) }}원</span>
        </div>
        <div class="delivery-fee">
          <span class="label">배송비</span>
          <span class="price">3,000원</span>
        </div>
        <div class="final-payment-amount">
          <span class="label">총 결제 금액</span>
          <span class="price">{{ lib.getFormattedNumber(totalPrice) }}원</span>
        </div>
      </div>

      <div v-for="cp in state.cartProducts" :key="cp">
        <div class="product-image">
          <img :src="`${cp.product.productImages[0].filePath}${cp.product.productImages[0].fileName}`" class="item-image"/>
        </div>
        <div class="product-name">
          <span class="item-name">{{ cp.product.name }}</span>
        </div>

        <div class="coupon-list">
          <label for="coupon-select">사용 가능한 쿠폰</label>
          <select :id="'coupon-select-' + cp.id" v-model="cp.selectedCoupon">
            <option v-for="coupon in cp.availableCoupons" :key="coupon.id" :value="coupon.id">
              {{ coupon.name }}
            </option>
          </select>
        </div>

        <span class="item-price">
        {{ lib.getFormattedNumber(cp.product.price) }}원
      </span>

        <span class="item-discount-price">
        -{{ lib.getFormattedNumber(getDiscountPrice(cp)) }}원
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, reactive} from "vue";
import lib from "@/scripts/lib";
import axios from "axios";

export default {
  name: "OrderSummary",
  props: {
    productId: {type: String, required: false, default: null}
  },
  setup(props, {emit}) {
    const state = reactive({
      cartProducts: [],
    })

    const load = () => {
      axios.get("/api/cart/get", {params: {id: props.productId}}).then(({data}) => {
        state.cartProducts = data.map(cp => {
          cp.selectedCoupon = null;
          cp.availableCoupons = []; // 각 상품마다 사용 가능한 쿠폰 목록
          return cp;
        });

        emit('update-price', totalPrice.value);

        const payload = data.map(d => {
          return {
            cartProductId: d.id,                 // 카트 상품 ID
            productId: d.product.id,             // 상품 ID
            categoryCode: d.product.category     // 카테고리 코드
          };
        });

        axios.post("/api/coupon/list/available", payload).then(({data}) => {
          state.cartProducts.forEach(cp => {
            cp.availableCoupons = data.find(d => d.cartProductId === cp.id).coupons;
          });
        });
      });
    }

    const getDiscountPrice = (cartProduct) => {

      // 선택된 쿠폰이 없는 경우
      if (!cartProduct.selectedCoupon) {
        return 0;
      }

      // 선택 쿠폰 객체 취득
      const coupon = cartProduct.availableCoupons.find(ac => ac.id === cartProduct.selectedCoupon);

      // 쿠폰의 적용 대상 카테고리가 존재하는 경우
      if (coupon.categories && coupon.categories.length > 0) {
        // 대상 카테고리의 코드를 취득 (TODO id로 변경할 것)
        const categoryCodes = coupon.categories.map(category => category.code);

        // 현재 상품의 카테고리가 쿠폰 적용 카테고리에 해당하지 않는 경우
        if (!categoryCodes.includes(cartProduct.product.category)) {
          return 0;
        }

        // 쿠폰의 할인 타입에 따라 할인 금액 계산
        if (coupon.discountType === "AMOUNT_DISCOUNT") {
          return coupon.discountValue;

        } else if (coupon.discountType === "PERCENTAGE_DISCOUNT") {
          return cartProduct.product.price * (coupon.discountValue / 100);
        }
      }
      return 0;
    }

    const computedPrice = computed(() => {
      let result = 0;
      for (let cp of state.cartProducts) {
        result += cp.product.price - cp.product.price * cp.product.discountPer / 100;
      }
      return result;
    })

    const totalPrice = computed(() => {
      return computedPrice.value + 3000;
    })

    const computedDiscountPrice = computed(() => {
      let discount = 0;
      for (let cp of state.cartProducts) {
        discount += getDiscountPrice(cp);
      }
      return discount;
    });

    load();

    return {
      lib,
      state,
      computedPrice, totalPrice, computedDiscountPrice,
      getDiscountPrice,
    }
  }
}
</script>

<style scoped>

.content {
  padding: 0 0 0 10px;
}

.product-image {
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px;
}

.product-image img {
  width: 150px;
  height: 180px;
}

.total-product-amount, .total-discount-amount, .delivery-fee, .final-payment-amount {
  font-size: .9rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.label {
  background-color: #000; /* 검정 배경 */
  color: #FFF; /* 하얀 글씨 */
  padding: 6px;
}

.price {
  text-align: right;
  margin-bottom: 8px;
}
</style>
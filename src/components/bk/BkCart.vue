<template>
  <div class="cart">
    <div class="title">
      장바구니
    </div>

    <div class="content">
      <div v-if="state.cartProducts.length > 0">
        <ul>
          <li v-for="(cp, idx) in state.cartProducts" :key="idx">

            <div class="cart-product">
              <div class="product-image">
                <router-link :to="{ name: 'ProductDetail', params: { id: cp.product.id }}">
                  <img :src="`${cp.product.productImages[0].filePath}${cp.product.productImages[0].fileName}`"/>
                </router-link>
              </div>

              <div class="product-details">
                <div class="details-wrapper">
                  <div class="product-title-row">
                    <div class="title-container">
                      {{ cp.product.name }}
                    </div>
                    <div class="discount-container" v-if="cp.product.discountPer">
                      <span>{{ cp.product.discountPer }}%</span><i class="bi bi-arrow-down"></i>
                    </div>
                  </div>

                  <div class="product-price-row">
                    <div class="price-container">
                      <small class="original-price" :class="{ 'sale': cp.product.discountPer }">{{ lib.getFormattedNumber(cp.product.price) }}원</small>
                      <small class="discounted-price" v-if="cp.product.discountPer"> {{ lib.getFormattedNumber(getDiscountedPrice(cp)) }}원</small>
                    </div>
                  </div>
                </div>

                <div class="trash-icon-wrapper">
                  <i class="fa fa-trash" @click="removeItem(cp.product.id)"></i>
                </div>
              </div>

              <div class="product-subtotal">
                <div class="subtotal-quantity-container">
                  <label>수량</label>
                  <div class="label-content">
                    <select class="select-field" v-model="cp.quantity" @change="updateQuantity(cp)">
                      <option v-for="quantity in quantities" :key="quantity" :value="quantity">
                        {{ quantity }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="subtotal-coupon-container">
                  <label>쿠폰</label>
                  <div class="label-content">
                    <select class="select-field" v-model="cp.selectedCoupon" @change="updateCoupon(cp)">
                      <option v-for="ac in cp.availableCoupons" :key="ac.id" :value="ac.id">
                        {{ ac.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="subtotal-price-container">
                  <label>소계</label>
                  <div class="label-content">
                    <span>{{ lib.getFormattedNumber(calculateSubtotal(cp)) }}원</span><br>
                    <small v-if="getCouponDiscountAmount(cp) > 0" class="discount-text">(할인 금액 <span class="amount">{{ lib.getFormattedNumber(getCouponDiscountAmount(cp)) }}원</span>)</small>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <div class="cart-summary">
            <div> 총 {{ totalQuantity }}건</div>
            <div> 합계 {{ lib.getFormattedNumber(totalAmount) }}원</div>
          </div>
        </ul>

        <button class="button btn-checkout" type="button" @click="checkout" :disabled="state.cartProducts.length === 0">주문하기</button>
      </div>

      <div v-else>
        <p>장바구니가 비어있습니다.</p>
      </div>

    </div>
  </div>
</template>

<script>
import {computed, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import router from "@/scripts/router";

export default {
  name: 'Cart',
  setup() {
    const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const state = reactive({
      cartProducts: [],
      form: {productId: 0, quantity: 0},
    })

    const getDiscountedPrice = (cartProduct) => {
      const originPrice = cartProduct.product.price;
      let discountedPrice = originPrice;

      // discountPer 가 있으면 할인을 적용
      if (cartProduct.product.discountPer) {
        discountedPrice = originPrice - (originPrice * cartProduct.product.discountPer / 100);
      }

      return discountedPrice;
    }

    const getCouponDiscountAmount = (cartProduct) => {
      if (!cartProduct.selectedCoupon) {
        return 0;
      }

      // 선택 쿠폰 객체 취득
      const coupon = cartProduct.availableCoupons.find(ac => ac.id === cartProduct.selectedCoupon);

      let discountPrice = 0;

      if (coupon) { // 추가
        if (coupon.discountType === "AMOUNT_DISCOUNT") {
          discountPrice = coupon.discountValue;
        } else if (coupon.discountType === "PERCENTAGE_DISCOUNT") {
          discountPrice = cartProduct.product.price * (coupon.discountValue / 100);
        }
      }

      return discountPrice * cartProduct.quantity;
    }

    const calculateSubtotal = (cartProduct) => {
      const productTotal = getDiscountedPrice(cartProduct) * cartProduct.quantity;
      return productTotal - getCouponDiscountAmount(cartProduct);
    }

    const totalQuantity = computed(() => {
      return state.cartProducts.reduce((sum, cp) => {
        return sum + cp.quantity;
      }, 0);
    });

    const totalAmount = computed(() => {
      return state.cartProducts.reduce((sum, cp) => {
        return sum + calculateSubtotal(cp);
      }, 0);
    });

    const load = () => {
      axios.get("/api/cart/get").then(({data}) => {
        state.cartProducts = data.map(cp => {
          cp.selectedCoupon = cp.coupon ? cp.coupon.id : null;
          cp.availableCoupons = []; // 각 상품마다 사용 가능한 쿠폰 목록
          return cp;
        });

        const payload = data.map(d => {
          return {
            cartProductId: d.id,                    // 카트 상품 ID
            productId: d.product.id,                // 상품 ID
            categoryId: d.product.category.id   // 카테고리 코드
          };
        });

        axios.post("/api/coupon/list/available", payload).then(({data}) => {
          state.cartProducts.forEach(cp => {
            cp.availableCoupons = data.find(d => d.cartProductId === cp.id).coupons;
          });
        });
      });
    };

    const updateQuantity = (cartProduct) => {
      state.form.productId = cartProduct.product.id;
      state.form.quantity = cartProduct.quantity;

      axios.post(`/api/cart/update/quantity`, state.form).then(() => {
      })
    }

    const updateCoupon = (cartProduct) => {
      const payload = {
        id: cartProduct.id,
        couponId: cartProduct.selectedCoupon,
      };

      axios.post(`/api/cart/update/coupon`, payload).then(() => {
      })
    }

    const removeItem = (id) => {
      axios.delete(`/api/cart/delete/${id}`).then(() => {
        load();
      })
    }

    const checkout = () => {
      router.push('/order');
    }

    load();

    return {
      lib,
      state, quantities,
      totalQuantity, totalAmount,
      getDiscountedPrice, getCouponDiscountAmount, calculateSubtotal, updateQuantity, updateCoupon,
      removeItem, checkout,
    }
  }
}
</script>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
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

.cart-product {
  display: flex; /* Flexbox 적용 */
  align-items: flex-start; /* 상단 정렬 */
  justify-content: space-between;
  width: 100%;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  margin: 10px 20px; /* 이 부분은 선택 사항으로, 패딩을 추가하여 레이아웃을 조금 더 깔끔하게 만듭니다. */
}

.product-image {
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px;
}

.product-details {
  flex-grow: 1; /* 가능한 모든 여유 공간을 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  margin-block: 30px;
  justify-content: space-between;
}

.product-subtotal {
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  display: flex;
  flex-direction: column;
  margin: 30px 20px;
  width: 200px;
}

.details-wrapper {
  justify-content: flex-start;
}

.trash-icon-wrapper {
  justify-content: flex-end;
}

.product-title-row {
  display: flex; /* Use flexbox for the title row */
  align-items: center; /* Vertically center align items */
  font-size: 0.9rem;
  font-weight: bold;
}

.title-container, .discount-container {
  display: flex;
  align-items: center;
}

.title-container {
  display: inline-block;
  white-space: nowrap;
}

.discount-container {
  margin-left: 0.2rem;
  color: #dc3545;
}

.product-price-row {
  font-size: 0.9rem;
}

.price-container {
  display: flex; /* Use flexbox for the price container */
  align-items: center;
  gap: 0.25rem;
}

.original-price {
  color: darkgray;
}

.original-price.sale {
  text-decoration: line-through;
}

.discounted-price {
  color: #dc3545;
}

.subtotal-quantity-container, .subtotal-coupon-container, .subtotal-price-container {
  display: flex;
  flex-direction: row;
}

label {
  flex: 0 0 45px; /* 라벨의 너비를 50px로 고정 */
}

.label-content {
  flex-grow: 1; /* 콘텐츠가 나머지 공간을 모두 차지하도록 설정 */
}

.select-field {
  border-color: darkgray; /* 회색 테두리 적용 */
  border-radius: 4px; /* 모서리 둥글게 처리 */
  flex-grow: 1; /* 셀렉트 박스가 나머지 공간을 모두 차지하도록 설정 */
  width: 100%; /* 셀렉트 박스의 너비를 100%로 설정 */
}
.discount-text {
  color: darkgray; /* 회색으로 설정 */
}

.discount-text .amount {
  color: black; /* 검정으로 설정 */
}
.bi {
  vertical-align: middle;
  margin: 0;
  padding: 0;
  font-size: 24px;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 100%;
  margin-block: 10px;
  border-radius: 5px;
  border: none; /* 테두리 제거 */
}

.btn-checkout {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  margin-inline: auto;
  display: block; /* block으로 설정하여 width를 제어합니다. */
  width: 50%;
}
</style>
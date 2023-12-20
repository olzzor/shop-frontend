<template>
  <div class="cart">
    <div class="title">
      장바구니
    </div>

    <div class="content">
      <div v-if="state.cartProducts.length > 0">
        <div class="product-list">
          <div class="product-info">
            <ul>
              <li v-for="(cp, idx) in state.cartProducts" :key="idx">
                <div class="cart-product">
                  <div class="product-image">
                    <router-link :to="{ name: 'ProductDetail', params: { id: cp.product.id }}">
                      <img :src="`${cp.product.productImages[0].fileUrl}`" />
                      <div v-if="cp.product.status !== 'ON_SALE'" class="not-in-stock-overlay">
                        <div class="not-in-stock">NOT IN STOCK</div>
                      </div>
                    </router-link>
                  </div>

                  <div class="product-details">
                    <div class="details-wrapper">
                      <div class="product-title-row">
                        <div class="title-container">
                          {{ cp.product.name }}
                        </div>
                        <div class="discount-container" v-if="cp.product.discountPer">
                          <span>{{ cp.product.discountPer }}%</span>↓
                        </div>
                      </div>

                      <div class="product-size-row">
                        <div class="size-container">
                          <small>{{ cp.productSize.size }}</small>
                        </div>
                      </div>

                      <div class="product-price-row">
                        <div class="price-container">
                          <small class="original-price"
                                 :class="{ 'sale': cp.product.discountPer }">{{ lib.getFormattedNumber(cp.product.price) }}원</small>
                          <small class="discounted-price"
                                 v-if="cp.product.discountPer"> {{ lib.getFormattedNumber(price.getDiscountedPrice(cp.product)) }}원</small>
                        </div>
                      </div>
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
                        <span>{{ lib.getFormattedNumber(price.getFinalDiscountedPrice(cp) * cp.quantity) }}원</span><br>
                        <small v-if="price.getFinalDiscountPrice(cp) > 0" class="discount-text">
                          (할인 금액 <span class="amount">{{ lib.getFormattedNumber(price.getFinalDiscountPrice(cp) * cp.quantity) }}원</span>)
                        </small>
                      </div>
                    </div>

                    <div class="action-icons">
                      <i class="bi bi-heart-fill" v-if="cp.favoriteInfo.favorite"  @click="removeFavorite(cp.favoriteInfo.id)" :disabled="state.isSubmitting"></i>
                      <i class="bi bi-heart" v-else @click="addFavorite(cp.productSize.id)" :disabled="state.isSubmitting"></i>
                      <i class="bi bi-trash3" @click="removeFromCart(cp.id)" :disabled="state.isSubmitting"></i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="alert-message">
             <p v-if="hasUnavailableProducts">주문 불가능한 상품이 존재합니다.</p>
            </div>
          </div>

          <div class="price-summary">
            <PriceSummary :cartProducts="state.cartProducts" />
          </div>
        </div>

        <div class="actions">
          <button class="button btn-checkout" type="button" @click="checkout"
                  :disabled="state.cartProducts.length === 0">주문하기
          </button>
        </div>
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
import store from "@/scripts/store";
import router from "@/scripts/router";
import price from "@/scripts/price";
import PriceSummary from "@/components/modules/order/OrderPriceSummary.vue";

export default {
  name: 'Cart',
  components: {PriceSummary},
  setup() {
    const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const state = reactive({
      isSubmitting: false,
      cartProducts: [],
      form: {productId: 0, quantity: 0},
    });

    // 장바구니에 판매 중이지 않은 상품이 있는지 확인
    const hasUnavailableProducts = computed(() => {
      return state.cartProducts.some(cp => cp.product.status !== 'ON_SALE');
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
            categoryId: d.product.category.id       // 카테고리 ID
          };
        });

        axios.post("/api/coupon/list/available", payload).then(({data}) => {
          state.cartProducts.forEach(cp => {
            cp.availableCoupons = data.find(d => d.cartProductId === cp.id).coupons;
          });
        });

        store.commit('setCartProducts', state.cartProducts);
      });
    };

    const updateQuantity = (cartProduct) => {
      state.form.productId = cartProduct.product.id;
      state.form.quantity = cartProduct.quantity;

      axios.post(`/api/cart/update/quantity`, state.form).then(() => {
      });
    };

    const updateCoupon = (cartProduct) => {
      const payload = {
        id: cartProduct.id,
        couponId: cartProduct.selectedCoupon,
      };

      axios.post(`/api/cart/update/coupon`, payload).then(() => {
      });
    };

    const addFavorite = (productSizeId) => {
      axios.post(`/api/favorite/add/${productSizeId}`).then(() => {
        load();

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              window.alert(error.response.data.message);
              break;
            case 404:
              window.alert(error.response.data.message);
              break;
            case 409:
              window.alert(error.response.data.message);
              break;
            default:
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
      });
    };

    const removeFavorite = (favoriteId) => {
      axios.delete(`/api/favorite/delete/${favoriteId}`).then(() => {
        load();
      })
    };

    const removeFromCart = (cartProductId) => {
      state.isSubmitting = true;

      axios.delete(`/api/cart/delete/${cartProductId}`).then(() => {
        load();

      }).finally(() => {
        state.isSubmitting = false;
      });
    };

    const checkout = () => {
      if (hasUnavailableProducts.value) {
        window.alert('주문 불가능한 상품이 존재합니다.');
      } else {
        router.push({name: 'Order', query: {cartProducts: state.cartProducts}});
      }
    };

    load();

    return {
      lib, price,
      state, quantities,
      hasUnavailableProducts,
      updateQuantity, updateCoupon,
      addFavorite, removeFavorite, removeFromCart, checkout,
    };
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
  max-width: 1000px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* 자식 요소들이 전체 너비를 차지하도록 설정 */
}

.product-list {
  display: flex; /* 새로 추가된 컨테이너에 flex 적용 */
}

.product-info {
  flex-grow: 1; /* 가능한 모든 여유 공간을 차지하도록 설정 */
  margin-right: 20px; /* price-summary와의 간격을 조정 */
}

.price-summary {
  width: 200px;
  flex-shrink: 0; /* 요약 부분의 크기가 줄어들지 않도록 설정 */
}

.actions {
  width: 100%; /* 전체 너비를 차지하게 설정 */
  text-align: center; /* 버튼을 중앙에 배치 */
  margin-top: 20px; /* 상단 간격 추가 */
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

.product-details {
  flex-grow: 1; /* 가능한 모든 여유 공간을 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-block: 30px;
}

.details-wrapper {
  justify-content: flex-start;
}

.product-subtotal {
  display: flex;
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  flex-direction: column;
  width: 170px;
  height: 100%;
  padding-block: 30px;
  margin-inline: 20px;
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
  white-space: normal; /* 자동으로 줄바꿈 */
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

.action-icons {
  align-self: flex-end; /* 오른쪽 정렬 */
  margin-top: auto;
  display: flex; /* 아이콘들을 수평으로 배치 */
  gap: 10px; /* 아이콘 간 간격 */
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
}

.product-image {
  position: relative;
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px;
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

.not-in-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* 오버레이가 이미지와 같은 너비를 가지도록 설정 */
  height: 100%; /* 오버레이가 이미지와 같은 높이를 가지도록 설정 */
  background: rgba(0, 0, 0, 0.4); /* 반투명 배경 적용 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.not-in-stock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
  color: white;
  font-size: .85rem;
  padding: 5px 8px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 130px;
  text-align: center;
  z-index: 2;
}

.alert-message {
  color: #dc3545;
  text-align: right;
  margin-top: 10px;
}
</style>
<template>
  <div class="cart">
    <div class="title">장바구니</div>

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
                        <span class="title-container">{{ cp.product.name }}</span>
                        <span class="discount-container" v-if="cp.product.discountPer">{{ cp.product.discountPer }}%↓</span>
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
                </div>

                <div class="product-subtotal">
                  <div class="subtotal-quantity-container">
                    <label>수량</label>
                    <div class="label-content">
                      <select class="select-field" v-model="cp.quantity" @change="updateQuantity(cp)">
                        <option v-for="quantity in 10" :key="quantity" :value="quantity"
                                :disabled="quantity > cp.productSize.quantity">
                          {{ quantity }}{{ quantity > cp.productSize.quantity ? ' (재고 없음)' : '' }}
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
              </li>
            </ul>

            <div class="alert-message">
              <p v-if="hasUnavailableProducts">주문 불가능한 상품이 존재합니다.</p>
              <p v-if="hasOverQuantityProducts">주문 수량이 재고를 초과하는 상품이 존재합니다.</p>
            </div>
          </div>

          <div class="price-summary">
            <PriceSummary />
          </div>
        </div>

        <div class="actions">
          <button type="button" class="button btn-checkout" @click="checkout" :disabled="state.cartProducts.length === 0">주문하기</button>
        </div>
      </div>

      <div class="content no-cart-data" v-else>장바구니가 비어있습니다.</div>

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
    const state = reactive({
      isSubmitting: false,
      cartProducts: [],
      form: {productId: 0, quantity: 0},
    });

    // 장바구니에 판매 중이지 않은 상품이 있는지 확인
    const hasUnavailableProducts = computed(() => {
      return state.cartProducts.some(cp => cp.product.status !== 'ON_SALE');
    });
    // 장바구니 상품의 수량이 판매가능한 재고인지 확인
    const hasOverQuantityProducts = computed(() => {
      return state.cartProducts.some(cp => cp.quantity > cp.productSize.quantity);
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
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
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
      let errorMessages = [];

      if (hasUnavailableProducts.value) {
        errorMessages.push('주문 불가능한 상품이 존재합니다.');
      }

      if (hasOverQuantityProducts.value) {
        errorMessages.push('주문 수량이 재고를 초과하는 상품이 존재합니다.');
      }

      if (errorMessages.length > 0) {
        window.alert(errorMessages.join("\n"));
      } else {
        router.push({name: 'Order'});
      }
    };

    load();

    return {
      lib, price,
      state, hasUnavailableProducts, hasOverQuantityProducts,
      updateQuantity, updateCoupon,
      addFavorite, removeFavorite, removeFromCart, checkout,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/cart/cart";
</style>
<template>
  <div class="wishlist">
    <div class="title">
      위시리스트
      <div class="wishlist-count">{{ state.wishlist.length }}</div>
    </div>

    <div class="content" v-if="state.wishlist.length > 0">
      <ul>
        <li v-for="(item, idx) in state.wishlist" :key="idx">
          <div class="wishlist-item">
            <div class="product-image">
              <router-link :to="{ name: 'ProductDetail', params: { id: item.product.id }}">
                <img :src="`${item.product.productImages[0].fileUrl}`" />
                <div class="not-in-stock-overlay" v-if="item.product.status !== 'ON_SALE'">
                  <div class="not-in-stock">NOT IN STOCK</div>
                </div>
              </router-link>
            </div>

            <div class="product-details">
              <div class="title-row">
                <span class="new-label" v-if="isNew(item.product.regDate)">NEW</span>
                <span class="discount-per" v-if="item.product.discountPer">{{ item.product.discountPer }}%↓</span>
                <span class="name">{{ item.product.name }}</span>
              </div>

              <div class="size-row">
                <div class="size-container">{{ item.productSize.size }}</div>
              </div>

              <div class="price-row">
                <div class="price-container">
                  <small class="original-price" :class="{ 'sale': item.product.discountPer }">{{ formatter.getFormattedNumber(item.product.price) }}원</small>
                  <small class="discounted-price" v-if="item.product.discountPer"> {{ formatter.getFormattedNumber(price.getDiscountedPrice(item.product)) }}원</small>
                </div>
              </div>
            </div>
          </div>

          <div class="action-icons">
            <i class="bi bi-bag" @click="addToCart(item.id)" :disabled="state.isSubmitting"></i>
            <i class="bi bi-trash3" @click="removeWishlist(item.id)" :disabled="state.isSubmitting"></i>
          </div>
        </li>
      </ul>

      <div class="action-buttons">
        <button type="button" class="btn-remove-all" @click="removeWishlistAll"
                :disabled="state.wishlist.length === 0 && state.isSubmitting">전체 삭제
        </button>
      </div>
    </div>

    <div class="content no-wishlist-data" v-else>위시리스트에 등록된 상품이 없습니다.</div>
  </div>
</template>

<script>
import {reactive} from "vue";
import dayjs from "dayjs";
import axios from "axios";
import formatter from "@/scripts/formatter";
import price from "@/scripts/price";

export default {
  name: 'Wishlist',
  components: {},
  setup() {
    const state = reactive({
      isSubmitting: false,
      wishlist: [],
    });

    const isNew = (regDate) => {
      const today = dayjs();
      const registeredDate = dayjs(regDate);
      return registeredDate.isAfter(today.subtract(7, 'days'));
    };

    const load = () => {
      axios.get("/api/wishlist/get").then(({data}) => {
        state.wishlist = data;

      }).catch(() => {
        window.alert('오류가 발생했습니다. 다시 시도해주세요.');
      });
    };

    const addToCart = (itemId) => {
      state.isSubmitting = true;

      axios.post(`/api/cart/add/by-wishlist/${itemId}`).then(() => {
        window.alert('카트에 추가되었습니다.');

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }

      }).finally(() => {
        state.isSubmitting = false;
      });
    };

    const removeWishlist = (itemId) => {
      state.isSubmitting = true;

      axios.delete(`/api/wishlist/delete/${itemId}`).then(() => {
        window.alert('상품이 위시리스트에서 삭제되었습니다.');
        load();

      }).catch(() => {
        window.alert('오류가 발생했습니다. 다시 시도해주세요.');

      }).finally(() => {
        state.isSubmitting = false;
      });
    }

    const removeWishlistAll = () => {
      state.isSubmitting = true;

      axios.delete('/api/wishlist/delete/all').then(() => {
        window.alert('상품이 위시리스트에서 삭제되었습니다.');
        load();

      }).catch(() => {
        window.alert('오류가 발생했습니다. 다시 시도해주세요.');

      }).finally(() => {
        state.isSubmitting = false;
      });
    }

    load();

    return {
      formatter, price,
      state,
      isNew,
      addToCart, removeWishlist, removeWishlistAll,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/wishlist/wishlist";
</style>
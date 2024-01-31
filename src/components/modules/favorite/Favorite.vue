<template>
  <div class="favorite">
    <div class="title">
      관심 상품
      <div class="count-favorites">{{ state.favorites.length }}</div>
    </div>

    <div class="content" v-if="state.favorites.length > 0">
      <ul>
        <li v-for="(f, idx) in state.favorites" :key="idx">
          <div class="favorite-product">
            <div class="product-image">
              <router-link :to="{ name: 'ProductDetail', params: { id: f.product.id }}">
                <img :src="`${f.product.productImages[0].fileUrl}`" />
                <div v-if="f.product.status !== 'ON_SALE'" class="not-in-stock-overlay">
                  <div class="not-in-stock">NOT IN STOCK</div>
                </div>
              </router-link>
            </div>

            <div class="product-details">
              <div class="product-title-row">
                <span class="title-container">{{ f.product.name }}</span>
                <span class="discount-container" v-if="f.product.discountPer">{{ f.product.discountPer }}%</span>
              </div>

              <div class="product-size-row">
                <div class="size-container">{{ f.productSize.size }}</div>
              </div>

              <div class="product-price-row">
                <div class="price-container">
                  <small class="original-price"
                         :class="{ 'sale': f.product.discountPer }">{{ lib.getFormattedNumber(f.product.price) }}원</small>
                  <small class="discounted-price"
                         v-if="f.product.discountPer"> {{ lib.getFormattedNumber(price.getDiscountedPrice(f.product)) }}원</small>
                </div>
              </div>
            </div>
          </div>

          <div class="action-icons">
            <i class="bi bi-bag" @click="addToCart(f.id)" :disabled="state.isSubmitting"></i>
            <i class="bi bi-trash3" @click="removeFavorite(f.id)" :disabled="state.isSubmitting"></i>
          </div>
        </li>
      </ul>

      <div class="action-buttons">
        <button class="btn-remove-all" type="button" @click="removeFavoriteAll"
                :disabled="state.favorites.length === 0 && state.isSubmitting">전체 삭제
        </button>
      </div>
    </div>

    <div class="content no-favorite-data" v-else>관심 상품이 없습니다.</div>

  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import price from "../../../scripts/price";

export default {
  name: 'Favorites',
  computed: {
    price() {
      return price
    }
  },
  components: {},
  setup() {
    const state = reactive({
      isSubmitting: false,
      favorites: [],
    })

    const load = () => {
      axios.get("/api/favorite/get").then(({data}) => {
        state.favorites = data;

      }).catch(() => {
        window.alert("오류가 발생했습니다. 다시 시도해주세요.");
      });
    };

    const addToCart = (favoriteId) => {
      state.isSubmitting = true;

      axios.post(`/api/cart/add/by-favorite/${favoriteId}`).then(() => {
        window.alert('장바구니에 추가되었습니다.');

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              window.alert(error.response.data.message);
              break;
            case 404:
              window.alert(error.response.data.message);
              break;
            default:
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        }

      }).finally(() => {
        state.isSubmitting = false;
      });
    };

    const removeFavorite = (favoriteId) => {
      state.isSubmitting = true;

      axios.delete(`/api/favorite/delete/${favoriteId}`).then(() => {
        window.alert('관심 상품이 삭제되었습니다.');
        load();

      }).catch(() => {
        window.alert("오류가 발생했습니다. 다시 시도해주세요.");

      }).finally(() => {
        state.isSubmitting = false;
      });
    }

    const removeFavoriteAll = () => {
      state.isSubmitting = true;

      axios.delete('/api/favorite/delete/all').then(() => {
        window.alert('관심 상품이 삭제되었습니다.');
        load();

      }).catch(() => {
        window.alert("오류가 발생했습니다. 다시 시도해주세요.");

      }).finally(() => {
        state.isSubmitting = false;
      });
    }

    load();

    return {
      lib,
      state,
      addToCart, removeFavorite, removeFavoriteAll,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/favorite/favorite";
</style>
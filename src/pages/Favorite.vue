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
                <img :src="`${f.product.productImages[0].filePath}${f.product.productImages[0].fileName}`" />
              </router-link>
            </div>

            <div class="product-details">
              <div class="product-title-row">
                <div class="title-container">
                  {{ f.product.name }}
                </div>
                <div class="discount-container" v-if="f.product.discountPer">
                  <span>{{ f.product.discountPer }}%</span>↓
                </div>
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

            <div class="action-icons">
              <i class="bi bi-bag" @click="addToCart(f.id)" :disabled="state.isSubmitting"></i>
              <i class="bi bi-trash3" @click="removeFavorite(f.id)" :disabled="state.isSubmitting"></i>
            </div>
          </div>
        </li>
      </ul>

      <button class="button btn-remove-all" type="button" @click="removeFavoriteAll"
              :disabled="state.favorites.length === 0 && state.isSubmitting">전체 삭제
      </button>
    </div>
    <div v-else>
      <p>관심 상품이 없습니다.</p>
    </div>

  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import price from "../scripts/price";

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

<style scoped>
.favorite {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}

.title {
  display: flex; /* Flexbox 적용 */
  align-items: center; /* 수직 중앙 정렬 */
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.count-favorites {
  display: inline-flex; /* 인라인 플렉스로 변경 */
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  width: 25px;
  height: 25px;
  margin-left: 10px;
  font-size: .75rem;
  font-weight: normal;
  color: #ffffff;
  background-color: #000;
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

ul li i {
  float: right;
  font-size: 20px;
  margin-top: 65px;
  margin-right: 50px;
}

.favorite-product {
  display: flex; /* Flexbox 적용 */
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: space-between;
  width: 100%;
}

.product-image {
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  margin: 10px 20px 10px 20px;
}

.product-details {
  flex-grow: 1; /* 가능한 모든 여유 공간을 차지하도록 설정 */
}

.action-icons {
  align-items: center; /* 아이콘들을 수직 중앙에 위치시킵니다. */
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  display: flex; /* 아이콘들을 수평으로 배치 */
  gap: 20px; /* 아이콘 간 간격 */
  margin: 10px 20px 10px 20px;
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
  color: #6c757d;
}

.original-price.sale {
  text-decoration: line-through;
}

.discounted-price {
  color: #dc3545;
}

.bi {
  vertical-align: middle;
  margin: 0;
  padding: 0;
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

.btn-remove-all {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}
</style>
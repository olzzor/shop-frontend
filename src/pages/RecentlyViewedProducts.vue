<template>
  <div class="recently-viewed-products" v-if="state.recentlyViewed.length > 0">

    <div class="title">
      최근 본 상품
    </div>

    <div class="content">
      <div class="pagination" v-if="state.page.totalPages > 1">
        <button @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-caret-left-fill"></i></button>
        <span v-for="page in state.page.totalPages" :key="page" :class="{ 'current-page': state.page.currentPage === page }" @click="goToPage(page)"> {{ page }} </span>
        <button @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-caret-right-fill"></i></button>
      </div>

      <div class="grid">
        <div class="item" v-for="(rv, idx) in state.recentlyViewed" :key="idx">

          <div class="product">
            <div class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: rv.product.id }}">
                <span class="image-container" :style="{backgroundImage: `url(${rv.product.productImages[0].filePath}${rv.product.productImages[0].fileName})`}"/>
              </router-link>
            </div>

            <div class="detail-section">
              <div class="info-section">
                <div class="title-row">
                  <span class="discount-per" v-if="rv.product.discountPer">{{ rv.product.discountPer }}%↓</span>
                  <span class="name">{{ rv.product.name }} &nbsp;</span>
                </div>

                <div class="pricing-row">
                  <div class="price-container">
                    <small class="original-price" :class="{ 'sale': rv.product.discountPer }">{{ lib.getFormattedNumber(rv.product.price) }}원</small>
                    <small class="discounted-price" v-if="rv.product.discountPer"> {{ lib.getFormattedNumber(rv.product.price - (rv.product.price * rv.product.discountPer / 100)) }}원</small>
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <span role="button" tabindex="0" @click="handleAddFavorite(rv.product.id)">
                  <i class="bi bi-heart"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SelectProductSize v-if="showSelectProductSizeModal" @close="showSelectProductSizeModal = false"
                       :show="showSelectProductSizeModal" :productId="selectedProductId" />
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import {useStore} from "vuex";
import SelectProductSize from "@/components/modal/SelectProductSize.vue";

export default {
  name: 'RecentlyViewedProducts',
  components: {SelectProductSize},
  setup() {
    const store = useStore();
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);
    const state = reactive({
      recentlyViewed: [],
      page: {pageSize: 4, currentPage: 1, totalPages: 0},
    })

    const goToPage = (page) => {
      state.page.currentPage = page;
      load();
    };

    const handleAddFavorite = (productId) => {
      if (store.state.account.id) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    const load = () => {
      if (store.state.account.id) {
        axios.get("/api/recently-viewed-product/get-by-database?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize).then(({data}) => {
          state.recentlyViewed = data.recentlyViewedProducts;
          state.page.totalPages = data.totalPages;
        });

      } else {
        // 로그인하지 않은 경우, 로컬 스토리지에서 최근 본 상품의 아이디 목록을 가져옴
        let recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

        state.page.totalPages = Math.ceil(recentlyViewedProducts.length / state.page.pageSize);

        let startIndex = (state.page.currentPage - 1) * state.page.pageSize;
        let endIndex = startIndex + state.page.pageSize;
        let slicedrecentlyViewedProducts = recentlyViewedProducts.slice(startIndex, endIndex);

        if (recentlyViewedProducts.length > 0) {

          // 상품 아이디 목록을 사용하여 서버에서 상품 정보를 가져옴
          axios.post("/api/recently-viewed-product/get-by-localstorage", slicedrecentlyViewedProducts).then(({data}) => {
            state.recentlyViewed = data;
          });
        }
      }
    };

    onMounted(load);

    return {
      lib,
      state,
      showSelectProductSizeModal, selectedProductId,
      handleAddFavorite,
      goToPage
    }
  }
}
</script>

<style scoped>
.recently-viewed-products {
  padding-block: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-inline: 15px;
  margin-bottom: 20px;
//max-width: 80%;
}

.grid {
  display: flex;
  flex-wrap: wrap;
//padding: 0 15px;
}

.item {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 15px;
}

.product {
  border: 1px solid rgba(169, 169, 169, .3);
}

.image-container {
  display: block;
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
}

.detail-section {
  flex: 1;
  display: flex;
  padding: 10px 15px;
  justify-content: space-between;
}

.info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-buttons {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.title-row {
  display: flex; /* Use flexbox for the title row */
  align-items: center; /* Vertically center align items */
  font-size: 0.9rem;
  font-weight: bold;
}

.discount-per {
  display: inline;
  align-items: center;
  color: #dc3545;
  margin-right: 0.2rem;
}

.name {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.pricing-row {
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

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-inline: 15px;
  gap: 0.1rem;
  font-size: 0.9rem;
}

.pagination button {
  border: none;
  background-color: transparent;
}

.pagination span {
  cursor: pointer;
  color: gray;
  margin: 0 2px;
}

.pagination .current-page {
  color: black;
  font-weight: bold;
}

</style>
<template>
  <div class="recently-viewed-products" v-if="state.recentlyViewed.length > 0">

    <div class="title">
      최근 본 상품
    </div>

    <div class="content">
      <div class="pagination" v-if="state.page.totalPages > 1">
        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-caret-left-fill"></i></button>
        <span v-for="page in state.page.totalPages" :key="page" :class="{ 'current-page': state.page.currentPage === page }" @click="goToPage(page)"> {{ page }} </span>
        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-caret-right-fill"></i></button>
      </div>

      <div class="grid">
        <div class="item" v-for="(rv, idx) in state.recentlyViewed" :key="idx">

          <div class="product">
            <div class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: rv.product.id }}">
                <span class="image-container" :style="{backgroundImage: `url(${rv.product.productImages[0].fileUrl})`}"/>
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
import {computed, reactive, ref, watchEffect} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import store from "@/scripts/store";
import {isMobile, isTablet} from "@/scripts/mixin";
import SelectProductSize from "@/components/modules/favorite/SelectProductSizeModal.vue";

export default {
  name: 'RecentlyViewedProducts',
  components: {SelectProductSize},
  setup() {
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);
    const state = reactive({
      recentlyViewed: [],
      page: {pageSize: isMobile()? 2: isTablet()? 3: 4, currentPage: 1, totalPages: 0},
    });

    const goToPage = (page) => {
      state.page.currentPage = page;
      getRecentlyViewedProducts();
    };

    const handleAddFavorite = (productId) => {
      if (isLoggedIn.value) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    const getRecentlyViewedProducts = () => {
      if (isLoggedIn.value) {
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

    watchEffect(getRecentlyViewedProducts);

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

<style lang="scss" scoped>
@import "@/styles/modules/product/products-recently-viewed";
</style>
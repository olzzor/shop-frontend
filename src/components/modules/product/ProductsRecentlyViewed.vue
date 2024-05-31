<template>
  <div class="recently-viewed-products" v-if="state.recentlyViewedProducts && state.recentlyViewedProducts.length > 0">

    <div class="title">
      RECENTLY VIEWED
    </div>

    <div class="content">
      <div class="pagination" v-if="state.page.totalPages > 1">
        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-caret-left-fill"></i></button>
        <span v-for="page in state.page.totalPages" :key="page" :class="{ 'current-page': state.page.currentPage === page }" @click="goToPage(page)"> {{ page }} </span>
        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-caret-right-fill"></i></button>
      </div>

      <div class="grid">
        <div class="item" v-for="(rv, idx) in state.recentlyViewedProducts" :key="idx">

          <div class="product">
            <div class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: rv.product.id }}">
<!--                <span class="image-container" :style="{backgroundImage: `url(${rv.product.productImages[0].fileUrl})`}"/>-->
                <img class="image-container" :src="`${rv.product.productImages[0].fileUrl}`" />
                <div v-if="rv.product.status !== 'ON_SALE'" class="not-in-stock-overlay">
                  <div class="not-in-stock">NOT IN STOCK</div>
                </div>
              </router-link>
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
import {computed, nextTick, reactive, ref, watchEffect} from "vue";
import {isMobile, isTablet} from "@/scripts/mixin";
import axios from "axios";
import formatter from "@/scripts/formatter";
import store from "@/scripts/store";
import SelectProductSize from "@/components/modules/wishlist/SelectProductSizeModal.vue";

export default {
  name: 'RecentlyViewedProducts',
  components: {SelectProductSize},
  setup() {
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);
    const state = reactive({
      recentlyViewedProducts: [],
      page: {pageSize: isMobile()? 2: isTablet()? 3: 4, currentPage: 1, totalPages: 0},
    });

    const goToPage = (page) => {
      const direction = page > state.page.currentPage ? 'right' : 'left'; // 추가
      state.page.currentPage = page;

      nextTick(() => {
        applySlideAnimation(direction);
      });

      getRecentlyViewedProducts();
    };

    const applySlideAnimation = (direction) => {
      const grid = document.querySelector('.grid');

      // 기존의 애니메이션 클래스 제거
      grid.classList.remove('slide-in-from-right', 'slide-in-from-left');

      // 방향에 따른 애니메이션 클래스 추가
      if (direction === 'right') {
        grid.classList.add('slide-in-from-right');
      } else {
        grid.classList.add('slide-in-from-left');
      }
    };

    const handleSelectProductSizeModal = (productId) => {
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
          state.recentlyViewedProducts = data.recentlyViewedProducts;
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
            state.recentlyViewedProducts = data;
          });
        }
      }
    };

    watchEffect(getRecentlyViewedProducts);

    return {
      formatter,
      state,
      showSelectProductSizeModal, selectedProductId,
      handleSelectProductSizeModal,
      goToPage
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/product/products-recently-viewed";
</style>
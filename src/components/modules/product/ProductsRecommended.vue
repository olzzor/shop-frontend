<template>
  <div class="recommended-products" v-if="state.recommendedProducts && state.recommendedProducts.length > 0">

    <div class="title">
      RECOMMENDED
    </div>

    <div class="content">
      <div class="grid">
        <div class="item" v-for="(rp, idx) in state.recommendedProducts" :key="idx">

          <div class="product">
            <div class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: rp.product.id }}">
                <!-- <span class="image-container" :style="{backgroundImage: `url(${rv.product.productImages[0].fileUrl})`}"/>-->
                <img class="image-container" :src="`${rp.product.productImages[0].fileUrl}`" />
                <div v-if="rp.product.status !== 'ON_SALE'" class="not-in-stock-overlay">
                  <div class="not-in-stock">NOT IN STOCK</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="state.page.totalPages > 1">
        <!--        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-caret-left-fill"></i></button>-->
        <!--        <span v-for="page in state.page.totalPages" :key="page" :class="{ 'current-page': state.page.currentPage === page }" @click="goToPage(page)"> {{ page }} </span>-->
        <!--        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-caret-right-fill"></i></button>-->
        <div class="page-bar" :class="{ 'active': state.page.currentPage === page }"
             v-for="page in state.page.totalPages" :key="page" @click="goToPage(page)"></div>
      </div>
    </div>

    <SelectProductSize v-if="showSelectProductSizeModal" @close="showSelectProductSizeModal = false"
                       :show="showSelectProductSizeModal" :productId="selectedProductId" />
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import {isMobile, isTablet} from "@/scripts/mixin";
import axios from "axios";
import formatter from "@/scripts/formatter";
import store from "@/scripts/store";
import SelectProductSize from "@/components/modules/wishlist/SelectProductSizeModal.vue";

export default {
  name: 'RecommendedProducts',
  components: {SelectProductSize},
  setup() {
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);
    const state = reactive({
      recommendedProducts: [],
      page: {pageSize: isMobile()? 2: isTablet()? 3: 4, currentPage: 1, totalPages: 0},
    });

    const goToPage = (page) => {
      // const direction = page > state.page.currentPage ? 'right' : 'left'; // 추가
      state.page.currentPage = page;

      // nextTick(() => {
      //   applySlideAnimation(direction);
      // });

      getRecommendedProducts();
    };

    // const applySlideAnimation = (direction) => {
      // const grid = document.querySelector('.grid');
      //
      // // 기존의 애니메이션 클래스 제거
      // grid.classList.remove('slide-in-from-right', 'slide-in-from-left');
      //
      // // 방향에 따른 애니메이션 클래스 추가
      // if (direction === 'right') {
      //   grid.classList.add('slide-in-from-right');
      // } else {
      //   grid.classList.add('slide-in-from-left');
      // }
    // };

    const handleSelectProductSizeModal = (productId) => {
      if (isLoggedIn.value) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    const getRecommendedProducts = () => {
      axios.get("/api/recommended-product/get?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize).then(({data}) => {
        state.recommendedProducts = data.recommendedProducts;
        state.page.totalPages = data.totalPages;
      });
    };

    const load = () => {
      getRecommendedProducts();
    }

    onMounted(load);

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
@import "@/styles/modules/product/products-recommended";
</style>
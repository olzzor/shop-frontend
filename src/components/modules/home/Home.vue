<template>
  <div class="home">
    <Products :products="state.products" :isSearched="state.isSearched" @sort-change="handleSortOptionChange"/>
    <button type="button" class="btn-load-more" v-if="state.page.currentPage < state.page.totalPages" @click="loadMore">VIEW MORE</button>
    <RecommendedProducts />
    <RecentlyViewedProducts />
  </div>

  <div class="notice-modal-overlay" v-if="state.showNoticeModalOverlay"></div>
  <div class="notice" v-for="(n, idx) in state.notices" :key="n.id">
    <NoticeModal :notice="n" :show="state.currentNoticeModalIndex === idx"
                 @showOverlay="handleShowNoticeModalOverlay" @close="handleNoticeModalClose" />
  </div>
</template>

<script>
import {onMounted, reactive, watch} from "vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {isMobile, isTablet} from "@/scripts/mixin";
import axios from "axios";
import store from "@/scripts/store";
import formatter from "@/scripts/formatter";
import Products from "@/components/modules/product/Products.vue";
import RecommendedProducts from "@/components/modules/product/ProductsRecommended.vue";
import RecentlyViewedProducts from "@/components/modules/product/ProductsRecentlyViewed.vue";
import NoticeModal from "@/components/modules/notice/NoticeModal.vue";

export default {
  name: "Home",
  components: {Products, RecommendedProducts, RecentlyViewedProducts, NoticeModal},
  setup() {
    const route = useRoute();
    const flattenCategories = formatter.getFlattenCategories();
    const state = reactive({
      isSearched: false,
      sortOption: 'regDate,desc', // 기본 정렬 옵션
      products: [],
      page: {pageSize: isMobile()? 2: isTablet()? 3: 4, currentPage: 1, totalPages: 0},
      notices: [],
      currentNoticeModalIndex: 0,
      showNoticeModalOverlay: false, // 복수 공지 모달의 오버레이 중첩 예방을 위해 추가
    });

    const handleSortOptionChange = (newSortOption) => {
      state.sortOption = newSortOption;
      state.page.currentPage = 1;

      if (route.query.search) {
        getProductsByQuery(route.query.search);
      } else if (route.params.cat) {
        getProductsByCategory(route.params.cat);
      } else {
        getProducts();
      }
    };

    const handleShowNoticeModalOverlay = () => {
      state.showNoticeModalOverlay = true;
    }

    const handleNoticeModalClose = () => {
      if (state.currentNoticeModalIndex >= state.notices.length - 1) {
        state.showNoticeModalOverlay = false;
      } else {
        state.currentNoticeModalIndex += 1;
      }
    };

    const getProducts = () => {
      axios.get(`/api/product/all?page=0&size=${state.page.pageSize}&sort=${state.sortOption}`).then(({data}) => {
        state.isSearched = false;
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    };

    const getProductsByCategory = (categorySlug) => {
      axios.get(`/api/product/category/${categorySlug}?page=0&size=${state.page.pageSize}&sort=${state.sortOption}`).then(({data}) => {
        state.isSearched = false;
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    };

    const getProductsByQuery = (searchQuery) => {
      axios.get(`/api/product/search/${searchQuery}?page=0&size=${state.page.pageSize}&sort=${state.sortOption}`).then(({data}) => {
        state.isSearched = true;
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    };

    watch(() => route.path, (newPath) => {
      if (newPath === '/') { // 홈 페이지로 돌아왔을 때 상품 목록을 새로 로드
        state.page.currentPage = 1;
        getProducts();
      }
    });

    watch(() => route.params.cat, (newCategorySlug) => {
      if (newCategorySlug && !route.query.search) {
        // 카테고리 슬러그를 기반으로 카테고리 정보를 찾아 스토어를 업데이트
        const categoryInfo = flattenCategories.find(c => c.slug === newCategorySlug) || {code: 0, name: '', slug: ''};
        store.dispatch('updateCurrentCategory', categoryInfo);

        // 카테고리별 상품 목록을 가져오는 함수 호출
        state.page.currentPage = 1;
        getProductsByCategory(newCategorySlug);
      }
    }, { immediate: true });

    watch(() => route.query.search, (newSearchQuery) => {

      if (newSearchQuery) {
        state.page.currentPage = 1;
        getProductsByQuery(newSearchQuery);
      }
    }, { immediate: true });

    const load = () => {
      axios.get("/api/notice/show-in-modal").then(({data}) => {
        state.notices = data;
      });

      getProducts();
    };

    const loadMore = () => {
      state.page.currentPage++;

      let apiEndpoint;
      if (route.query.search) { // 검색어에 따른 추가 데이터 로드
        const searchQuery = route.query.search;
        apiEndpoint = `/api/product/search/${searchQuery}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=${state.sortOption}`;

      } else if (route.params.cat) { // 카테고리별 추가 데이터 로드
        const slug = route.params.cat;
        apiEndpoint = `/api/product/category/${slug}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=${state.sortOption}`;

      } else { // 전체 상품의 추가 데이터 로드
        apiEndpoint = `/api/product/all?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=${state.sortOption}`;
      }

      axios.get(apiEndpoint).then(({data}) => {
        // state.isSearched = false;
        state.products = state.products.concat(data.products);
        state.page.totalPages = data.totalPages;
      });
    };

    onBeforeRouteLeave((to, from, next) => { // 페이지를 떠날 때 상태 저장
      sessionStorage.setItem('productPageState', JSON.stringify(state));
      sessionStorage.setItem('scrollPosition', window.scrollY);
      next();
    });

    onMounted(() => {
      // 페이지 로드
      const savedState = JSON.parse(sessionStorage.getItem('productPageState'));
      savedState ? Object.assign(state, savedState) : load();

      // 스크롤 상태 복원
      const savedScrollPosition = sessionStorage.getItem('scrollPosition');
      if (savedScrollPosition) { // 0.2초 후에 스크롤 이동
        setTimeout(() => window.scrollTo(0, parseInt(savedScrollPosition)), 200);
      }
    });

    return {
      state,
      handleSortOptionChange,
      handleShowNoticeModalOverlay, handleNoticeModalClose,
      // sortProducts,
      loadMore,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/home/home";
</style>
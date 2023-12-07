<template>
  <div class="home">
    <AvailableProducts :products="state.products" :isSearched="state.isSearched"/>
    <button type="button" class="btn-load-more" v-if="state.page.currentPage < state.page.totalPages" @click="loadMore">VIEW MORE</button>
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
import axios from "axios";
import AvailableProducts from "@/components/modules/product/ProductsAvailable.vue";
import RecentlyViewedProducts from "@/components/modules/product/ProductsRecentlyViewed.vue";
import NoticeModal from "@/components/modules/notice/NoticeModal.vue";

export default {
  name: "Home",
  components: {AvailableProducts, RecentlyViewedProducts, NoticeModal},
  setup() {
    const route = useRoute();
    const state = reactive({
      isSearched: false,
      products: [],
      page: {pageSize: 4, currentPage: 1, totalPages: 0},
      notices: [],
      currentNoticeModalIndex: 0,
      showNoticeModalOverlay: false, // 복수 공지 모달의 오버레이 중첩 예방을 위해 추가
    });

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

    watch(() => route.path, (newPath) => {

      if (newPath === '/') { // 홈 페이지로 돌아왔을 때 상품 목록을 새로 로드
        state.page.currentPage = 1;

        axios.get(`/api/product/all?page=0&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
          state.isSearched = false;
          state.products = data.products;
          state.page.totalPages = data.totalPages;
        });
      }
    });

    watch(() => route.params.cat, (newCategoryCode) => {

      if (newCategoryCode) {
        state.page.currentPage = 1;

        axios.get(`/api/product/category/${newCategoryCode}?page=0&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
          state.isSearched = false;
          state.products = data.products;
          state.page.totalPages = data.totalPages;
        });
      }
    });

    watch(() => route.query.search, (newSearchQuery) => {

      if (newSearchQuery) {
        state.page.currentPage = 1;

        axios.get(`/api/product/search/${newSearchQuery}?page=0&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
          state.isSearched = true;
          state.products = data.products;
          state.page.totalPages = data.totalPages;
        });
      }
    });

    const load = () => {
      axios.get("/api/notice/show-in-modal").then(({data}) => {
        state.notices = data;
      });

      // if (!route.params.cat && store.state.searchResults.length === 0) {
      axios.get(`/api/product/all?page=0&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.isSearched = false;
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
      // }
    };

    const loadMore = () => {
      state.page.currentPage++;

      let apiEndpoint;
      if (route.query.search) { // 검색어에 따른 추가 데이터 로드
        const searchQuery = route.query.search;
        apiEndpoint = `/api/product/search/${searchQuery}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`;

      } else if (route.params.cat) { // 카테고리별 추가 데이터 로드
        const code = route.params.cat;
        apiEndpoint = `/api/product/category/${code}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`;

      } else { // 전체 상품의 추가 데이터 로드
        apiEndpoint = `/api/product/all?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`;
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

    onMounted(() => { // 페이지 load 및 상태 복원
      const savedState = JSON.parse(sessionStorage.getItem('productPageState'));
      const savedScrollPosition = sessionStorage.getItem('scrollPosition');

      savedState ? Object.assign(state, savedState) : load();

      if (savedScrollPosition) { // 0.2초 후에 스크롤 이동
        setTimeout(() => window.scrollTo(0, parseInt(savedScrollPosition)), 200);
      }
    });

    return {
      state,
      handleShowNoticeModalOverlay, handleNoticeModalClose, loadMore
    }
  }
}
</script>

<style scoped>
.home {
  padding-block: 20px;
}

.btn-load-more {
  position: relative;
  display: flex;
  align-items: center;
  font-size: .75rem;
  justify-content: center;
  text-align: center;
  height: 40px;
  width: 150px;
  margin: 5px auto;
  border: none; /* 테두리 제거 */
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

.notice-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검은색의 70% 투명도 */
  z-index: 999; /* 모달보다 하나 낮은 z-index */
}
</style>
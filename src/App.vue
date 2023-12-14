<template>
  <div class="app" v-if="isAdminPath">
    <RouterView />
  </div>

  <div class="app" v-else>
    <div class="header-wrapper"><Header/></div>
    <div class="slider-wrapper" v-if="isHomePage && !hasSearchQuery"><Slider/></div>
<!--    <div class="slider-wrapper" v-if="isHomePage"><Slider/></div>-->
    <div class="router-view-wrapper"><RouterView /></div>
    <div class="footer-wrapper"><Footer /></div>
  </div>
</template>

<script>
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router/dist/vue-router";
import axios from "axios";
import store from "@/scripts/store";
import Header from "@/components/modules/home/Header.vue";
import Slider from "@/components/modules/home/Slider.vue";
import Footer from "@/components/modules/home/Footer.vue";

export default {
  name: 'App',
  components: {Header, Slider, Footer},

  setup() {
    const route = useRoute();
    const isAdminPath = computed(() => window.location.hostname === 'admin.bridgeshop.com');
    const isHomePage = computed(() => route.path === '/');
    const hasSearchQuery = computed(() => Boolean(route.query.search));

    const check = () => {
      axios.get("/api/user/check").then(({data}) => {
        store.commit("setAccountId", data.id || 0);
        store.commit("setAccountRole", data.role || '');
      });
    };

    onMounted(check);

    return {
      isAdminPath, isHomePage, hasSearchQuery
    };
  }
}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 최소 높이를 뷰포트의 높이로 설정 */
//justify-content: space-between;
}


.app > * {
  flex-shrink: 0;
}

.router-view-wrapper {
  flex-grow: 1;
  padding: 0px 10% 20px 10%;
  overflow: auto;
}

.footer-wrapper {
  position: relative;
  flex-grow: 0; /* 모든 자식 요소가 flex 컨테이너 내에서 줄어들지 않도록 함 */
  width: 100%;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

/* @font-face 추가 */
@font-face {
  font-family: 'GmarketSans';
  src: url('@/assets/fonts/GmarketSansOTF/GmarketSansMedium.otf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* 전체 페이지의 폰트 적용 */
body, html {
  font-family: 'GmarketSans', sans-serif;
}
</style>

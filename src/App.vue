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
    const isAdminPath = computed(() => window.location.hostname === 'admin.localhost.test');
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

<style lang="scss">
@import "app";
</style>

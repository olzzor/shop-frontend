<template>
  <header>
    <div class="navbar">
      <div class="navbar-left">
        <div @click="toggleMenuTooltip"
             @mouseenter="showMenuTooltip = true" @mouseleave="handleIconMouseLeave('menu')">
          <i class="bi bi-list"></i>
        </div>

        <!-- 상품 검색 -->
        <div class="search-container">
          <!--          <input v-model="searchQuery" type="text" @keyup.enter="search" placeholder=" SEARCH FOR KEYWORDS">-->
          <!--          <a href="#" @click.prevent="search">-->
          <!--            <i class="bi bi-search"></i>-->
          <!--          </a>-->

          <i class="bi bi-search" @click="toggleSearchInput"></i>
          <input v-if="isSearchInputVisible" v-model="searchQuery" type="text" @keyup.enter="search" placeholder="SEARCH FOR KEYWORDS">
        </div>
      </div>

      <div class="navbar-center">
        <!-- 로고 -->
        <div class="logo-container" v-if="!isMobile() || (isMobile() && !isSearchInputVisible)">
          <router-link to="/" @click="resetHomePageState"><img src="/img/icons/logo.png" alt="BRIDGE MALL" /></router-link>
        </div>
      </div>

      <div class="navbar-right">
        <!-- 관심 상품 -->
        <router-link v-if="$store.state.account.id" to="/favorite">
          <i :class="isFavoritePage ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </router-link>
        <router-link v-else to="/login" @click.prevent="setRedirectPathToLogin('/favorite')">
          <i class="bi bi-heart"></i>
        </router-link>

        <!-- 장바구니 -->
        <router-link v-if="$store.state.account.id" to="/cart">
          <i :class="isCartPage ? 'bi bi-bag-fill' : 'bi bi-bag'"></i>
        </router-link>
        <router-link v-else to="/login" @click.prevent="setRedirectPathToLogin('/cart')">
          <i class="bi bi-bag"></i>
        </router-link>

        <!-- 내 계정 -->
        <div v-if="$store.state.account.id" @click="toggleMyPageTooltip"
             @mouseenter="showMyPageTooltip = true" @mouseleave="handleIconMouseLeave('mypage')">
          <i :class="isMyPage ? 'bi bi-person-fill' : 'bi bi-person'"></i>
        </div>
        <router-link v-else to="/login" @click.prevent="setRedirectPathToLogin('/')">
          <i class="bi bi-person"></i>
        </router-link>
      </div>
    </div>

    <!-- 메뉴 툴팁 -->
<!--    <transition name="slide-fade">-->
    <div v-if="showMenuTooltip" class="menu-tooltip" :class="showMenuTooltip ? 'show' : 'hide'"
         @mouseenter="handleTooltipMouseEnter" @mouseleave="handleTooltipMouseLeave('menu')">
      <div class="menu-tooltip-content">
        <div>
          <a class="category-title" @click="navigateTo('menu', 'products', '/products-category/all')">PRODUCTS</a>
        <!-- 상품 카테고리 -->
<!--        <div v-if="selectedContent === 'products'">-->
          <router-link :to="{ name: 'Products', params: { cat: 'all' }}" @click="closeTooltip('menu')">ALL</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'tops' }}" @click="closeTooltip('menu')">TOPS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'shirts' }}" @click="closeTooltip('menu')">SHIRTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'sweats' }}" @click="closeTooltip('menu')">SWEATS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'knits' }}" @click="closeTooltip('menu')">KNITS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'pants' }}" @click="closeTooltip('menu')">PANTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'jeans' }}" @click="closeTooltip('menu')">JEANS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'skirts' }}" @click="closeTooltip('menu')">SKIRTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'outer' }}" @click="closeTooltip('menu')">OUTER</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'headwear' }}" @click="closeTooltip('menu')">HEADWEAR</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'footwear' }}" @click="closeTooltip('menu')">FOOTWEAR</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'accessories' }}" @click="closeTooltip('menu')">ACCESSORIES</router-link>
<!--        </div>-->
        </div>

        <div>
          <a class="category-title" @click="navigateTo('menu', 'notices', '/notices-category/all')">NOTICES</a>
        <!-- 공지 카테고리 -->
<!--        <div v-else-if="selectedContent === 'notices'">-->
          <router-link :to="{ name: 'Notices', params: { cat: 'all' }}" @click="closeTooltip('menu')">ALL</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'information' }}" @click="closeTooltip('menu')">INFORMATION</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'community' }}" @click="closeTooltip('menu')">COMMUNITY</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'promotion' }}" @click="closeTooltip('menu')">PROMOTION</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'maintenance' }}" @click="closeTooltip('menu')">MAINTENANCE</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'alert' }}" @click="closeTooltip('menu')">ALERT</router-link>
<!--        </div>-->
        </div>

        <div><a @click="navigateTo('menu', 'products', '/reviews')">REVIEWS</a></div>
        <div><a @click="navigateTo('menu', 'products', '/support')">SUPPORT</a></div>

      </div>
    </div>
<!--    </transition>-->

    <!-- 마이 페이지 툴팁 -->
    <div v-if="showMyPageTooltip" class="mypage-tooltip" :class="showMyPageTooltip ? 'show' : 'hide'"
         @mouseenter="handleTooltipMouseEnter" @mouseleave="handleTooltipMouseLeave('mypage')">
      <router-link to="/favorite" class="link" @click="closeTooltip('mypage')">관심 상품</router-link>
      <router-link to="/cart" class="link" @click="closeTooltip('mypage')">장바구니</router-link>
      <router-link to="/member/coupon-list" class="link" @click="closeTooltip('mypage')">내 쿠폰</router-link>
      <router-link to="/member/order-history" class="link" @click="closeTooltip('mypage')">주문 이력</router-link>
      <router-link to="/member/contact-history" class="link" @click="closeTooltip('mypage')">문의 내역</router-link>
      <router-link to="/member/edit-address" class="link" @click="closeTooltip('mypage')">주소지 변경</router-link>
      <router-link to="/member/edit-profile" class="link" @click="closeTooltip('mypage')">회원정보 변경</router-link>
      <router-link to="/member/change-password" class="link" @click="closeTooltip('mypage')">비밀번호 변경</router-link>
      <router-link to="#" class="link" @click="logout">로그아웃</router-link>
    </div>
  </header>
</template>

<script>
import {computed, ref} from 'vue';
import store from "@/scripts/store";
import router from "@/scripts/router";
import axios from "axios";
import {useRoute} from "vue-router";
import {isMobile, isDesktop} from "@/scripts/mixin";

export default {
  name: 'Header',
  setup() {
    const route = useRoute();
    const isFavoritePage = computed(() => route.path === '/favorite');
    const isCartPage = computed(() => route.path === '/cart');
    const isMyPage = computed(() => route.path.startsWith('/member'));
    const selectedContent = ref('products');
    const isSearchInputVisible = ref(false); // 추가
    const searchQuery = ref('');
    const showMenuTooltip = ref(false);
    const showMyPageTooltip = ref(false);

    let tooltipTimeout = null;

    const toggleSearchInput = () => {
      isSearchInputVisible.value = !isSearchInputVisible.value;
    };

    const toggleMenuTooltip = () => {
      if(!isDesktop()) {
        showMenuTooltip.value = !showMenuTooltip.value;
      }
    };

    const toggleMyPageTooltip = () => {
      if(!isDesktop()) {
        showMyPageTooltip.value = !showMyPageTooltip.value;
      }
    };

    const handleTooltipMouseEnter = () => {
      if(isDesktop()) {
        if (tooltipTimeout) {
          clearTimeout(tooltipTimeout);
        }
      }
    };

    const handleTooltipMouseLeave = (iconType) => {
      if(isDesktop()) {
        if (iconType === 'menu') {
          showMenuTooltip.value = false;

        } else if (iconType === 'mypage') {
          showMyPageTooltip.value = false;
        }
      }
    };

    const handleIconMouseLeave = (iconType) => {
      if(isDesktop()) {
        tooltipTimeout = setTimeout(() => {

          if (iconType === 'menu') {
            showMenuTooltip.value = false;

          } else if (iconType === 'mypage') {
            showMyPageTooltip.value = false;
          }
        }, 100); // 100ms
      }
    };

    const closeTooltip = (tooltipType) => {
      if (tooltipType === 'menu') {
        showMenuTooltip.value = false;

      } else if (tooltipType === 'mypage') {
        showMyPageTooltip.value = false;
      }
    };

    // 로그인 페이지로 리디렉션하기 전에 redirectPath 설정
    const setRedirectPathToLogin = (path) => {
      sessionStorage.setItem('redirectPath', path);
    };

    const search = () => {
      const query = searchQuery.value;
      // router.push({ path: "/", query: { search: query } });
      router.push({ name: 'Products', params: { cat: 'all' }, query: { search: query } });

      // axios.get(`/api/product/search/${query}`).then(response => {
      //   store.commit('setSearchResults', response.data);
      //   // router.push({name: 'search-results'});
      //   router.push({name: 'Home'});
      //
      // }).catch(error => {
      //   console.log(error);
      // });
    };

    const navigateTo = (tooltipType, content, path) => {
      selectedContent.value = content;
      router.push(path).then(() => {
        closeTooltip(tooltipType);
      });
    };

    const logout = () => {
      if (window.confirm('로그아웃하시겠습니까?')) {
        axios.post("/api/user/logout").then(() => {
          store.commit('setAccountId', 0);
          store.commit('setAccountRole', '');
          router.push({name: 'Home'});
        });
      }
    };

    const resetHomePageState = () => {
      sessionStorage.removeItem('productPageState');
      sessionStorage.removeItem('scrollPosition');
    };

    return {
      isMobile,
      isFavoritePage, isCartPage, isMyPage,
      selectedContent, searchQuery, isSearchInputVisible,
      showMenuTooltip, showMyPageTooltip,
      toggleSearchInput, toggleMenuTooltip, toggleMyPageTooltip,
      handleTooltipMouseEnter, handleTooltipMouseLeave, handleIconMouseLeave,
      closeTooltip,
      setRedirectPathToLogin, search, navigateTo, logout, resetHomePageState,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/home/header";
</style>
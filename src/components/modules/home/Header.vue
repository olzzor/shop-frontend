<template>
  <header>

    <div class="navbar">
      <div class="navbar-left" style="width: 10%">
        <!-- 로고 -->
        <div class="logo-container">
          <router-link to="/">
            <img src="/img/icons/logo.png" alt="BRIDGE MALL" />
          </router-link>
        </div>
      </div>

      <div class="navbar-center" style="width: 80%">
        <!-- 내비게이션 -->
        <div class="navigation-links">
          <a @click="navigateTo('products', '/products-category/all')">PRODUCTS</a>
          <a @click="navigateTo('notices', '/notices-category/all')">NOTICES</a>
          <a @click="navigateTo('products', '/reviews')">REVIEWS</a>
          <a @click="navigateTo('products', '/support')">SUPPORT</a>
        </div>

        <!-- 상품 검색 -->
        <div class="search-container">
          <input v-model="searchQuery" type="text" @keyup.enter="search" placeholder=" SEARCH FOR KEYWORDS">
          <a href="#" @click.prevent="search">
            <i class="bi bi-search"></i>
            <!--            <img src="/img/icons/search.png" alt="SEARCH" class="icon"/>-->
          </a>
        </div>
      </div>

      <div class="navbar-right" style="width: 10%">
        <!-- 관심 상품 -->
        <router-link v-if="$store.state.account.id" to="/favorite">
          <i :class="isFavoritePage ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </router-link>
        <router-link v-else :to="{ path: '/login', query: { redirect: 'favorite' } }">
          <i class="bi bi-heart"></i>
        </router-link>

        <!-- 장바구니 -->
        <router-link v-if="$store.state.account.id" to="/cart">
          <i :class="isCartPage ? 'bi bi-bag-fill' : 'bi bi-bag'"></i>
        </router-link>
        <router-link v-else :to="{ path: '/login', query: { redirect: 'cart' } }">
          <i class="bi bi-bag"></i>
        </router-link>

        <!-- 내 계정 -->
        <div v-if="$store.state.account.id" @mouseenter="showMyPageTooltip = true" @mouseleave="handleIconMouseLeave">
          <i :class="isMyPage ? 'bi bi-person-fill' : 'bi bi-person'"></i>
        </div>
        <router-link v-else to="/login">
          <i class="bi bi-person"></i>
        </router-link>
      </div>
    </div>

    <div class="category" style="width: 100%">
      <div class="category-left" style="width: 10%"></div>
      <div class="category-center" style="width: 80%">
        <!-- 상품 카테고리 -->
        <div v-if="selectedContent === 'products'">
          <!--          <router-link to="/">ALL</router-link>-->
          <router-link :to="{ name: 'Products', params: { cat: 'all' }}">ALL</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'tops' }}">TOPS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'shirts' }}">SHIRTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'sweats' }}">SWEATS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'knits' }}">KNITS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'pants' }}">PANTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'jeans' }}">JEANS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'skirts' }}">SKIRTS</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'outer' }}">OUTER</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'headwear' }}">HEADWEAR</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'footwear' }}">FOOTWEAR</router-link>
          <router-link :to="{ name: 'Products', params: { cat: 'accessories' }}">ACCESSORIES</router-link>
        </div>

        <!-- 공지 카테고리 -->
        <div v-else-if="selectedContent === 'notices'">
          <router-link :to="{ name: 'Notices', params: { cat: 'all' }}">ALL</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'information' }}">INFORMATION</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'community' }}">COMMUNITY</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'promotion' }}">PROMOTION</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'maintenance' }}">MAINTENANCE</router-link>
          <router-link :to="{ name: 'Notices', params: { cat: 'alert' }}">ALERT</router-link>
        </div>
      </div>
      <div class="category-right" style="width: 10%"></div>
    </div>

    <!-- 툴팁 -->
    <div v-if="showMyPageTooltip" class="mypage-tooltip" @mouseenter="handleTooltipMouseEnter"
         @mouseleave="handleTooltipMouseLeave">
      <router-link to="/member/coupon-list" class="link">내 쿠폰</router-link>
      <router-link to="/member/order-history" class="link">주문 이력</router-link>
      <router-link to="/member/contact-history" class="link">문의 내역</router-link>
      <router-link to="/member/edit-address" class="link">주소지 변경</router-link>
      <router-link to="/member/edit-profile" class="link">회원정보 변경</router-link>
      <router-link to="/member/change-password" class="link">비밀번호 변경</router-link>
      <router-link to="/" class="link" @click="logout">로그아웃</router-link>
      <router-link to="/" class="link" @click="withdraw">탈퇴</router-link>
    </div>
  </header>
</template>

<script>
import {computed, ref} from 'vue';
import store from "@/scripts/store";
import router from "@/scripts/router";
import axios from "axios";
import {useRoute} from "vue-router";

export default {
  name: 'Header',
  setup() {
    const route = useRoute();
    const isFavoritePage = computed(() => route.path === '/favorite');
    const isCartPage = computed(() => route.path === '/cart');
    const isMyPage = computed(() => route.path.startsWith('/member'));
    const selectedContent = ref('products');
    const searchQuery = ref('');
    const showMyPageTooltip = ref(false);

    let tooltipTimeout = null;

    const handleIconMouseLeave = () => {
      tooltipTimeout = setTimeout(() => {
        showMyPageTooltip.value = false;
      }, 100);  // 100ms should be enough, adjust if needed
    };

    const handleTooltipMouseEnter = () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };

    const handleTooltipMouseLeave = () => {
      showMyPageTooltip.value = false;
    };

    const search = () => {
      const query = searchQuery.value;
      // router.push({ path: "/", query: { search: query } });
      router.push({ name: 'Products', params: { cat: 'all' }, query: { search: query } });

      // axios.get(`/api/product/search/${query}`).then(response => {
      //   store.commit('setSearchResults', response.data);
      //   // router.push({name: 'search-results'});
      //   router.push({path: "/"});
      //
      // }).catch(error => {
      //   console.log(error);
      // });
    };

    const navigateTo = (content, path) => {
      selectedContent.value = content;
      router.push(path);
    };


    const logout = () => {
      if (window.confirm('로그아웃하시겠습니까?')) {
        axios.post("/api/user/logout").then(() => {
          store.commit('setAccountId', 0);
          store.commit('setAccountRole', '');
          router.push({path: "/"});
        });
      }
    };

    const withdraw = () => {
      if (window.confirm('탈퇴하시겠습니까?')) {
        axios.post("/api/user/withdraw").then(() => {
          alert('탈퇴되었습니다.');
          store.commit('setToken', 0);
          store.commit('setAccountId', 0);
          store.commit('setAccountRole', '');
          router.push({path: "/"});
        });
      }
    };

    return {
      isFavoritePage, isCartPage, isMyPage,
      showMyPageTooltip, handleIconMouseLeave, handleTooltipMouseEnter, handleTooltipMouseLeave,
      selectedContent, searchQuery,
      search, navigateTo,
      logout, withdraw,
    };
  }
}
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar {
  display: flex;
  align-items: center;
  height: 2rem;
  width: 100%;
  justify-content: space-between;
  padding-block: 3px;
  padding-inline: 15px;
//background-color: #333; background-color: #fff; /* 흰색 배경으로 변경 */ color: #000; /* 글자색을 검정색으로 변경 */
}

.navbar-center {
  display: flex; /* 이 블록을 flex container로 만듭니다. */
  align-items: center;
  justify-content: space-between; /* 내용을 왼쪽에서 시작합니다. */
  padding-inline: 10px;
  font-size: 0.8rem;
}

.navbar-center a, .navbar-center router-link {
  color: #000;
  text-decoration: none;
}

.navbar-center a:hover, .navbar-center router-link:hover {
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-end;
  position: relative;
}

.navigation-links {
  display: flex; /* 이 블록을 flex container로 만듭니다. */
  flex-direction: row; /* 항목을 가로로 나열합니다. */
  gap: 20px;
}

.category {
  display: flex;
  align-items: center;
  height: 2rem;
  padding-block: 3px;
  padding-inline: 15px;
  background-color: #000;
}

.category-center div {
  display: flex;
  gap: 20px;
  padding-inline: 10px;
  font-size: 0.8rem;
}

.category-center a, .category-center router-link {
  color: #fff;
  text-decoration: none;
}

.category-center a:hover, .category-center router-link:hover {
  font-weight: bold;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-container input {
  border: none;
  outline: none;
  border-bottom: 1px solid #545454;
  width: 200px; /* 입력란의 길이를 지정합니다. */
}

.search-container a {
  position: absolute;
  right: 0; /* 아이콘을 입력란의 오른쪽에 위치시킵니다. */
}

.search-container input::placeholder {
  font-size: 0.75rem;
  color: grey;
}

.icon {
  width: 18px; /* 원하는 너비로 설정 */
  height: 18px; /* 원하는 높이로 설정 */
}

i {
  color: black;
}

.bi {
  vertical-align: middle;
  margin: 0;
  padding: 0;
}

.bi-person, .bi-person-fill {
  font-size: 1.3rem;
  margin-left: -4px;
}

.mypage-tooltip {
  position: absolute;
  top: calc(100% - 2rem); /* 아이콘의 아래 위치에 나타나게 함 */
  width: 150px;
  right: 0;
  background-color: white;
  border: 1px solid #e3e3e3;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 다른 요소들 위에 나타나도록 함 */
  font-size: .8rem;
}

.mypage-tooltip a {
  color: black;
  text-decoration: none;
  padding: 5px 0;
}

.mypage-tooltip a.link {
  color: inherit;
  text-decoration: none;
  display: block;
  padding: 10px 0;
}
</style>
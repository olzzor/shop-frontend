<template>
  <div class="admin">
    <div class="header">
      <div class="title">관리자 페이지입니다</div>
    </div>

    <div class="main">
      <div class="sidebar">
        <div class="list">
          <div class="link-head" @click="toggleLinks('all')">
            전체
          </div>

          <div class="link-head" @click="toggleLinks('notices')">
            공지 관리<i :class="classNoticeIcon"></i>
          </div>
          <div v-if="showNoticeLink">
            <router-link to="/notice-regist" class="link">공지 등록</router-link>
            <router-link to="/notice-list" class="link">공지 목록</router-link>
          </div>

          <div class="link-head" @click="toggleLinks('orders')">
            주문 관리<i :class="classOrderIcon"></i>
          </div>
          <div v-if="showOrderLink">
            <router-link to="/order-list" class="link">주문 목록</router-link>
            <router-link to="/shipment-list" class="link">배송 목록</router-link>
            <a href="https://admin.portone.io/payments" target="_blank" class="link">결제 내역 <i
                class="bi bi-box-arrow-up-right"></i></a>
          </div>

          <div class="link-head" @click="toggleLinks('products')">
            상품 관리<i :class="classProductIcon"></i>
          </div>
          <div v-if="showProductLink">
            <router-link to="/product-regist" class="link">상품 등록</router-link>
            <router-link to="/product-list" class="link">상품 목록</router-link>
            <router-link to="/recommended-product-list" class="link">추천 상품 목록</router-link>
          </div>

          <div class="link-head" @click="toggleLinks('customers')">
            고객 관리<i :class="classCustomerIcon"></i>
          </div>
          <div v-if="showCustomerLink">
            <router-link to="/user-list" class="link">유저 목록</router-link>
            <router-link to="/review-list" class="link">리뷰 목록</router-link>
            <router-link to="/contact-list" class="link">문의 목록</router-link>
          </div>

          <div class="link-head" @click="toggleLinks('promotions')">
            프로모션 관리<i :class="classPromotionIcon"></i>
          </div>
          <div v-if="showPromotionLink">
            <router-link to="/coupon-regist" class="link">쿠폰 등록</router-link>
            <router-link to="/coupon-list" class="link">쿠폰 목록</router-link>
          </div>

          <div class="link-head" @click="toggleLinks('stats')">
            통계 관리<i :class="classStatsIcon"></i>
          </div>
          <div v-if="showStatsLink">
            <router-link to="/stats-sales" class="link">매출 분석</router-link>
          </div>
        </div>
      </div>

      <div class="main-content">
        <router-view class="content"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted} from "vue";
import axios from "axios";
import router from "@/scripts/router";
import store from "@/scripts/store";

export default {
  name: "Admin",
  components: {},
  setup() {
    const showNoticeLink = computed(() => store.getters.showNoticeLink);
    const showOrderLink = computed(() => store.getters.showOrderLink);
    const showProductLink = computed(() => store.getters.showProductLink);
    const showCustomerLink = computed(() => store.getters.showCustomerLink);
    const showPromotionLink = computed(() => store.getters.showPromotionLink);
    const showStatsLink = computed(() => store.getters.showStatsLink);

    const classNoticeIcon = computed(() => store.getters.classNoticeIcon);
    const classOrderIcon = computed(() => store.getters.classOrderIcon);
    const classProductIcon = computed(() => store.getters.classProductIcon);
    const classCustomerIcon = computed(() => store.getters.classCustomerIcon);
    const classPromotionIcon = computed(() => store.getters.classPromotionIcon);
    const classStatsIcon = computed(() => store.getters.classStatsIcon);

    const toggleLinks = (type) => {
      store.commit('toggleLinks', type);
    };

    const load = () => {
      // if (!store.state.account.role) {
        // 클라이언트 측에 권한 정보가 없으면 서버에 확인 요청
        axios.get('/api/user/check-admin-role').then(({data}) => {
          if (!data) {
            router.push('/'); // 서버로부터 받은 응답을 기반으로 어드민 권한이 없으면 홈으로 리다이렉트
          }

        }).catch(error => {
          if (error.response) {
            const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
            window.alert(errorMessage);
          } else {
            window.alert('오류가 발생했습니다. 다시 시도해주세요.');
          }
          router.push('/');
        });
      // }
    }

    onMounted(load);

    return {
      showNoticeLink, showOrderLink, showProductLink, showCustomerLink, showPromotionLink, showStatsLink,
      classNoticeIcon, classOrderIcon, classProductIcon, classCustomerIcon, classPromotionIcon, classStatsIcon,
      toggleLinks,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/admin";
</style>
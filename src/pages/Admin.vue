<template>
  <div class="admin">
    <div class="header">
      <div class="title">관리자 페이지입니다</div>
    </div>

    <div class="main">
      <div class="sidebar">
        <div class="list">
          <div @click="toggleLinks('all')" class="link-head">
            <i :class="$store.state.icons.all"></i>
          </div>

          <div @click="toggleLinks('notices')" class="link-head">
            공지 관리<i :class="$store.state.icons.notices"></i>
          </div>
          <div v-if="$store.state.showLinks.notices">
            <router-link to="/notice-regist" class="link">공지 등록</router-link>
            <router-link to="/notice-list" class="link">공지 목록</router-link>
          </div>

          <div @click="toggleLinks('orders')" class="link-head">
            주문 관리<i :class="$store.state.icons.orders"></i>
          </div>
          <div v-if="$store.state.showLinks.orders">
            <router-link to="/order-list" class="link">주문 목록</router-link>
            <router-link to="/shipment-list" class="link">배송 목록</router-link>
            <a href="https://admin.portone.io/payments" target="_blank" class="link">결제 내역 <i
                class="bi bi-box-arrow-up-right"></i></a>
          </div>

          <div @click="toggleLinks('products')" class="link-head">
            상품 관리<i :class="$store.state.icons.products"></i>
          </div>
          <div v-if="$store.state.showLinks.products">
            <router-link to="/product-regist" class="link">상품 등록</router-link>
            <router-link to="/product-list" class="link">상품 목록</router-link>
          </div>

          <div @click="toggleLinks('customers')" class="link-head">
            고객 관리<i :class="$store.state.icons.customers"></i>
          </div>
          <div v-if="$store.state.showLinks.customers">
            <router-link to="/user-list" class="link">유저 목록</router-link>
            <router-link to="/review-list" class="link">리뷰 목록</router-link>
            <router-link to="/contact-list" class="link">문의 목록</router-link>
          </div>

          <div @click="toggleLinks('promotions')" class="link-head">
            프로모션 관리<i :class="$store.state.icons.stats"></i>
          </div>
          <div v-if="$store.state.showLinks.stats">
            <router-link to="/coupon-regist" class="link">쿠폰 등록</router-link>
            <router-link to="/coupon-list" class="link">쿠폰 목록</router-link>
          </div>

          <div @click="toggleLinks('stats')" class="link-head">
            통계 관리<i :class="$store.state.icons.stats"></i>
          </div>
          <div v-if="$store.state.showLinks.stats">
            <router-link to="/stats-sales" class="link">매출 분석 (날짜)</router-link>
            <router-link to="/stats-sales-category" class="link">매출 분석 (카테고리)</router-link>
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
import store from "@/scripts/store";
import {onMounted} from "vue";
import axios from "axios";
import router from "@/scripts/router";

export default {
  name: "Admin",
  components: {},
  setup() {
    // const isAdminRole = computed(() => store.state.account.role === 'admin');
    const toggleLinks = (type) => {
      store.commit('toggleLinks', type);
    };

    // 서버에 어드민 권한을 확인하는 요청을 보내고 결과를 반환하는 함수
    const checkAdminRoleFromServer = () => {
      return axios.get('/api/check-admin-role')
          .then(response => {
            // 서버로부터 받은 응답을 기반으로 어드민 여부를 반환
            return response.data.isAdmin;
          });
    };

    onMounted(() => {
      if (!store.state.account.role) {
        // 클라이언트 측에 권한 정보가 없으면 서버에 확인 요청
        checkAdminRoleFromServer().then(isAdmin => {
          if (!isAdmin) {
            // 권한이 없으면 홈으로 리다이렉트
            router.push('/');
          }
        }).catch(error => {
          console.error('Error checking admin role:', error);
          // 에러 발생 시 로그인 페이지로 리다이렉트
          router.push('/login');
        });
      }
    });

    return {toggleLinks}
  }
}
</script>

<style scoped>
.admin {
  display: flex;
  flex-direction: column;
  //background-color: #f7f7f7;
}

.header {
  text-align: center;
  background-color: black;
  color: white;
  padding-block: 10px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.main {
  display: flex;
  margin-inline: 40px;
}

.sidebar {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1; /* 남은 공간을 모두 차지 */
  border-left: 1px solid #e3e3e3;
  overflow: auto;
  padding-block: 20px;
}

.link-head {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e3e3e3;
  cursor: pointer;
}

.link-head i {
  margin-right: 10px;
  cursor: pointer;
}

a {
  color: #000000;
}

a.link {
  font-size: 12px;
  text-decoration: none;
  display: block;
  padding: 10px 0;
  padding-left: 20px; /* 링크를 한 칸 들여쓰기 */
  border-bottom: 1px solid #e3e3e3;
}

a.router-link-exact-active {
  font-weight: bold;
}
</style>
<template>
  <div class="member">
    <div class="title"></div>

    <div class="content">
      <div class="sidebar">
        <!--        <MyAccount/>-->
        <div class="sidebar-title">마이 페이지</div>

        <div class="user-profile">
          {{ state.user.name }}<br>{{ state.user.email }}
        </div>

        <div class="link-list">
          <router-link to="/member/coupon-list" class="link">내 쿠폰</router-link>
          <router-link to="/member/order-history" class="link">주문 이력</router-link>
          <router-link to="/member/contact-history" class="link">문의 내역</router-link>
          <router-link to="/member/edit-address" class="link">주소지 변경</router-link>
          <router-link to="/member/edit-profile" class="link">회원정보 변경</router-link>
          <router-link to="/member/change-password" class="link">비밀번호 변경</router-link>
          <router-link to="/" class="link" @click="logout">로그아웃</router-link>
          <router-link to="/" class="link" @click="withdraw">탈퇴</router-link>
        </div>
      </div>

      <div class="main-content">
        <router-view class="content"></router-view>
        <!--        <Support/>-->
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";
// import MyAccount from "@/components/account/BkMyAccount.vue";
// import Support from "@/components/account/Support.vue";
// import {reactive} from "vue";

export default {
  name: "Member",
  components: {},
  setup() {
    const state = reactive({
      user: {}
    });

    const load = () => {
      const id = store.state.account.id;

      axios.get(`/api/user/${id}`).then((res) => {
        state.user.name = res.data.name;
        state.user.email = res.data.email;
      })
    };

    const logout = () => {
      axios.post("/api/user/logout").then(() => {
        store.commit('setAccountId', 0);
        store.commit('setAccountRole', '');
        router.push({path: "/"});
      });
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

    load();

    return {
      state, logout, withdraw
    };
  }
}
</script>

<style scoped>
.member {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}

.content {
  display: flex;
  align-items: stretch; /* 자식 요소들이 전체 너비를 차지하도록 설정 */
  padding-inline: 15px;
  min-height: 69vh; /* member의 margin-top 값을 제외한 화면 전체 높이 */
  position: relative;
}

.sidebar {
  flex: 0 0 20%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e3e3e3;
  position: sticky; /* 고정 위치 설정 */
  top: 0; /* 상단에 고정 */
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.user-profile {
  font-weight: bold;
  font-size: .9rem;
  margin-bottom: 20px;
}

.link-list {
  font-size: .75rem;
}

.main-content {
  flex: 1 0 80%;
  overflow: auto;
}

a {
  color: #000000;
}

a.link {
  text-decoration: none;
  display: block;
  padding: 10px 0;
  border-bottom: 1px solid #e3e3e3;
}

a.link:first-of-type {
  border-top: 1px solid #e3e3e3;
}

</style>
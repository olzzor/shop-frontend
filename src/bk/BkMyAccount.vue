<template>
  <div class="my-account">
    <div class="title">내 계정</div>

    <div class="content">
      <p>
        <b>{{ state.user.name }}</b><br>
        <b>{{ state.user.email }}</b>
      </p>

      <router-link to="/customer/contact-history" class="link">문의 내역 확인하기</router-link>
      <router-link to="/customer/order-history" class="link">주문 내역 확인하기</router-link>
      <router-link to="/customer/coupon-list" class="link">내 쿠폰 확인하기</router-link>
      <router-link to="/customer/edit-profile" class="link">회원 정보 변경하기</router-link>
      <router-link to="/customer/edit-address" class="link">주소지 변경하기</router-link>
      <router-link to="/customer/change-password" class="link">비밀번호 변경하기</router-link>
      <router-link to="/" class="link" @click="logout">로그아웃</router-link>
      <router-link to="/" class="link" @click="withdraw">탈퇴하기</router-link>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";

export default {
  name: "MyAccount",
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

    return {state, logout, withdraw}
  }
}
</script>
<style scoped>
.my-account {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: 12px;
}

hr {
  border: 0.1px gray;
  margin-top: 5px;
  margin-bottom: 5px;
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
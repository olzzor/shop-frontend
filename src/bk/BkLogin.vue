<template>
  <div class="form-signin w-100 m-auto">
    <h1 class="h3 mb-3 fw-normal" style="text-align: center">Please sign in</h1>
    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
             @keyup.enter="submit()" v-model="state.form.email">
      <label for="floatingInput">이메일</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password" @keyup.enter="submit()"
             v-model="state.form.password">
      <label for="floatingPassword">비밀번호</label>
    </div>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me" @keyup.enter="submit()">로그인 상태 유지
      </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" @click="submit()">로그인</button>
    <LoginNaver/>
    <a :href="googleAuthUrl">구글 아이디로 로그인</a><br>
    <a :href="naverAuthUrl">네이버 아이디로 로그인</a><br>
    <!--    회원가입-->
    <!--    이메일 찾기-->
    <!--    비밀번호 찾기-->
    <p class="mt-5 mb-3 text-muted">&copy; 2017–2022</p>
  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";
import LoginNaver from "@/bk/BkLoginNaver.vue";
import {GOOGLE_AUTH_URL, NAVER_AUTH_URL, KAKAO_AUTH_URL} from "@/scripts";

export default {
  components: {LoginNaver},

  data() {
    return {
      googleAuthUrl: GOOGLE_AUTH_URL,
      naverAuthUrl: NAVER_AUTH_URL,
      kakaoAuthUrl: KAKAO_AUTH_URL
    }
  },

  setup() {
    const state = reactive({
      form: {
        email: "",
        password: ""
      }
    })

    const submit = () => {
      axios.post("/api/user/login", state.form).then((res) => {
        store.commit('setAccountId', res.data);
        // sessionStorage.setItem("id", res.data);
        router.push({path: "/"});
        window.alert("로그인하였습니다.");
      }).catch(() => {
        window.alert("로그인 정보가 존재하지 않습니다..");
      });
    }

    return {state, submit}
  }
}
</script>

<style scoped>
.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>



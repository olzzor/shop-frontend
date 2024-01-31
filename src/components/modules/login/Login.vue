<template>
  <div class="login">
    <div class="title">로그인</div>
    <div class="content">

      <form @submit.prevent="login">
        <div class="local-login">
          <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 37.000000 43.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,43.000000) scale(0.100000,-0.100000)" fill="#545454" stroke="none">
                <path d="M153 419 c-76 -22 -99 -121 -42 -178 82 -83 225 10 176 115 -26 54 -78 79 -134 63z"/>
                <path d="M80 148 c-46 -31 -69 -67 -72 -108 l-3 -35 183 -3 182 -2 0 27 c0 41 -40 103 -80 124 -52 28 -166 26 -210 -3z"/>
              </g>
            </svg>
            <input type="text" class="input-field" id="email" placeholder="이메일"
                   v-model="state.form.email" autocomplete="email" />
          </div>
          <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>

          <div class="password-field" :class="{ 'input-error': state.errorMessage.password }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36.000000 40.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,40.000000) scale(0.100000,-0.100000)" fill="#545454" stroke="none">
                <path d="M146 390 c-50 -15 -96 -73 -96 -120 0 -15 6 -20 24 -20 19 0 27 8 36 35 18 53 73 73 116 40 24 -18 51 -19 57 -2 8 22 -12 44 -53 61 -45 18 -44 18 -84 6z"/>
                <path d="M328 313 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"/>
                <path d="M310 281 c0 -5 5 -13 10 -16 6 -3 10 -2 10 4 0 5 -4 13 -10 16 -5 3 -10 2 -10 -4z"/>
                <path d="M270 255 c0 -8 5 -15 10 -15 6 0 10 7 10 15 0 8 -4 15 -10 15 -5 0 -10 -7 -10 -15z"/>
                <path d="M7 214 c-12 -13 -8 -189 5 -202 18 -18 322 -17 337 2 8 9 11 47 9 107 l-3 94 -171 3 c-93 1 -173 -1 -177 -4z m208 -40 c11 -11 14 -25 10 -38 -4 -12 -10 -37 -14 -56 -5 -29 -11 -35 -31 -35 -23 0 -26 5 -33 58 -6 41 -5 63 4 73 15 19 44 18 64 -2z"/>
              </g>
            </svg>
            <input :type="passwordFieldType" class="input-field" id="password" placeholder="비밀번호"
                   v-model="state.form.password" autocomplete="current-password" />
            <i class="bi" :class="passwordIconClass" @click="togglePasswordVisibility"></i>
          </div>
          <div class="error-message" v-if="state.errorMessage.password">{{ state.errorMessage.password }}</div>

          <div class="extra-options">
            <div>
              <label class="checkbox-wrapper" @click="state.saveEmail = !state.saveEmail">
                <i v-if="state.saveEmail" class="bi bi-check-square-fill"></i>
                <i v-else class="bi bi-square"></i>
                이메일 저장
              </label>
            </div>
            <div class="links">
              <router-link to="/login/find-password" class="link">비밀번호 찾기</router-link>
            </div>
          </div>

          <button class="button btn-login" type="submit">로그인</button>
          <button class="button btn-signup" type="button" @click="signup">회원 가입하기</button>
        </div>
      </form>

      <div class="social-login">
        <button class="button btn-login-google" @click="loginGoogle">
          <div class="google-icon-wrapper">
<!--            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--              <path d="M19.76 10.77L19.67 10.42H12.23V13.58H16.68C16.4317 14.5443 15.8672 15.3974 15.0767 16.0029C14.2863 16.6084 13.3156 16.9313 12.32 16.92C11.0208 16.9093 9.77254 16.4135 8.81999 15.53C8.35174 15.0685 7.97912 14.5191 7.72344 13.9134C7.46777 13.3077 7.33407 12.6575 7.33 12C7.34511 10.6795 7.86792 9.41544 8.79 8.47002C9.7291 7.58038 10.9764 7.08932 12.27 7.10002C13.3779 7.10855 14.4446 7.52101 15.27 8.26002L17.47 6.00002C16.02 4.70638 14.1432 3.9941 12.2 4.00002C11.131 3.99367 10.0713 4.19793 9.08127 4.60115C8.09125 5.00436 7.19034 5.59863 6.43 6.35002C4.98369 7.8523 4.16827 9.85182 4.15152 11.9371C4.13478 14.0224 4.918 16.0347 6.34 17.56C7.12784 18.3449 8.06422 18.965 9.09441 19.3839C10.1246 19.8029 11.2279 20.0123 12.34 20C13.3484 20.0075 14.3479 19.8102 15.2779 19.42C16.2078 19.0298 17.0488 18.4549 17.75 17.73C19.1259 16.2171 19.8702 14.2347 19.83 12.19C19.8408 11.7156 19.8174 11.2411 19.76 10.77Z" fill="#000000"/>-->
<!--            </svg>-->
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 52 54" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,54.000000) scale(0.100000,-0.100000)" fill="#545454" stroke="none">
                <path d="M184 517 c-49 -19 -99 -57 -124 -94 l-23 -34 34 -29 c40 -35 55 -37 64 -10 10 32 71 72 118 77 27 3 57 -1 82 -11 l39 -16 33 32 c18 17 33 35 33 38 0 4 -19 17 -42 30 -49 28 -164 37 -214 17z" />
                <path d="M280 265 l0 -45 70 0 c79 0 83 -6 45 -56 l-24 -32 35 -27 c29 -22 37 -25 50 -14 25 21 51 81 58 135 11 84 10 84 -120 84 l-114 0 0 -45z" />
              </g>
            </svg>
          </div>
          <div class="divider"></div>
          <div class="icon-text-wrapper">구글 로그인</div>
        </button>

        <button class="button btn-login-naver" @click="loginNaver">
          <div class="naver-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512">
              <path fill="#545454" d="M9 32V480H181.366V255.862L331.358 480H504V32H331.358V255.862L181.366 32H9Z"></path>
            </svg>
          </div>
          <div class="divider"></div>
          <div class="icon-text-wrapper">네이버 로그인</div>
        </button>

        <button class="button btn-login-kakao" @click="loginKakao">
          <div class="kakao-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 50.000000 48.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#545454" stroke="none">
                <path d="M146 454 c-56 -20 -103 -59 -126 -104 -37 -73 -19 -144 51 -204 l39 -33 -15 -49 c-8 -27 -15 -50 -15 -51 0 -11 30 3 78 36 48 32 68 39 122 43 100 8 165 48 204 125 44 88 -16 196 -133 238 -54 19 -153 18 -205 -1z" />
              </g>
            </svg>
          </div>
          <div class="divider"></div>
          <div class="icon-text-wrapper">카카오 로그인</div>
        </button>

        <button class="button btn-login-facebook" @click="loginFacebook">
          <div class="facebook-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27"
                 viewBox="0 0 52.000000 52.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,52.000000) scale(0.100000,-0.100000)" fill="#545454" stroke="none">
                <path d="M190 511 c-46 -15 -85 -39 -116 -73 -51 -54 -68 -95 -68 -173 -1 -61 3 -77 30 -125 20 -34 48 -66 79 -87 71 -49 75 -46 75 47 0 79 0 80 -25 80 -23
                    0 -25 4 -25 45 0 41 2 45 24 45 21 0 24 6 30 49 10 80 65 119 152 109 26 -3 29 -7 32 -40 3 -34 1 -38 -20 -38 -35 0 -68 -27 -68 -56 0 -22 4 -24 45 -24
                    44 0 45 -1 39 -27 -13 -62 -14 -63 -50 -63 l-34 0 0 -85 c0 -47 4 -85 9 -85 21 0 79 25 109 47 151 112 140 327 -20 426 -50 31 -147 45 -198 28z" />
              </g>
            </svg>
          </div>
          <div class="divider"></div>
          <div class="icon-text-wrapper">페이스북 로그인</div>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";
import {useRoute} from "vue-router";

export default {
  name: "Login",
  setup() {
    const route = useRoute();
    const passwordVisible = ref(false);
    const state = reactive({
      saveEmail: false,
      form: {email: "", password: ""},
      errorMessage: {},
    })

    const passwordFieldType = computed(() => passwordVisible.value ? 'text' : 'password');
    const passwordIconClass = computed(() => passwordVisible.value ? 'bi-eye-fill' : 'bi-eye-slash-fill');

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    onMounted(() => {

      // 메시지 이벤트 리스너 추가
      window.addEventListener('message', (event) => {
        if (event.data.type === 'socialLoginSuccess') {
          store.commit('setAccountId', event.data.userId);
          store.commit('setAccountRole', event.data.userRole);
          router.push({path: "/"});
        }
      });

      const savedEmail = localStorage.getItem('savedEmail');

      if (savedEmail) {
        // savedEmail 가 있다면 아이디 입력 폼과 savedEmail 를 설정
        state.form.email = savedEmail;
        state.saveEmail = true;
      }
    });

    // 로컬 스토리지의 recentlyViewedProducts 를 DB에 삽입하는 함수
    const syncLocalStorageWithDB = () => {
      const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

      if (recentlyViewedProducts.length > 0) {
        axios.post("/api/recently-viewed-product/sync", recentlyViewedProducts).then(() => {
          // 성공적으로 DB에 저장되면 로컬 스토리지에서 제거
          localStorage.removeItem('recentlyViewedProducts');
        });
      }
    }

    // 회원 가입 페이지로 이동하는 함수
    const signup = () => {
      router.push({path: "/sign-up"});
    };

    const checkInput = () => {
      let result = true;

      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
      const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      state.errorMessage = {};

      if (state.form.email.length === 0) {
        state.errorMessage.email = "이메일을 입력해주세요.";
        result = false;
      } else if (!EMAIL_PATTERN.test(state.form.email)) {
        state.errorMessage.email = "유효한 이메일을 입력해주세요.";
        result = false;
      }

      if (state.form.password.length === 0) {
        state.errorMessage.password = "비밀번호를 입력해주세요.";
        result = false;
      } else if (!PASSWORD_PATTERN.test(state.form.password)) {
        state.errorMessage.password = "비밀번호는 8자 이상으로, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다.";
        result = false;
      }

      return result;
    };

    const login = () => {
      if (checkInput()) {
        axios.post("/api/user/login", state.form).then(({data}) => {
          store.commit('setAccountId', data.id);
          store.commit('setAccountRole', data.role);

          // saveEmail 가 true 이면 로컬 스토리지에 아이디 저장
          if (state.saveEmail) {
            localStorage.setItem('savedEmail', state.form.email);
          }

          syncLocalStorageWithDB();
          window.alert("로그인하였습니다.");

          // 로그인 성공 시, redirect query parameter 를 확인하여 해당 경로로 리다이렉트 (기본적으로 홈 페이지로 리다이렉트)
          const redirect = route.query.redirect || '/';
          router.push({path: redirect});

        }).catch(() => {
          window.alert("로그인 정보가 존재하지 않습니다.");
        });
      }
    }

    const loginGoogle = () => {
      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const clientId = '249788645467-l89t277l0rno4a4pd16jt43mrccd2i3d.apps.googleusercontent.com';
      const redirectUri = 'http://localhost.test:3000/login/google';
      const scope = 'email profile';

      const loginUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      showSocialLoginPopup(loginUrl)
    };

    const loginNaver = () => {
      const authUrl = 'https://nid.naver.com/oauth2.0/authorize';
      const clientId = 'lRrQyVJfr2_5u5M3vh7R';
      const redirectUri = 'http://localhost.test:3000/login/naver';

      const loginUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=1234`;
      showSocialLoginPopup(loginUrl)
    };

    const loginKakao = () => {
      const authUrl = 'https://kauth.kakao.com/oauth/authorize';
      const clientId = 'bc70bff5016b07be7a2c35517831835f';
      const redirectUri = 'http://localhost.test:3000/login/kakao';
      const scope = 'account_email birthday gender profile_nickname profile_image';

      const loginUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      showSocialLoginPopup(loginUrl)
    };

    const loginFacebook = () => {
      const authUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
      const clientId = '3561230307461014';
      const redirectUri = 'http://localhost.test:3000/login/facebook';
      const scope = 'email';

      const loginUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      showSocialLoginPopup(loginUrl)
    };

    const showSocialLoginPopup = (url) => {
      const popupHeight = '500'
      const popupWidth = '500'
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const popupX = (screenWidth - parseInt(popupWidth)) / 2;
      const popupY = (screenHeight - parseInt(popupHeight)) / 2;

      let popupOptions = `height=${popupHeight},width=${popupWidth},left=${popupX},top=${popupY},scrollbars=yes,resizable=yes`;

      openPopup(url, popupOptions)
      return false
    };

    const openPopup = (url, options) => {
      window.open(url, '_blank', options);
    };

    return {
      state,
      passwordFieldType, passwordIconClass, togglePasswordVisibility,
      login, loginGoogle, loginNaver, loginKakao, loginFacebook,
      signup,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/login/login";
</style>

<template>
  <div class="sign-up">
    <div class="title">회원 가입</div>
    <div class="content">

      <form @submit.prevent="signup">
        <div class="name-field" :class="{ 'input-error': state.errorMessage.name }">
          <input type="text" class="input-field" id="name" placeholder="이름" autocomplete="name"
                 v-model="state.form.name" @input="trimInput('name')" />
        </div>
        <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>

        <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
          <input type="text" class="input-field" id="email" placeholder="이메일" autocomplete="email"
                 v-model="state.form.email" @input="trimInput('email')" />
        </div>
        <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>

        <div class="password-field" :class="{ 'input-error': state.errorMessage.password }">
          <input :type="passwordFieldType" class="input-field" id="password" placeholder="비밀번호" autocomplete="new-password"
                 v-model="state.form.password" @input="trimInput('password')" />
          <i class="bi" :class="passwordIconClass" @click="togglePasswordVisibility('main')"></i>
        </div>
        <div class="error-message" v-if="state.errorMessage.password">{{ state.errorMessage.password }}</div>

        <div class="password-confirm-field" :class="{ 'input-error': state.errorMessage.passwordConfirm }">
          <input :type="passwordConfirmFieldType" class="input-field" id="passwordConfirm" placeholder="비밀번호 재입력" autocomplete="new-password"
                 v-model="state.form.passwordConfirm" @input="trimInput('passwordConfirm')" />
          <i class="bi" :class="passwordConfirmIconClass" @click="togglePasswordVisibility('confirm')"></i>
        </div>
        <div class="error-message" v-if="state.errorMessage.passwordConfirm">{{ state.errorMessage.passwordConfirm }}
        </div>

        <button class="button btn-signup" type="submit" :disabled="state.isSubmitting">회원 가입</button>
        <button class="button btn-login" type="button" @click="login">로그인하기</button>
      </form>

      <div class="message"></div>
    </div>
  </div>
</template>

<script>
import {computed, reactive} from "vue";
import axios from "axios";
import router from "@/scripts/router";

export default {
  name: "SignUp",
  setup() {
    const state = reactive({
      isSubmitting: false,
      passwordVisible: {main: false, confirm: false},
      form: {name: "", email: "", password: "", passwordConfirm: ""},
      errorMessage: {},
    })

    const passwordFieldType = computed(() => state.passwordVisible.main ? 'text' : 'password');
    const passwordConfirmFieldType = computed(() => state.passwordVisible.confirm ? 'text' : 'password');
    const passwordIconClass = computed(() => state.passwordVisible.main ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    const passwordConfirmIconClass = computed(() => state.passwordVisible.confirm ? 'bi-eye-fill' : 'bi-eye-slash-fill');

    const togglePasswordVisibility = (type) => {
      state.passwordVisible[type] = !state.passwordVisible[type];
    };

    const trimInput = (key) => {
      state.form[key] = state.form[key].trim();
    };

    const login = () => {
      router.push({path: "/login"});
    };

    const checkInput = () => {
      let result = true;

      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
      const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      state.errorMessage = {};

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > 10) {
        state.errorMessage.name = "이름은 10자 이하로 입력해주세요.";
        result = false;
      }

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

      if (state.form.passwordConfirm.length === 0) {
        state.errorMessage.passwordConfirm = "비밀번호를 재입력해주세요.";
        result = false;
      } else if (state.form.password !== state.form.passwordConfirm) {
        state.errorMessage.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        result = false;
      }

      return result;
    };

    const signup = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axios.post("/api/user/signup", state.form).then(() => {
          window.alert("계정 생성에 성공하였습니다.");
          login();

        }).catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 400:
                window.alert(error.response.data.message);
                break;
              case 409:
                window.alert(error.response.data.message);
                break;
              default:
                window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
          } else {
            // 네트워크 오류 또는 기타 오류를 처리하는 로직
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    }

    return {
      state,
      passwordFieldType, passwordConfirmFieldType,
      passwordIconClass, passwordConfirmIconClass,
      togglePasswordVisibility,
      trimInput, signup, login
    }
  },
}
</script>

<style scoped>
.sign-up {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.input-field {
  border: none;
  outline: none;
  width: 100%;
  height: 30px;
  font-size: .75rem;
}

/* 웹킷 기반 브라우저(Chrome, Safari 등)의 자동완성 스타일을 덮어쓰기 위한 코드 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

.name-field, .email-field, .password-field, .password-confirm-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.password-confirm-field input {
  flex-grow: 1; /* Allow the input to take up the available space */
  border: none; /* Remove default border of input field */
  padding: 0; /* Remove default padding of input field */
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 100%;
  margin-block: 5px;
  border-radius: 5px;
  border: none; /* 테두리 제거 */
}


.btn-signup {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  margin-top: 10px;
}

.btn-login {
  background-color: transparent; /* 배경색을 투명하게 설정 */
  text-decoration: underline; /* 텍스트에 밑줄 추가 */
  text-underline-offset: 0.15em; /* 밑줄 오프셋을 조정 */
  margin-block: 0;
}

.password-field .bi, .password-confirm-field .bi {
  color: #545454;
}

.input-error {
  border: 1px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}
</style>

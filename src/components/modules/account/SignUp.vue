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

        <button type="submit" class="button btn-signup" :disabled="state.isSubmitting">회원 가입</button>
        <button type="button" class="button btn-login" @click="login">로그인하기</button>
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
      router.push({name: 'Login'});
    };

    const checkInput = () => {
      let result = true;

      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
      const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      state.errorMessage = {};

      if (state.form.name.length === 0) {
        state.errorMessage.name = '이름을 입력해주세요.';
        result = false;
      } else if (state.form.name.length > 10) {
        state.errorMessage.name = '이름은 10자 이하로 입력해주세요.';
        result = false;
      }

      if (state.form.email.length === 0) {
        state.errorMessage.email = '이메일을 입력해주세요.';
        result = false;
      } else if (!EMAIL_PATTERN.test(state.form.email)) {
        state.errorMessage.email = '유효한 이메일을 입력해주세요.';
        result = false;
      }

      if (state.form.password.length === 0) {
        state.errorMessage.password = '비밀번호를 입력해주세요.';
        result = false;
      } else if (!PASSWORD_PATTERN.test(state.form.password)) {
        state.errorMessage.password = '비밀번호는 8자 이상으로, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다.';
        result = false;
      }

      if (state.form.passwordConfirm.length === 0) {
        state.errorMessage.passwordConfirm = '비밀번호를 재입력해주세요.';
        result = false;
      } else if (state.form.password !== state.form.passwordConfirm) {
        state.errorMessage.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        result = false;
      }

      return result;
    };

    const signup = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axios.post('/api/user/signup', state.form).then(() => {
          window.alert('계정 생성에 성공하였습니다.');
          login();

        }).catch(error => {
          if (error.response) {
            const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
            window.alert(errorMessage);
          } else {
            window.alert('오류가 발생했습니다. 다시 시도해주세요.');
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

<style lang="scss" scoped>
@import "@/styles/modules/account/sign-up";
</style>

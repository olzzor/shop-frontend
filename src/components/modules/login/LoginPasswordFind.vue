<template>
  <div class="login-password-find">
    <div class="title">비밀번호 찾기</div>

    <div class="content">
      <form @submit.prevent="findPassword">
        <p>계정과 연결된 이메일을 입력하시면 임시 비밀번호를 전송해 드립니다.</p>

        <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
          <input type="text" class="input-field" id="email" placeholder="이메일" autocomplete="email" v-model="state.form.email"/>
        </div>

        <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>

        <button type="submit" class="button btn-find-password" :disabled="state.isSubmitting">전송</button>
      </form>
    </div>

  </div>
</template>

<script>
import {reactive} from "vue";
import router from "@/scripts/router";
import axiosInstance from "@/scripts/axiosInstance";

export default {
  name: "LoginPasswordFind",
  setup() {
    const state = reactive({
      isSubmitting: false,
      form: {email: "",},
      errorMessage: {},
    });

    const checkInput = () => {
      let result = true;

      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

      state.errorMessage = {};

      if (state.form.email.length === 0) {
        state.errorMessage.email = "이메일을 입력해주세요.";
        result = false;

      } else if (!EMAIL_PATTERN.test(state.form.email)) {
        state.errorMessage.email = "유효한 이메일을 입력해주세요.";
        result = false;
      }

      return result;
    };

    const findPassword = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axiosInstance.post("/api/user/find-password", state.form).then(() => {
          window.alert("입력하신 이메일로 비밀번호 재설정 안내 메일이 발송되었습니다. 비밀번호를 재설정 후 다시 로그인해주세요.");
          router.push('/login');

        }).catch(() => {
          // axiosInstance 에서 처리

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    };

    return {
      state,
      findPassword
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/login/login-password-find";
</style>

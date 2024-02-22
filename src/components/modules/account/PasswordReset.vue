<template>
  <div class="reset-password">
    <div class="title">비밀번호 변경</div>

    <div class="content">
      <form @submit.prevent="resetPassword">
        <div class="new-password-field" :class="{ 'input-error': state.errorMessage.newPassword }">
          <input :type="newPasswordFieldType" class="input-field" id="new-password" placeholder="새 비밀번호"
                 v-model="state.form.newPassword" autocomplete="new-password" />
          <i class="bi" :class="newPasswordIconClass" @click="togglePasswordVisibility('new')"></i>
        </div>
        <div class="error-message" v-if="state.errorMessage.newPassword">{{ state.errorMessage.newPassword }}</div>

        <div class="new-password-confirm-field" :class="{ 'input-error': state.errorMessage.newPasswordConfirm }">
          <input :type="newPasswordConfirmFieldType" class="input-field" id="new-password-confirm"
                 placeholder="새 비밀번호 재입력"
                 v-model="state.form.newPasswordConfirm" autocomplete="new-password" />
          <i class="bi" :class="newPasswordConfirmIconClass" @click="togglePasswordVisibility('newConfirm')"></i>
        </div>
        <div class="error-message"
             v-if="state.errorMessage.newPasswordConfirm">{{ state.errorMessage.newPasswordConfirm }}
        </div>

        <button class="button btn-reset-password" type="submit" :disabled="state.isSubmitting">변경하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import router from "@/scripts/router";
import axiosInstance from "@/scripts/axiosInstance";
import {useRoute} from "vue-router";
import axios from "axios";

export default {
  name: "ResetPassword",
  setup() {
    const route = useRoute();
    const passwordResetToken = route.params.token;
    const state = reactive({
      isValid: false,
      isSubmitting: false,
      passwordVisible: {new: false, newConfirm: false},
      form: {newPassword: "", newPasswordConfirm: "",},
      errorMessage: {},
    });

    const newPasswordFieldType = computed(() => state.passwordVisible.new ? 'text' : 'password');
    const newPasswordConfirmFieldType = computed(() => state.passwordVisible.newConfirm ? 'text' : 'password');
    const newPasswordIconClass = computed(() => state.passwordVisible.new ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    const newPasswordConfirmIconClass = computed(() => state.passwordVisible.newConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill');

    const togglePasswordVisibility = (type) => {
      state.passwordVisible[type] = !state.passwordVisible[type];
    };

    const checkInput = () => {
      const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      state.errorMessage = {};
      let result = true;

      if (state.form.newPassword.length === 0) {
        state.errorMessage.newPassword = "새 비밀번호를 입력해주세요.";
        result = false;
      } else if (!PASSWORD_PATTERN.test(state.form.newPassword)) {
        state.errorMessage.newPassword = "새 비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다.";
        result = false;
      }

      if (state.form.newPasswordConfirm.length === 0) {
        state.errorMessage.newPasswordConfirm = "새 비밀번호를 재입력해주세요.";
        result = false;
      } else if (state.form.newPassword !== state.form.newPasswordConfirm) {
        state.errorMessage.newPasswordConfirm = "새 비밀번호가 일치하지 않습니다.";
        result = false;
      }

      return result;
    };

    const resetPassword = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        const args = {
          token: passwordResetToken,
          password: state.form.newPassword
        };

        axiosInstance.post("/api/user/reset-password", args).then(() => {
          window.alert("비밀번호가 재설정되었습니다.");
          router.push({name: 'Home'});

        }).catch(() => {
          // axiosInstance 에서 처리

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    };

    onMounted(() => {

      axios.get(`/api/user/verify-password-reset-token/${passwordResetToken}`).then(() => {
        state.isValid = true;

      }).catch(() => {
        state.isValid = false;
        window.alert('페이지가 유효하지 않습니다.');
        router.push({ path: "/" });
      });
    });

    return {
      state,
      newPasswordFieldType, newPasswordConfirmFieldType,
      newPasswordIconClass, newPasswordConfirmIconClass,
      togglePasswordVisibility,
      resetPassword
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/account/password-reset";
</style>

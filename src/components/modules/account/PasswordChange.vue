<template>
  <div class="change-password">
    <div class="title">비밀번호 변경</div>

    <div class="content">
      <form @submit.prevent="changePassword">
        <div class="current-password-field" :class="{ 'input-error': state.errorMessage.currentPassword }">
          <input :type="currentPasswordFieldType" class="input-field" id="current-password" placeholder="현재 비밀번호"
                 v-model="state.form.currentPassword" autocomplete="current-password" />
          <i class="bi" :class="currentPasswordIconClass" @click="togglePasswordVisibility('current')"></i>
        </div>
        <div class="error-message" v-if="state.errorMessage.currentPassword">{{ state.errorMessage.currentPassword }}
        </div>

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

        <button type="submit" class="button btn-change-password" :disabled="state.isSubmitting">변경하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import router from "@/scripts/router";
import axiosInstance from "@/scripts/axiosInstance";
import axios from "axios";

export default {
  name: "ChangePassword",
  setup() {
    const state = reactive({
      isSubmitting: false,
      passwordVisible: {current: false, new: false, newConfirm: false},
      form: {currentPassword: "", newPassword: "", newPasswordConfirm: "",},
      errorMessage: {},
    });

    const currentPasswordFieldType = computed(() => state.passwordVisible.current ? 'text' : 'password');
    const newPasswordFieldType = computed(() => state.passwordVisible.new ? 'text' : 'password');
    const newPasswordConfirmFieldType = computed(() => state.passwordVisible.newConfirm ? 'text' : 'password');
    const currentPasswordIconClass = computed(() => state.passwordVisible.current ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    const newPasswordIconClass = computed(() => state.passwordVisible.new ? 'bi-eye-fill' : 'bi-eye-slash-fill');
    const newPasswordConfirmIconClass = computed(() => state.passwordVisible.newConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill');

    const togglePasswordVisibility = (type) => {
      state.passwordVisible[type] = !state.passwordVisible[type];
    };

    const checkInput = () => {
      const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      state.errorMessage = {};
      let result = true;

      if (state.form.currentPassword.length === 0) {
        state.errorMessage.currentPassword = "현재 비밀번호를 입력해주세요.";
        result = false;
      }

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

    const changePassword = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axiosInstance.post("/api/user/change-password", state.form).then(() => {
          window.alert("비밀번호가 변경되었습니다.");
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

    const load = () => {
      // 사용자 계정의 인증 서비스 확인
      axios.get('/api/user/check-local-user').then(({data}) => {
        if (!data) {
          window.alert('비밀번호 변경 기능은 로컬 계정 사용자만 이용할 수 있습니다.\n소셜 미디어 계정으로 로그인한 경우, 로컬 계정으로 전환하거나 새로운 로컬 계정을 생성해주세요.');
          history.back();
        }

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        history.back();
      });
    };

    onMounted(load);

    return {
      state,
      currentPasswordFieldType, newPasswordFieldType, newPasswordConfirmFieldType,
      currentPasswordIconClass, newPasswordIconClass, newPasswordConfirmIconClass,
      togglePasswordVisibility,
      changePassword
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/account/password-change";
</style>

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

        <button class="button btn-change-password" type="submit" :disabled="state.isSubmitting">변경하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, reactive} from "vue";
import router from "@/scripts/router";
import axiosInstance from "@/scripts/axiosInstance";

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
          router.push({path: "/"});
          window.alert("비밀번호가 변경되었습니다.");

        }).finally(() => {
          state.isSubmitting = false;
        });

        // axios.post("/api/user/change-password", state.form).then(() => {
        //   router.push({path: "/"});
        //   window.alert("비밀번호가 변경되었습니다.");
        //
        // }).catch(error => {
        //   if (error.response) {
        //     switch (error.response.status) {
        //       case 400:
        //         window.alert(error.response.data.message);
        //         break;
        //       case 404:
        //         window.alert(error.response.data.message);
        //         break;
        //       default:
        //         window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        //     }
        //   } else {
        //     // 네트워크 오류 또는 기타 오류를 처리하는 로직
        //     window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        //   }
        // });
      } else {
        state.isSubmitting = false;
      }
    };

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

<style scoped>
.change-password {
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

.current-password-field, .new-password-field, .new-password-confirm-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.current-password-field .bi, .new-password-field .bi, .new-password-confirm-field .bi {
  margin: 0 10px; /* Add some space around the icons */
  color: #545454;
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
  border: none;
  margin-top: 10px;
}

.btn-change-password {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

.input-error {
  border: 1px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}
</style>

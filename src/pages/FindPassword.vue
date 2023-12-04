<template>
  <div class="find-password">
    <div class="title">비밀번호 찾기</div>
    <div class="content">

      <form @submit.prevent="findPassword">
        <p>계정과 연결된 이메일을 입력하시면 임시 비밀번호를 전송해 드립니다.</p>

        <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
          <input type="text" class="input-field" id="email" placeholder="이메일" autocomplete="email" v-model="state.form.email"/>
        </div>
        <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>

        <button class="button btn-find-password" type="submit" :disabled="state.isSubmitting">전송</button>
      </form>
    </div>

  </div>
</template>

<script>
import {reactive} from "vue";
import router from "@/scripts/router";
import axiosInstance from "@/scripts/axiosInstance";

export default {
  name: "RecoverPassword",
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
        axiosInstance.post("/api/user/recover", state.form).then((response) => {

          if (response.data === "Success") {
            alert("입력하신 이메일로 임시 비밀번호가 발송되었습니다.");
            router.push('/login');

          } else if (response.data === "Failure") {
            alert("일치하는 정보가 없습니다.");

          } else if (response.data === "EmailSendFailure") {
            alert("이메일 전송에 실패하였습니다. 다시 시도해주세요.");
          }

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

<style scoped>
.find-password {
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

.email-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
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

.btn-find-password {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  margin-top: 10px;
}

p {
  font-size: .75rem; /* 12px */
}

.input-error {
  border: 1px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}
</style>

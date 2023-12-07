<template>
  <div class="edit-profile">
    <div class="title">회원 정보 변경</div>

    <div class="content">
      <form @submit.prevent="editProfile">
        <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
          <input type="text" class="input-field" id="email" placeholder="이메일" autocomplete="email"
                 :value="state.form.email" disabled />
        </div>
        <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>

        <div class="name-field" :class="{ 'input-error': state.errorMessage.name }">
          <input type="text" class="input-field" id="name" placeholder="이름" autocomplete="name"
                 v-model="state.form.name" />
        </div>
        <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>

        <!-- 추가 -->
        <div class="phone-number-field" :class="{ 'input-error': state.errorMessage.phoneNumber }">
          <input type="tel" class="input-field" id="phoneNumber" placeholder="전화번호" autocomplete="tel"
                 v-model="state.form.phoneNumber" />
        </div>
        <div class="error-message" v-if="state.errorMessage.phoneNumber">{{ state.errorMessage.phoneNumber }}</div>

        <!--        <div class="password-field" :class="{ 'input-error': state.errorMessage.password }">-->
        <!--          <input :type="passwordFieldType" class="input-field" id="password" placeholder="비밀번호"-->
        <!--                 autocomplete="current-password"-->
        <!--                 @keyup.enter="editProfile" v-model="state.form.password"/>-->
        <!--          <i class="bi" :class="passwordIconClass" @click="togglePasswordVisibility"></i>-->
        <!--        </div>-->
        <!--        <div class="error-message" v-if="state.errorMessage.password">{{ state.errorMessage.password }}</div>-->

        <button class="button btn-edit" type="submit" :disabled="state.isSubmitting">변경하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import store from "@/scripts/store";

export default {
  name: "EditProfile",
  props: ['user'],
  setup() {
    const passwordVisible = ref(false);
    const state = reactive({
      isSubmitting: false,
      form: {},
      errorMessage: {},
    })

    const passwordFieldType = computed(() => passwordVisible.value ? 'text' : 'password');
    const passwordIconClass = computed(() => passwordVisible.value ? 'bi-eye-fill' : 'bi-eye-slash-fill');

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const load = () => {
      const id = store.state.account.id;

      axios.get(`/api/user/${id}`).then(({data}) => {
        state.form = data;
      })
    };

    const checkInput = () => {
      let result = true;

      const MAX_NAME_LENGTH = 20;
      const PHONE_PATTERN = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

      state.errorMessage = {};

      if (!state.form.name || state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > MAX_NAME_LENGTH) {
        state.errorMessage.name = "이름은 20자 이하로 입력해주세요.";
        result = false;
      }

      if (state.form.phoneNumber) {
        if (!PHONE_PATTERN.test(state.form.phoneNumber)) {
          state.errorMessage.phoneNumber = "유효한 전화번호를 입력해주세요.";
          result = false;
        }
      }

      return result;
    }

    const editProfile = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axios.post("/api/user/change-profile", state.form).then(() => {
          load();
          window.alert("회원 정보가 변경되었습니다.");

        }).catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 400:
                window.alert(error.response.data.message);
                break;
              case 404:
                window.alert(error.response.data.message);
                break;
              default:
                window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
          } else {
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    }

    onMounted(load);

    return {
      state,
      passwordFieldType, passwordIconClass,
      togglePasswordVisibility,
      editProfile,
    }
  },
}
</script>

<style scoped>
.edit-profile {
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

.email-field, .name-field, .phone-number-field, .password-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.email-field {
  background-color: #f1f1f1; /* 필드 자체의 배경색 */
}

.password-field .bi {
  margin: 0 10px; /* Add some space around the icons */
  color: #545454;
}

.password-field input {
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
  border: none;
  margin-top: 10px;
}

.btn-edit {
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

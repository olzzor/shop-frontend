<template>
  <div class="profile-edit">
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
        <button class="button btn-withdraw" type="button" @click="withdraw">탈퇴하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";

export default {
  name: "ProfileEdit",
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

    const withdraw = () => {
      const message = '회원 탈퇴를 진행하시면 모든 개인 데이터 및 주문 내역이 영구적으로 삭제됩니다. 정말로 탈퇴하시겠습니까?';

      if (window.confirm(message)) {
        axios.post("/api/user/withdraw").then(() => {
          alert('탈퇴되었습니다.');
          store.commit('setToken', 0);
          store.commit('setAccountId', 0);
          store.commit('setAccountRole', '');
          router.push({name: 'Home'});
        });
      }
    };

    onMounted(load);

    return {
      state,
      passwordFieldType, passwordIconClass,
      togglePasswordVisibility,
      editProfile,
      withdraw,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/account/profile-edit";
</style>

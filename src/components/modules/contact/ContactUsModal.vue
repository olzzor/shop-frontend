<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <form @submit.prevent="inquiry">

      <div class="product-inquiry-title" v-if="isProductInquiry">
        <span>{{state.form.product.name}}</span>
        <i class="bi" :class="privateIconClass" @click="togglePrivate"></i>
      </div>

      <div class="inquirer-email-field" :class="{ 'input-error': state.errorMessage.inquirerEmail }">
        <input type="text" class="input-field" id="inquirer-email" placeholder="이메일" autocomplete="email"
               v-model="state.form.inquirerEmail"/>
      </div>
      <div class="error-message" v-if="state.errorMessage.inquirerEmail">{{ state.errorMessage.inquirerEmail }}</div>

      <div class="inquirer-name-field" :class="{ 'input-error': state.errorMessage.inquirerName }">
        <input type="text" class="input-field" id="inquirer-name" placeholder="이름" autocomplete="name"
               v-model="state.form.inquirerName"/>
      </div>
      <div class="error-message" v-if="state.errorMessage.inquirerName">{{ state.errorMessage.inquirerName }}</div>


      <div class="order-number-field" :class="{ 'input-error': state.errorMessage.orderNumber }">
        <input type="text" class="input-field" id="order-number" placeholder="주문번호"
               v-model="state.form.orderNumber" />
      </div>
      <div class="error-message" v-if="state.errorMessage.orderNumber">{{ state.errorMessage.orderNumber }}</div>

      <div class="type-field" :class="{ 'input-error': state.errorMessage.type }">
        <select class="select-field" v-model="state.form.type">
          <option class="default-option" disabled value="">문의 사항을 선택해주세요.</option>
          <option v-for="ct in contactTypes" :key="ct.key" :value="ct.key">{{ ct.description }}</option>
        </select>
      </div>
      <div class="error-message" v-if="state.errorMessage.type">{{ state.errorMessage.type }}</div>

      <div class="title-field" :class="{ 'input-error': state.errorMessage.title }">
        <input type="text" class="input-field" id="inquiry-title" placeholder="문의 제목"
               v-model="state.form.title">
      </div>
      <div class="error-message" v-if="state.errorMessage.title">{{ state.errorMessage.title }}</div>

      <div class="content-field" :class="{ 'input-error': state.errorMessage.content }">
        <textarea class="input-field" id="inquiry-content" placeholder="문의 내용" v-model="state.form.content" />
      </div>
      <div class="error-message" v-if="state.errorMessage.content">{{ state.errorMessage.content }}</div>

      <div class="announce-message">
        <b>고객지원</b><br>
        <a href="mailto:support@bridge.co.kr">support@bridge.co.kr</a><br><br>
        <b>온라인 고객지원 운영시간</b><br>
        월요일–금요일 오전 8시부터 오후 4시까지 문의해 주시기 바랍니다.<br>
        *공휴일 제외
      </div>

      <div class="actions">
        <button type="submit" class="button btn-inquiry" :disabled="state.isSubmitting">문의</button>
        <button type="button" class="button btn-cancel" @click="close">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import store from "@/scripts/store";
import axios from "axios";
import constants from "@/scripts/constants";

export default {
  name: "ContactUsModal",
  props: {
    show: Boolean,
    product: Object, type: String, // 상품 문의용
  },
  emits: ['close'],
  setup(props, {emit}) {
    const contactTypes = constants.CONTACT_TYPES;
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const state = reactive({
      isSubmitting: false,
      show: true,
      form: {
        inquirerEmail: "",
        inquirerName: "",
        orderNumber: "",
        product: props.product || {id:0, name:''},
        type: props.type || "",
        title: "",
        content: "",
        isPrivate: true,
      },
      errorMessage: {},
    });

    const isProductInquiry = computed(() => state.form.type === 'PRODUCT_INFO');
    const privateIconClass = computed(() => state.form.isPrivate ? 'bi-lock' : 'bi-unlock');

    const togglePrivate = () => {
      state.form.isPrivate = !state.form.isPrivate;
    };

    const initUser = (data) => {
      state.form.inquirerEmail = data.email;
      state.form.inquirerName = data.name;
    };

    const checkInput = () => {
      let result = true;

      const MAX_NAME_LENGTH = 20;
      const MAX_TITLE_LENGTH = 100;
      const MAX_CONTENT_LENGTH = 5000;
      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

      state.errorMessage = {};

      if (state.form.inquirerName.length === 0) {
        state.errorMessage.inquirerName = "이름을 입력해주세요.";
        state.hasError = false;
      } else if (state.form.inquirerName.length > MAX_NAME_LENGTH) {
        state.errorMessage.inquirerName = `이름은 ${MAX_NAME_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      if (state.form.inquirerEmail.length === 0) {
        state.errorMessage.inquirerEmail = "이메일을 입력해주세요.";
        result = false;
      } else if (!EMAIL_PATTERN.test(state.form.inquirerEmail)) {
        state.errorMessage.inquirerEmail = "유효한 이메일을 입력해주세요.";
        result = false;
      }

      if (state.form.type.length === 0) {
        state.errorMessage.type = "문의 사항을 선택해주세요.";
        result = false;
      }

      if (state.form.title.length === 0) {
        state.errorMessage.title = "제목을 입력해주세요.";
        result = false;
      } else if (state.form.title.length > MAX_TITLE_LENGTH) {
        state.errorMessage.title = `제목은 ${MAX_TITLE_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      if (state.form.content.length === 0) {
        state.errorMessage.content = "내용을 입력해주세요.";
        result = false;
      } else if (state.form.content.length > MAX_CONTENT_LENGTH) {
        state.errorMessage.content = `내용은 ${MAX_CONTENT_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      return result;
    };

    const inquiry = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axios.post('/api/contact/inquiry', state.form).then(() => {
          window.alert('문의되었습니다.');
          close();
          emit('updated');

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
    };

    const load = () => {
      axios.get(`/api/user/get`).then(({data}) => {
        initUser(data);

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    };

    const close = () => {
      state.show = false;
      emit('close');
    };

    onMounted(() => {
      if (isLoggedIn.value) { // 로그인한 사용자의 경우에만 사용자 정보를 불러옴
        load();
      }
    });

    return {
      store,
      contactTypes, state, isProductInquiry, privateIconClass,
      togglePrivate, inquiry, close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/contact/contact-us-modal";
</style>
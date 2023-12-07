<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <form @submit.prevent="inquiry">

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
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
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
        <button class="button btn-inquiry" type="submit">문의</button>
        <button class="button btn-cancel" type="button" @click="close">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import store from "@/scripts/store";
import axios from "axios";

export default {
  name: "ContactUsModal",
  props: {show: Boolean},
  emits: ['close'],
  setup(props, {emit}) {
    const types = ['주문 상태', '반품', '주소 변경', '배송 조회', '오류 문의', '기타'];

    const state = reactive({
      show: true,
      form: {inquirerEmail: "", inquirerName: "", orderNumber: "", type: "", title: "", content: "",},
      errorMessage: {},
    })

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
        state.errorMessage.inquirerName = "이름은 20자 이하로 입력해주세요.";
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
        state.errorMessage.title = "제목은 100자 이하로 입력해주세요.";
        result = false;
      }

      if (state.form.content.length === 0) {
        state.errorMessage.content = "내용을 입력해주세요.";
        result = false;
      } else if (state.form.content.length > MAX_CONTENT_LENGTH) {
        state.errorMessage.content = "내용은 5,000자 이하로 입력해주세요.";
        result = false;
      }

      return result;
    };

    const inquiry = () => {
      if (checkInput()) {
        axios.post('/api/contact/inquiry', state.form).then(() => {
          window.alert('문의되었습니다.');
          close();
          emit('updated');

        }).catch(error => {
          if (error.response && error.response.status === 401) {
            window.alert('로그인 후 문의해주세요.');
          } else {
            window.alert('문의 중 오류가 발생했습니다. 다시 시도해주세요.');
          }
        });
      }
    };

    const load = () => {
      axios.get(`/api/user/get`).then(({data}) => {
        initUser(data);

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              window.alert(error.response.data.message);
              break;
            default:
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
      });
    };

    const close = () => {
      state.show = false;
      emit('close');
    };

    onMounted(load);

    return {
      store,
      types, state,
      inquiry, close,
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검은색의 70% 투명도 */
  z-index: 999; /* 모달보다 하나 낮은 z-index */
}

.modal-content {
  position: fixed;
  top: 50%; /* 화면의 중앙에서 시작 */
  left: 50%; /* 화면의 중앙에서 시작 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 변환 */
  z-index: 1000;
  max-width: 600px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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

.select-field {
  border: none;
  outline: none;
  width: 100%;
  height: 30px;
  font-size: .75rem;
}

.default-option {
  color: #757587; /* placeholder 색상 */
}

.inquirer-email-field, .inquirer-name-field, .order-number-field, .title-field, .content-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.type-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 8px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.content-field textarea.input-field {
  height: 150px; /* 원하는 높이값으로 조정하세요 */
}

.announce-message {
  margin-top: 10px;
  font-size: .75rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 10px;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  width: 49%;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  border-radius: 5px;
  border: none;
}

.btn-inquiry {
  background-color: black;
  border-color: black;
  color: white;
  transition-property: color, background-color;
}

.btn-cancel {
  background-color: white;
  color: black;
  border: 0.0625rem solid #000;
  display: block;
}

.input-error {
  border: 1px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}

a {
  color: #000000;
}
</style>
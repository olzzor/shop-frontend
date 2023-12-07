<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <div class="recipient-info">
      <label for="name">수령인</label>
      <div class="name-field" :class="{ 'input-error': state.errorMessage.name }">
        <input type="text" class="input-field" id="name" placeholder="이름" autocomplete="name"
               v-model="state.form.name" @input="trimInput('name')" @keyup.enter="addAddress">
      </div>
      <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>

      <div class="phone-field" :class="{ 'input-error': state.errorMessage.phoneNumber }">
        <input type="tel" class="input-field" id="phone-number" placeholder="전화번호" autocomplete="tel"
               v-model="state.form.phoneNumber" @input="trimInput('phoneNumber')" @keyup.enter="addAddress">
      </div>
      <div class="error-message" v-if="state.errorMessage.phoneNumber">{{ state.errorMessage.phoneNumber }}</div>
    </div>

    <div class="address-info">
      <div class="address-label-container">
        <label for="address1">주소</label>
        <button class="btn-search-address" type="button" @click="searchAddress">주소 찾기</button>
      </div>

      <div class="zipcode-field" :class="{ 'input-error': state.errorMessage.zipCode }">
        <input type="text" class="input-field" id="zipCode" placeholder="우편번호" autocomplete="postal-code"
               v-model="state.form.zipCode" disabled>
      </div>
      <div class="error-message" v-if="state.errorMessage.zipCode">{{ state.errorMessage.zipCode }}</div>

      <div class="address1-field" :class="{ 'input-error': state.errorMessage.address1 }">
        <input type="text" class="input-field" id="address1" placeholder="주소" autocomplete="address-line1"
               v-model="state.form.address1" disabled>
      </div>
      <div class="error-message" v-if="state.errorMessage.address1">{{ state.errorMessage.address1 }}</div>

      <div class="address2-field" :class="{ 'input-error': state.errorMessage.address2 }">
        <input type="text" class="input-field" id="address2" placeholder="아파트, 동/호수 등" autocomplete="address-line2"
               v-model="state.form.address2" @input="trimInput('address2')" @keyup.enter="addAddress">
      </div>
      <div class="error-message" v-if="state.errorMessage.address2">{{ state.errorMessage.address2 }}</div>
    </div>

    <label class="checkbox-wrapper" @click="state.form.isDefault = !state.form.isDefault">
      <i v-if="state.form.isDefault" class="bi bi-check-square-fill"></i>
      <i v-else class="bi bi-square"></i>
      기본 주소로 설정
    </label>

    <div class="actions">
      <button class="button btn-add" type="button" @click="addAddress">추가</button>
      <button class="button btn-cancel" type="button" @click="close">취소</button>
    </div>
  </div>

</template>

<script>
import {reactive} from "vue";
import axios from "axios";

export default {
  name: "AddAddressModal",
  props: {show: Boolean},
  emits: ['close'],
  setup(props, {emit}) {
    const state = reactive({
      form: {
        name: "",
        phoneNumber: "",
        zipCode: "",
        province: "",
        city: "",
        address1: "",
        address2: "",
        isApartment: false,
        isDefault: false
      },
      errorMessage: {},
      show: true,
    })

    const trimInput = (key) => {
      state.form[key] = state.form[key].trim();
    };

    const searchAddress = () => {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const {userSelectedType, zonecode, sido, sigungu, roadAddress, jibunAddress, apartment} = data;

          state.form.zipCode = zonecode;
          state.form.province = sido;
          state.form.city = sigungu;
          state.form.address1 = (userSelectedType === 'R') ? roadAddress : jibunAddress;
          state.form.isApartment = (apartment === 'Y') ? true : false;
        },
      }).open();
    };

    const checkInput = () => {
      let result = true;

      const PHONE_PATTERN = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

      state.errorMessage = {};

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > 10) {
        state.errorMessage.name = "이름은 10자 이하 입력해주세요.";
        result = false;
      }

      if (state.form.phoneNumber.length === 0) {
        state.errorMessage.phoneNumber = "전화번호를 입력해주세요.";
        result = false;
      } else if (!PHONE_PATTERN.test(state.form.phoneNumber)) {
        state.errorMessage.phoneNumber = "유효한 전화번호를 입력해주세요.";
        result = false;
      }

      if (state.form.zipCode.length === 0 || state.form.address1.length === 0) {
        state.errorMessage.zipCode = "주소 찾기를 통해 주소를 입력해주세요.";
        state.errorMessage.address1 = "주소 찾기를 통해 주소를 입력해주세요.";
        result = false;
      }

      if (state.form.isApartment && state.form.address2.length === 0) {
        state.errorMessage.address2 = "공동주택의 경우, 아파트, 동/호수 정보를 입력해주세요.";
        result = false;
      }

      return result;
    };

    const addAddress = () => {
      if (checkInput()) {
        axios.post("api/address/add", state.form).then(() => {
          window.alert("주소가 추가되었습니다.");
          close();
          emit('updated');

        }).catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
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
        });
      }
    };

    const close = () => {
      state.show = false;
      emit('close');
    };

    return {
      state,
      trimInput, checkInput,
      searchAddress, addAddress,
      close,
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

.recipient-info, .address-info {
  margin-bottom: 20px;
}

.checkbox-wrapper {
  font-size: .75rem;
}

.address-label-container {
  display: flex;
  align-items: center;
}

.name-field, .phone-field, .zipcode-field, .address1-field, .address2-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.zipcode-field, .address1-field {
  background-color: #f1f1f1; /* 필드 자체의 배경색 */
}

.input-error {
  border: 1px solid #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}

.btn-search-address {
  background-color: #000; /* 버튼의 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양 변경 */
  font-size: 0.8rem;
  text-align: center;
  width: 85px;
  height: 28px;
  line-height: 28px;
  margin-left: 1rem;
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
  border: none; /* 테두리 제거 */
}

.btn-add {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  display: block;
}

.btn-cancel {
  background-color: white;
  color: black;
  border: 0.0625rem solid #000;
  display: block;
}
</style>

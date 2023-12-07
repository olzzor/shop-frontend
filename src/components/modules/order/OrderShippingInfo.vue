<template>
  <div class="shipping-info">
    <div class="title"></div>

    <div class="content">
      <div class="contact-info">
        <label for="email">연락처</label>
        <div class="email-field" :class="{ 'input-error': state.errorMessage.email }">
          <input type="email" class="input-field" id="email" placeholder="이메일" autocomplete="email"
                 v-model="state.form.email" @keyup.enter="invokeOrder">
        </div>
        <div class="error-message" v-if="state.errorMessage.email">{{ state.errorMessage.email }}</div>
      </div>

      <div class="recipient-info">
        <label for="name">수령인</label>
        <button v-if="state.defaultAddress.id" class="btn-set-default-address" type="button"
                @click="setDefaultAddress">
          기본 주소지 설정
        </button>

        <div class="name-field" :class="{ 'input-error': state.errorMessage.name }">
          <input type="text" class="input-field" id="name" placeholder="이름" autocomplete="name"
                 v-model="state.form.name" @keyup.enter="invokeOrder">
        </div>
        <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>

        <div class="phone-field" :class="{ 'input-error': state.errorMessage.phone }">
          <input type="tel" class="input-field" id="phone" placeholder="전화번호" autocomplete="tel"
                 v-model="state.form.phone" @keyup.enter="invokeOrder">
        </div>
        <div class="error-message" v-if="state.errorMessage.phone">{{ state.errorMessage.phone }}</div>
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
                 v-model="state.form.address2" @keyup.enter="invokeOrder">
        </div>
        <div class="error-message" v-if="state.errorMessage.address2">{{ state.errorMessage.address2 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";

export default {
  name: "ShippingInfo",
  setup(props, {emit}) {
    const state = reactive({
      defaultAddress: {},
      form: {email: "", name: "", zipCode: "", province: "", city: "", address1: "", address2: "", phone: "",},
      errorMessage: {},
      isApartment: false,
    })

    const invokeOrder = () => {
      // 부모 컴포넌트 (Order.vue)에 이벤트 발행
      emit('do-order');
    };

    const searchAddress = () => {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const {userSelectedType, zonecode, sido, sigungu, roadAddress, jibunAddress, apartment} = data;

          state.form.zipCode = zonecode;
          state.form.province = sido;
          state.form.city = sigungu;
          state.form.address1 = (userSelectedType === 'R') ? roadAddress : jibunAddress;
          state.isApartment = (apartment === 'Y') ? true : false;
        },
      }).open();
    };

    const getAddress = () => {
      return {
        email: state.form.email,
        name: state.form.name,
        zipCode: state.form.zipCode,
        province: state.form.province,
        city: state.form.city,
        address1: state.form.address1,
        address2: state.form.address2,
        phone: state.form.phone,
      }
    };

    const setDefaultAddress = () => {
      state.isApartment = state.defaultAddress.apartment;

      state.form.name = state.defaultAddress.name;
      state.form.phone = state.defaultAddress.phoneNumber;
      state.form.zipCode = state.defaultAddress.zipCode;
      state.form.province = state.defaultAddress.province;
      state.form.city = state.defaultAddress.city;
      state.form.address1 = state.defaultAddress.address1;
      state.form.address2 = state.defaultAddress.address2;
    };

    const checkInput = () => {
      let result = true;

      const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
      const PHONE_PATTERN = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

      state.errorMessage = {};

      if (state.form.email.length === 0) {
        state.errorMessage.email = "이메일을 입력해주세요.";
        result = false;
      } else if (!EMAIL_PATTERN.test(state.form.email)) {
        state.errorMessage.email = "유효한 이메일을 입력해주세요.";
        result = false;
      }

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        state.hasError = false;
      } else if (state.form.name.length > 10) {
        state.errorMessage.name = "이름은 10자 이하 입력해주세요.";
        result = false;
      }

      if (state.form.phone.length === 0) {
        state.errorMessage.phone = "전화번호를 입력해주세요.";
        result = false;
      } else if (!PHONE_PATTERN.test(state.form.phone)) {
        state.errorMessage.phone = "유효한 전화번호를 입력해주세요.";
        result = false;
      }

      if (state.form.zipCode.length === 0 || state.form.address1.length === 0) {
        state.errorMessage.zipCode = "주소 찾기를 통해 주소를 입력해주세요.";
        state.errorMessage.address1 = "주소 찾기를 통해 주소를 입력해주세요.";
        result = false;
      }

      if (state.isApartment && state.form.address2.length === 0) {
        state.errorMessage.address2 = "공동주택의 경우, 아파트, 동/호수 정보를 입력해주세요.";
        result = false;
      }

      return result;
    };

    const getUserEmail = () => {
      axios.get("/api/user/email").then(({data}) => {
        state.form.email = data;
      });
    };

    const getDefaultAddress = () => {
      axios.get("/api/address/default").then(({data}) => {
        state.defaultAddress = data;
      });
    };

    const load = () => {
      getUserEmail();
      getDefaultAddress();
    };

    onMounted(load);

    return {
      state,
      setDefaultAddress, searchAddress, getAddress,
      checkInput, invokeOrder
    };
  }
}
</script>

<style scoped>
.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
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

.contact-info, .recipient-info, .address-info {
  margin-block: 20px;

}

.address-label-container {
  display: flex;
  align-items: center;
}

.name-field, .email-field, .phone-field, .zipcode-field, .address1-field, .address2-field {
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

.select-field {
  border-color: #545454;
  outline: none;
  width: 100%;
  height: 30px;
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

.btn-set-default-address {
  background-color: #000; /* 버튼의 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양 변경 */
  font-size: 0.8rem;
  text-align: center;
  width: 120px;
  height: 28px;
  line-height: 28px;
  margin-left: 1rem;
}
</style>
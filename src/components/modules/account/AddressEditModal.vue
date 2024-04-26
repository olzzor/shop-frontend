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
        <button type="button" class="btn-search-address" @click="searchAddress">주소 찾기</button>
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
      <button type="button" class="button btn-edit" @click="editAddress" :disabled="state.isSubmitting">변경</button>
      <button type="button" class="button btn-cancel" @click="close">취소</button>
    </div>
  </div>

</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";

export default {
  name: "EditAddressModal",
  props: {show: Boolean, addressId: Number},
  emits: ['close'],
  setup(props, {emit}) {
    const state = reactive({
      isSubmitting: false,
      form: {
        id: 0,
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

    const initAddress = (data) => {
      state.form.id = data.id;
      state.form.name = data.name;
      state.form.phoneNumber = data.phoneNumber;
      state.form.zipCode = data.zipCode;
      state.form.province = data.province;
      state.form.city = data.city;
      state.form.address1 = data.address1;
      state.form.address2 = data.address2;
      state.form.isApartment = data.isApartment;
      state.form.isDefault = data.isDefault;
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

      const MAX_NAME_LENGTH = 10;
      const PHONE_PATTERN = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

      state.errorMessage = {};

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > MAX_NAME_LENGTH) {
        state.errorMessage.name = `이름은 ${MAX_NAME_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
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

    const editAddress = () => {
      state.isSubmitting = true;

      if (checkInput()) {
        axios.post("api/address/edit", state.form).then(() => {
          window.alert("주소가 변경되었습니다.");
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

    const close = () => {
      state.show = false;
      emit('close');
    };

    const load = () => {
      axios.get(`/api/address/get/${props.addressId}`).then(({data}) => {
        initAddress(data);

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    };

    onMounted(load);

    return {
      state,
      load,
      trimInput, checkInput,
      searchAddress, editAddress,
      close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/account/address-edit-modal";
</style>

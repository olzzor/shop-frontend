<template>
  <div class="coupon-regist">
    <div class="title">
      <p>쿠폰 등록</p>
      <button type="button" class="btn-create-coupon" @click="createCoupon">등록하기</button>
    </div>

    <div class="content">
      <table>
        <tbody>
        <tr>
          <td colspan="2" class="table-title">유형</td>
          <td>
            <select class="select-field" v-model="state.form.type"
                    :class="{ 'input-error': state.errorMessage.type }" @keyup.enter="createCoupon">
              <option v-for="ct in couponTypes" :key="ct" :value="ct">
                {{ lib.getCouponTypeName(ct) }}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">코드</td>
          <td>
            <input type="text" class="input-field" id="code"
                   :class="{ 'input-error': state.errorMessage.code }" v-model="state.form.code"
                   @keyup.enter="createCoupon"/>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">이름</td>
          <td>
            <input type="text" class="input-field" id="name"
                   :class="{ 'input-error': state.errorMessage.name }" v-model="state.form.name"
                   @keyup.enter="createCoupon"/>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">설명</td>
          <td>
            <textarea class="input-field" id="coupon-detail"
                      :class="{ 'input-error': state.errorMessage.detail }" v-model="state.form.detail"
                      @input="autoGrow"/>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">쿠폰 적용 최소 금액</td>
          <td>
            <input type="number" min="0" class="input-field" id="minAmount"
                   :class="{ 'input-error': state.errorMessage.minAmount }" v-model.number="state.form.minAmount"
                   @keyup.enter="createCoupon"/>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">할인</td>
          <td>
            <div class="discount-wrapper">
              <select class="select-field" v-model="state.form.discountType"
                      :class="{ 'input-error': state.errorMessage.discountType }" @keyup.enter="createCoupon">
                <option v-for="type in discountTypes" :key="type" :value="type">
                  {{ lib.getDiscountTypeName(type) }}
                </option>
              </select>
              <input type="number" min="0"  class="input-field" v-model.number="state.form.discountValue">
            </div>
          </td>
        </tr>

        <tr>
          <td rowspan="2" class="table-title">대상</td>
          <td class="table-title">
            <input type="radio" v-model="state.targetType" value="CATEGORY"/>카테고리<br>
            <input type="radio" v-model="state.targetType" value="PRODUCT"/>상품
          </td>
          <td class="select-target">
            <div class="target-category" v-if="state.targetType === 'CATEGORY'">
              <input type="checkbox" v-model="selectedAll" @change="toggleAllCategories"/>
              <label><b>전체 선택</b></label>
              <div v-for="cc in categoryCodes" :key="cc">
                <input type="checkbox" :value="cc" v-model="state.form.categories"
                       :class="{ 'input-error': state.errorMessage.target }" @keyup.enter="createCoupon"/>
                <label>{{ lib.getCategoryName(cc) }}</label>
              </div>
            </div>

            <div class="target-product" v-else>
              <div v-for="sp in state.selectedProducts" :key="sp.id">{{ sp.name }}</div>
              <button type="button" class="btn-select-product" @click="showSearchProductModal = true">선택</button>
            </div>
          </td>
        </tr>

        <tr>
          <td class="table-title">유저</td>
          <td class="select-target">
            <div v-for="su in state.selectedUsers" :key="su.id">{{ su.email }}</div>
            <button type="button" class="btn-select-user" @click="showSearchUserModal = true">선택</button>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">유효기간</td>
          <td>
            <div class="date">
              <input type="date" class="input-field date"
                     :class="{ 'input-error': state.errorMessage.startValidDate }" v-model="state.form.startValidDate"
                     @keyup.enter="createCoupon"/>
              &nbsp;~&nbsp;
              <input type="date" class="input-field date"
                     :class="{ 'input-error': state.errorMessage.endValidDate }" v-model="state.form.endValidDate"
                     @keyup.enter="createCoupon"/>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">상태</td>
          <td>
            <select class="select-field" v-model="state.form.status"
                    :class="{ 'input-error': state.errorMessage.status }" @keyup.enter="createCoupon">
              <option v-for="cs in couponStatuses" :key="cs" :value="cs">
                &nbsp;{{ lib.getCouponStatusName(cs) }}
              </option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="error-message" v-if="state.hasError">
        <div class="error-message" v-for="(message, key) in state.errorMessage" :key="key">
          <i class="bi bi-info-circle"></i> {{ message }}
        </div>
      </div>
    </div>
  </div>

  <SearchProductModal :show="showSearchProductModal" @close="showSearchProductModal = false" @product-selected="handleProductSelected"></SearchProductModal>
  <SearchUserModal :show="showSearchUserModal" @close="showSearchUserModal = false" @user-selected="handleUserSelected"></SearchUserModal>

</template>

<script>
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import router from "@/scripts/router";
import lib from "../../../../scripts/lib";
import SearchProductModal from "@/components/modules/admin/coupon/SearchProductModal.vue";
import SearchUserModal from "@/components/modules/admin/coupon/SearchUserModal.vue";

export default {
  name: "CouponRegist",
  components: {SearchProductModal, SearchUserModal},
  setup() {
    const categoryCodes = lib.categoryCodes;
    const discountTypes = lib.discountTypes;
    const couponTypes = lib.couponTypes;
    const couponStatuses = lib.couponStatuses;

    const showSearchProductModal = ref(false);
    const showSearchUserModal = ref(false);
    const state = reactive({
      form: {type: '', code: '', name: '', detail: '', minAmount: 0, discountType: '', discountValue: 0, startValidDate: '', endValidDate: '', categories: [], products: [], users: [], status: '',},
      targetType: 'CATEGORY', // 'CATEGORY' or 'PRODUCT'
      selectedProducts: [],
      selectedUsers: [],
      hasError: false, errorMessage: {},
    });

    const resetState = () => {
      state.form = {
        type: '', code: '', name: '', detail: '', minAmount: 0,
        discountType: '', discountValue: 0,
        startValidDate: '', endValidDate: '',
        categories: [], products: [], users: [],
        status: '',
      };
      state.selectedProducts = [];
      state.selectedUsers = [];
      state.hasError = false;
      state.errorMessage = {};
    };

    const handleProductSelected = (selectedProducts) => {
      if (selectedProducts && selectedProducts.length > 0) { // 선택된 상품이 있을 경우
        state.selectedProducts = selectedProducts.map(selectedProduct => {
          return {
            id: selectedProduct.id,
            name: selectedProduct.name
          };
        });

      } else { // 선택된 사용자가 없거나 취소 버튼을 클릭한 경우
        state.selectedProducts = [];
      }

      state.form.products = state.selectedProducts.map(selectedProduct => selectedProduct.id);
      showSearchProductModal.value = false;
    };

    const handleUserSelected = (selectedUsers) => {
      if (selectedUsers && selectedUsers.length > 0) { // 선택된 사용자가 있을 경우
        state.selectedUsers = selectedUsers.map(selectedUser => {
          return {
            id: selectedUser.id,
            email: selectedUser.email
          };
        });

      } else { // 선택된 사용자가 없거나 취소 버튼을 클릭한 경우
        state.selectedUsers = [];
      }

      state.form.users = state.selectedUsers.map(selectedUser => selectedUser.id);
      showSearchUserModal.value = false;
    };

    const selectedAll = computed({
      get: () => {
        return state.form.categories.length === categoryCodes.length;
      },
      set: (e) => {
        state.form.categories = e ? categoryCodes : [];
      },
    });

    const toggleAllCategories = () => {
      if (selectedAll.value) {
        state.form.categories = [...categoryCodes];
      } else {
        state.form.categories = [];
      }
    };

    const checkInput = () => {
      let result = true;

      const MAX_NAME_LENGTH = 50;
      const MAX_CODE_LENGTH = 50;
      const MAX_DETAIL_LENGTH = 2000;
      const CODE_PATTERN = /^[A-Za-z0-9_]+$/;

      state.errorMessage = {};

      if (!state.form.type) {
        state.errorMessage.type = "유형을 선택해주세요.";
        result = false;
      }

      if (state.form.code.length === 0) {
        state.errorMessage.code = "코드를 입력해주세요.";
        result = false;
      } else if (state.form.code.length > MAX_CODE_LENGTH) {
        state.errorMessage.code = "코드는 50자 이하로 입력해주세요.";
        result = false;
      } else if (!CODE_PATTERN.test(state.form.code)) {
        state.errorMessage.code = "코드는 영문자, 숫자 및 언더바(_)로만 구성되어야 합니다.";
        result = false;
      }

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > MAX_NAME_LENGTH) {
        state.errorMessage.name = "이름은 50자 이하로 입력해주세요.";
        result = false;
      }

      if (state.form.detail.length === 0) {
        state.errorMessage.detail = "설명을 입력해주세요.";
        result = false;
      } else if (state.form.detail.length > MAX_DETAIL_LENGTH) {
        state.errorMessage.detail = "설명은 2000자 이하로 입력해주세요.";
        result = false;
      }

      if (!state.form.minAmount || isNaN(Number(state.form.minAmount))) {
        state.errorMessage.minAmount = "최소 금액을 올바르게 입력해주세요.";
        result = false;
      }

      if (!state.form.discountType) {
        state.errorMessage.discountType = "할인 유형을 선택해주세요.";
        result = false;
      }

      if (state.form.discountValue.length === 0) {
        state.errorMessage.discountValue = "할인 금액 및 할인율을 입력해주세요.";
        result = false;
      }

      // 카테고리, 상품, 유저 중 최소 하나가 선택되었는지 확인
      if (state.form.categories.length === 0 && state.form.products.length === 0 && state.form.users.length === 0) {
        state.errorMessage.target = "카테고리, 상품 또는 유저 중 최소 하나를 선택해야 합니다.";
        result = false;
      }

      if (!state.form.startValidDate) {
        state.errorMessage.startValidDate = "유효 기간의 시작 날짜를 입력해주세요.";
        result = false;
      } else if (!state.form.endValidDate) {
        state.errorMessage.endValidDate = "유효 기간의 종료 날짜를 입력해주세요.";
        result = false;
      } else if (new Date(state.form.startValidDate) > new Date(state.form.endValidDate)) {
        state.errorMessage.endValidDate = "유효 기간의 종료 날짜는 시작 날짜보다 이후여야 합니다.";
        result = false;
      }

      if (!state.form.status) {
        state.errorMessage.status = "쿠폰 상태를 선택해주세요.";
        result = false;
      }

      state.hasError = !result;
      return result;
    };

    const createCoupon = async () => {
      if (checkInput()) {
        axios.post('/api/coupon/regist', state.form).then(() => {
          window.alert('쿠폰이 등록되었습니다.');
          resetState();

        }).catch(error => {
          if (error.response) {
            const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
            window.alert(errorMessage);
          } else {
            window.alert('오류가 발생했습니다. 다시 시도해주세요.');
          }
        });
      }
    };

    const back = () => {
      router.push({name: 'AdminCouponList'});
    }

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#coupon-detail');
        textarea.style.height = '100px';
        textarea.style.height = (textarea.scrollHeight < 150 ? textarea.scrollHeight : 150) + 'px'; // 최대 높이 제한 (약 10줄)
      });
    };

    onMounted(autoGrow);

    return {
      lib, categoryCodes, discountTypes, couponTypes, couponStatuses,
      showSearchProductModal, showSearchUserModal,
      state,
      handleProductSelected, handleUserSelected,
      autoGrow, createCoupon, back, toggleAllCategories, selectedAll,
    }
  }
}
</script>

<style scoped>
.coupon-regist {
  padding-inline: 30px;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title p {
  font-size: 20px;
  font-weight: bold;
}

.content {
  font-size: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  border: 1px solid #e3e3e3;
  padding-inline: 5px;
}

td:nth-child(1), td:nth-child(2) {
  width: 10%;
}

td:nth-child(3) {
  width: 80%;
}

tr {
  height: 40px;
}

tbody .table-title {
  background-color: #e3e3e3;
  border-color: white;
}

.input-field, .select-field {
  margin-bottom: 5px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 100%;
  height: 30px;
  background-color: transparent;
}

/* 웹킷 기반 브라우저(Chrome, Safari 등)의 자동완성 스타일을 덮어쓰기 위한 코드 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

input[type=checkbox], input[type=radio] {
  accent-color:black;
  margin-right: 5px;
}

.discount-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date {
  display: flex;
  align-items: center;
}

.upload-box p {
  font-size: 24px;
  color: #ccc;
}

.button {
  display: flex;
  justify-content: space-between;
}

.error-message {
  color: #dc3545;
}

.input-error {
  border: 1px solid #dc3545;
}
.select-target {
  position: relative; /* 상대적 위치 설정 */
}

.btn-select-product, .btn-select-user {
  position: absolute; /* 절대적 위치 설정 */
  top: 5px; /* 상단에서의 위치 */
  right: 5px; /* 우측에서의 위치 */
  z-index: 1; /* 다른 요소들 위에 오도록 설정 */
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: white;
  border-color: black;
  color: black;
}

.btn-create-coupon {
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

input[type=checkbox], input[type=radio] {
  accent-color:black;
  margin-right: 5px;
}
</style>
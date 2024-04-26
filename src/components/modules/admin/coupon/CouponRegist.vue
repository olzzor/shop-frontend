<template>
  <div class="coupon-regist">
    <div class="title">
      <p>쿠폰 등록</p>
      <button type="button" class="btn-create-coupon" @click="createCoupon" :disabled="state.isSubmitting">등록하기</button>
    </div>

    <div class="content">
      <div class="type-container">
        <label class="input-label" for="coupon-type">유형</label>
        <div class="select-container">
          <select class="select-field" id="coupon-type" v-model="state.form.type" @keyup.enter="createCoupon">
            <option disabled value="">유형을 선택해주세요.</option>
            <option v-for="ct in couponTypes" :key="ct.key" :value="ct.key">{{ ct.description }}</option>
          </select>
          <div class="error-message" v-if="state.errorMessage.type">{{ state.errorMessage.type }}</div>
        </div>
      </div>

      <div class="code-container">
        <label class="input-label" for="coupon-code">코드</label>
        <div class="input-container">
          <input type="text" class="input-field" id="coupon-code" v-model="state.form.code" @keyup.enter="createCoupon"/>
          <div class="error-message" v-if="state.errorMessage.code">{{ state.errorMessage.code }}</div>
        </div>
      </div>

      <div class="name-container">
        <label class="input-label" for="coupon-name">이름</label>
        <div class="input-container">
          <input type="text" class="input-field" id="coupon-name" v-model="state.form.name" @keyup.enter="createCoupon"/>
          <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>
        </div>
      </div>

      <div class="detail-container">
        <label class="input-label" for="coupon-detail">설명</label>
        <div class="input-container">
          <textarea class="input-field" :class="{ 'input-error': state.errorMessage.detail }" id="coupon-detail"
                    v-model="state.form.detail" @input="autoGrow"/>
          <div class="error-message" v-if="state.errorMessage.detail">{{ state.errorMessage.detail }}</div>
        </div>
      </div>

      <div class="min-amount-container">
        <label class="input-label" for="coupon-min-amount">쿠폰 적용 최소 금액</label>
        <div class="input-container">
          <input type="number" min="0" class="input-field" :class="{ 'input-error': state.errorMessage.minAmount }" id="minAmount"
                 v-model.number="state.form.minAmount" @keyup.enter="createCoupon"/>
          <div class="error-message" v-if="state.errorMessage.minAmount">{{ state.errorMessage.minAmount }}</div>
        </div>
      </div>

      <div class="discount-container">
        <label class="input-label" for="coupon-discount">할인</label>
        <div class="input-container">
          <div class="discount-wrapper">
            <select class="select-field" :class="{ 'input-error': state.errorMessage.discountType }"
                    v-model="state.form.discountType" @keyup.enter="createCoupon">
              <option v-for="dt in discountTypes" :key="dt.key" :value="dt.key">{{ dt.description }}</option>
            </select>
            <input type="number" min="0"  class="input-field" v-model.number="state.form.discountValue">
          </div>
        </div>
      </div>

      <div class="target-container">
        <label class="input-label" for="coupon-target">대상</label>
        <div class="input-container">
          <div class="target-category-product">
            <div class="target-type">
              <input type="radio" v-model="state.targetType" value="CATEGORY"/>카테고리<br>
              <input type="radio" v-model="state.targetType" value="PRODUCT"/>상품
            </div>

            <div class="select-target">
              <div class="target-category" v-if="state.targetType === 'CATEGORY'">
                <div v-for="sc in state.selectedCategories" :key="sc.code">{{ sc.name }}</div>
                <button type="button" class="btn-select-category" @click="showSearchCategoryModal = true">선택</button>
              </div>

              <div class="target-product" v-else>
                <div v-for="sp in state.selectedProducts" :key="sp.id">{{ sp.name }}</div>
                <button type="button" class="btn-select-product" @click="showSearchProductModal = true">선택</button>
              </div>
            </div>
          </div>

          <div class="target-user">
            <div class="target-type">유저</div>
            <div class="select-target">
              <div v-for="su in state.selectedUsers" :key="su.id">{{ su.email }}</div>
              <button type="button" class="btn-select-user" @click="showSearchUserModal = true">선택</button>
            </div>
          </div>

          <div class="error-message" v-if="state.errorMessage.target">{{ state.errorMessage.target }}</div>
        </div>
      </div>

      <div class="valid-date-container">
        <label class="input-label" for="coupon-valid-date">유효기간</label>
        <div class="input-container">
          <div class="date">
            <input type="date" class="input-field date" id="coupon-valid-date" v-model="state.form.startValidDate" @keyup.enter="createCoupon"/>
            &nbsp;~&nbsp;
            <input type="date" class="input-field date" v-model="state.form.endValidDate" @keyup.enter="createCoupon"/>
          </div>
          <div class="error-message" v-if="state.errorMessage.validDate">{{ state.errorMessage.validDate }}</div>
        </div>
      </div>

      <div class="status-container">
        <label class="input-label" for="coupon-status">상태</label>
        <div class="select-container">
          <select class="select-field" id="coupon-status" v-model="state.form.status" @keyup.enter="createCoupon">
            <option v-for="cs in couponStatuses" :key="cs.key" :value="cs.key">{{ cs.description }}</option>
          </select>
          <div class="error-message" v-if="state.errorMessage.status">{{ state.errorMessage.status }}</div>
        </div>
      </div>
    </div>
  </div>

  <SearchCategoryModal :show="showSearchCategoryModal" @close="showSearchCategoryModal = false" @category-selected="handleCategorySelected"></SearchCategoryModal>
  <SearchProductModal :show="showSearchProductModal" @close="showSearchProductModal = false" @product-selected="handleProductSelected"></SearchProductModal>
  <SearchUserModal :show="showSearchUserModal" @close="showSearchUserModal = false" @user-selected="handleUserSelected"></SearchUserModal>

</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";
import SearchCategoryModal from "@/components/modules/admin/coupon/SearchCategoryModal.vue";
import SearchProductModal from "@/components/modules/admin/coupon/SearchProductModal.vue";
import SearchUserModal from "@/components/modules/admin/coupon/SearchUserModal.vue";

export default {
  name: "CouponRegist",
  components: {SearchCategoryModal, SearchProductModal, SearchUserModal},
  setup() {
    const discountTypes = constants.DISCOUNT_TYPES;
    const couponTypes = constants.COUPON_TYPES;
    const couponStatuses = constants.COUPON_STATUSES;

    const showSearchCategoryModal = ref(false);
    const showSearchProductModal = ref(false);
    const showSearchUserModal = ref(false);

    const state = reactive({
      isSubmitting: false,
      form: {type: '', code: '', name: '', detail: '', minAmount: 0, discountType: '', discountValue: 0, startValidDate: '', endValidDate: '', categories: [], products: [], users: [], status: '',},
      targetType: 'CATEGORY', // 'CATEGORY' or 'PRODUCT'
      selectedCategories: [],
      selectedProducts: [],
      selectedUsers: [],
      errorMessage: {},
    });

    const resetState = () => {
      state.form = {
        type: '', code: '', name: '', detail: '', minAmount: 0,
        discountType: '', discountValue: 0,
        startValidDate: '', endValidDate: '',
        categories: [], products: [], users: [],
        status: '',
      };
      state.selectedCategories = [];
      state.selectedProducts = [];
      state.selectedUsers = [];
      state.errorMessage = {};
    };

    const handleCategorySelected = (selectedCategories) => {
      if (selectedCategories && selectedCategories.length > 0) { // 선택된 상품이 있을 경우
        state.selectedCategories = selectedCategories.map(selectedCategory => {
          return {
            code: selectedCategory.code,
            name: selectedCategory.name
          };
        });

      } else { // 선택된 카테고리가 없거나 취소 버튼을 클릭한 경우
        state.selectedCategories = [];
      }

      state.form.categories = state.selectedCategories.map(selectedCategory => selectedCategory.code);
      showSearchCategoryModal.value = false;
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
        state.errorMessage.code = `코드는 ${MAX_CODE_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      } else if (!CODE_PATTERN.test(state.form.code)) {
        state.errorMessage.code = "코드는 영문자, 숫자 및 언더바(_)로만 구성되어야 합니다.";
        result = false;
      }

      if (state.form.name.length === 0) {
        state.errorMessage.name = "이름을 입력해주세요.";
        result = false;
      } else if (state.form.name.length > MAX_NAME_LENGTH) {
        state.errorMessage.name = `이름은 ${MAX_NAME_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      if (state.form.detail.length === 0) {
        state.errorMessage.detail = "설명을 입력해주세요.";
        result = false;
      } else if (state.form.detail.length > MAX_DETAIL_LENGTH) {
        state.errorMessage.detail = `설명은 ${MAX_DETAIL_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
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

      if (!state.form.startValidDate || !state.form.endValidDate) {
        state.errorMessage.validDate = "유효기간의 시작과 종료 날짜를 입력해주세요.";
        result = false;
      } else if (new Date(state.form.startValidDate) > new Date(state.form.endValidDate)) {
        state.errorMessage.validDate = "유효기간의 종료 날짜는 시작 날짜보다 이후여야 합니다.";
        result = false;
      }

      if (!state.form.status) {
        state.errorMessage.status = "쿠폰 상태를 선택해주세요.";
        result = false;
      }

      return result;
    };

    const createCoupon = async () => {
      state.isSubmitting = true;

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

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    };

    const getFlattenCategories = () => {
      return formatter.getFlattenCategories().map(cat => {
        return { code: cat.code, name: cat.name };
      });
    };

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#coupon-detail');
        textarea.style.height = '100px';
        textarea.style.height = (textarea.scrollHeight < 150 ? textarea.scrollHeight : 150) + 'px'; // 최대 높이 제한 (약 10줄)
      });
    };

    const load = () => {
      state.form.categories = getFlattenCategories();
      autoGrow();
    };

    onMounted(load);

    return {
      discountTypes, couponTypes, couponStatuses,
      showSearchCategoryModal, showSearchProductModal, showSearchUserModal,
      state,
      handleCategorySelected, handleProductSelected, handleUserSelected,
      autoGrow, createCoupon,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/coupon/coupon-regist";
</style>
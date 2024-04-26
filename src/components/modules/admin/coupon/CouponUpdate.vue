<template>
  <div class="coupon-update">
    <div class="title">
      <p>쿠폰 상세 및 변경</p>
      <button type="button" class="btn-update-coupon" @click="updateCoupon">변경하기</button>
    </div>

    <div class="content">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>BEFORE</th>
            <th>AFTER</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colspan="2" class="table-title">유형</td>
            <td>{{ formatter.getCouponTypeName(state.coupon.type) }}</td>
            <td>
              <select class="select-field" v-model="state.form.type"
                      :class="{ 'input-error': state.errorMessage.type }" @keyup.enter="updateCoupon">
                <option v-for="ct in couponTypes" :key="ct.key" :value="ct.key">{{ ct.description }}</option>
              </select>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">코드</td>
            <td>{{ state.coupon.code }}</td>
            <td>
              <input type="text" class="input-field" id="code"
                     :class="{ 'input-error': state.errorMessage.code }" v-model="state.form.code"
                     @input="trimInput('code')" @keyup.enter="updateCoupon"/>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">이름</td>
            <td>{{ state.coupon.name }}</td>
            <td>
              <input type="text" class="input-field" id="name"
                     :class="{ 'input-error': state.errorMessage.name }" v-model="state.form.name"
                     @keyup.enter="updateCoupon"/>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">설명</td>
            <td v-html="formatter.convertLineBreaks(state.coupon.detail)"></td>
            <td>
              <textarea class="input-field" id="coupon-detail"
                        :class="{ 'input-error': state.errorMessage.detail }" v-model="state.form.detail"
                        @input="autoGrow"/>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">최소 금액</td>
            <td>{{ formatter.getFormattedNumber(state.coupon.minAmount) }}원</td>
            <td><input type="number" min="0" class="input-field" id="minAmount"
                       :class="{ 'input-error': state.errorMessage.minAmount }" v-model.number="state.form.minAmount"
                       @keyup.enter="updateCoupon"/>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">할인</td>
            <td>
              {{ formatter.getDiscountTypeName(state.coupon.discountType) }}
              {{ formatter.getFormattedNumber(state.coupon.discountValue) }}
              <span v-if="state.coupon.discountType === 'AMOUNT_DISCOUNT'">원</span>
              <span v-else>%</span>
            </td>
            <td class="select-discount">
              <div class="select-discount-type">
                <select class="select-field" v-model="state.form.discountType"
                        :class="{ 'input-error': state.errorMessage.discountType }" @keyup.enter="updateCoupon">
                  <option v-for="dt in discountTypes" :key="dt.key" :value="dt.key">{{ dt.description }}</option>
                </select>
              </div>
              <div class="input-discount-value">
                <input type="number" min="0" class="input-field" v-model.number="state.form.discountValue"/>
              </div>
            </td>
          </tr>

          <tr>
            <td rowspan="2" class="table-title">대상</td>
            <td class="table-title">
              <input type="radio" v-model="state.targetType" value="CATEGORY"/>카테고리<br>
              <input type="radio" v-model="state.targetType" value="PRODUCT"/>상품
            </td>

            <td>
              <div v-if="state.targetType === 'CATEGORY'">
                <div v-if="state.coupon.categories && state.coupon.categories.length" style="white-space: pre;">
                  <div v-for="category in state.coupon.categories" :key="category.id">{{ category.name }}</div>
                </div>
                <div v-else>전체</div>
              </div>

              <div v-else>
                <div v-if="state.coupon.products && state.coupon.products.length" style="white-space: pre;">
                  <div v-for="product in state.coupon.products" :key="product.id">{{ product.name }}</div>
                </div>
                <div v-else>전체</div>
              </div>
            </td>

            <td class="select-target">
              <div v-if="state.targetType === 'CATEGORY'">
                <button type="button" class="btn-select-category" @click="showSearchCategoryModal = true">선택</button>
                <div v-for="sc in state.selectedCategories" :key="sc.code">{{ sc.name }}</div>
              </div>

              <div v-else>
                <button type="button" class="btn-select-product" @click="showSearchProductModal = true">선택</button>
                <div v-for="sp in state.selectedProducts" :key="sp.id">{{ sp.name }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="table-title">유저</td>
            <td>
              <div v-if="state.coupon.users && state.coupon.users.length">
                <div v-for="user in state.coupon.users" :key="user.id">{{ user.email }}</div>
              </div>
              <div v-else>전체</div>
            </td>
            <td class="select-target">
              <button type="button" class="btn-select-user" @click="showSearchUserModal = true">선택</button>
              <div v-for="su in state.selectedUsers" :key="su.id">{{ su.email }}</div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">유효기간</td>
            <td>
              {{ formatter.getFormattedDate(state.coupon.startValidDate, 'YYYY-MM-DD') }}
              ~
              {{ formatter.getFormattedDate(state.coupon.endValidDate, 'YYYY-MM-DD') }}
            </td>
            <td>
              <div class="date">
                <input type="date" class="input-field date"
                       :class="{ 'input-error': state.errorMessage.startValidDate }" v-model="state.form.startValidDate"
                       @keyup.enter="updateCoupon"/>
                &nbsp;~&nbsp;
                <input type="date" class="input-field date"
                       :class="{ 'input-error': state.errorMessage.endValidDate }" v-model="state.form.endValidDate"
                       @keyup.enter="updateCoupon"/>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">상태</td>
            <td>{{ formatter.getCouponStatusName(state.coupon.status) }}</td>
            <td>
              <select class="select-field" v-model="state.form.status"
                      :class="{ 'input-error': state.errorMessage.status }" @keyup.enter="updateCoupon">
                <option v-for="cs in couponStatuses" :key="cs.key" :value="cs.key">{{ cs.description }}</option>
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

  <SearchCategoryModal :show="showSearchCategoryModal" @close="showSearchCategoryModal = false" @category-selected="handleCategorySelected"></SearchCategoryModal>
  <SearchProductModal :show="showSearchProductModal" @close="showSearchProductModal = false" @product-selected="handleProductSelected"></SearchProductModal>
  <SearchUserModal :show="showSearchUserModal" @close="showSearchUserModal = false" @user-selected="handleUserSelected"></SearchUserModal>

</template>

<script>
import {nextTick, onMounted, reactive, ref,} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";
import SearchCategoryModal from "@/components/modules/admin/coupon/SearchCategoryModal.vue";
import SearchProductModal from "@/components/modules/admin/coupon/SearchProductModal.vue";
import SearchUserModal from "@/components/modules/admin/coupon/SearchUserModal.vue";

export default {
  name: 'CouponUpdate',
  components: {SearchCategoryModal, SearchProductModal, SearchUserModal},
  setup() {
    const discountTypes = constants.DISCOUNT_TYPES;
    const couponTypes = constants.COUPON_TYPES;
    const couponStatuses = constants.COUPON_STATUSES;

    const route = useRoute();
    const showSearchCategoryModal = ref(false);
    const showSearchProductModal = ref(false);
    const showSearchUserModal = ref(false);

    const state = reactive({
      coupon: {},
      form: {type: '', code: '', name: '', detail: '', minAmount: 0, discountType: '', discountValue: 0, startValidDate: '', endValidDate: '', categories: [], products: [], users: [], status: '',},
      targetType: '', // 'CATEGORY' or 'PRODUCT'
      selectedProducts: [],
      selectedUsers: [],
      hasError: false, errorMessage: {},
    });

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

    const trimInput = (key) => {
      state.form[key] = state.form[key].trim();
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

    const updateCoupon = async () => {
      if (checkInput()) {
        // 쿠폰 적용 대상으로 카테고리를 설정하는 경우, 상품은 제한하지 않음
        // 쿠폰 적용 대상으로 상품을 설정하는 경우, 카테고리는 제한하지 않음
        if (state.targetType === 'CATEGORY') {
          state.form.products = [];
        } else {
          state.form.categories = [];
        }

        axios.post('/api/coupon/update/single', state.form).then(() => {
          window.alert('쿠폰이 변경되었습니다.');
          load();

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

    const load = () => {
      axios.get(`/api/coupon/detail/${route.params.id}`).then(({data}) => {
        setLoadData(data);
        autoGrow();
      });
    };

    const setLoadData = (data) => {
      state.coupon = data;
      state.targetType = data.categories ? 'CATEGORY' : 'PRODUCT';
      state.form = {
        id: data.id,
        code: data.code, type: data.type, name: data.name, detail: data.detail,
        minAmount: data.minAmount, discountType: data.discountType, discountValue: data.discountValue,
        categories: data.categories ? data.categories.map(category => category.code) : [],
        products: data.products ? data.products.map(product => product.name) : [],
        users: data.users ? data.users.map(user => user.email) : [],
        startValidDate: formatter.getFormattedDate(data.startValidDate, 'YYYY-MM-DD'),
        endValidDate: formatter.getFormattedDate(data.endValidDate, 'YYYY-MM-DD'),
        status: data.status,
      };

      state.selectedProducts = data.products ? data.products.map(product => ({
        id: product.id,
        name: product.name
      })) : [];

      state.selectedUsers = data.users ? data.users.map(user => ({
        id: user.id,
        email: user.email
      })) : [];
    };

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#coupon-detail');
        textarea.style.height = '100px';
        textarea.style.height = (textarea.scrollHeight < 150 ? textarea.scrollHeight : 150) + 'px';
      });
    };

    onMounted(load);

    return {
      formatter,
      discountTypes, couponTypes, couponStatuses,
      showSearchCategoryModal, showSearchProductModal, showSearchUserModal,
      state,
      handleCategorySelected, handleProductSelected, handleUserSelected,
      autoGrow, trimInput, updateCoupon,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/coupon/coupon-update";
</style>
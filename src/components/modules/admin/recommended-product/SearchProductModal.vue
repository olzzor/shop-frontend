<template>
  <div v-if="show">
    <div class="modal-overlay" @click="closeModal"></div>

    <div class="modal-content">
      <table>
        <thead>
          <tr class="filter">
            <th colspan="2">
              <button type="button" class="btn-search" @click="searchCondition">검색</button>
            </th>
            <th>
              <select class="select-field" v-model="state.form.categoryCode">
                <option value="">전체</option>
                <option v-for="fc in flattenCategories" :key="fc.code" :value="fc.code">{{ fc.name }}</option>
              </select>
            </th>
            <th><input type="text" class="input-field" v-model="state.form.name" @keyup.enter="searchCondition"></th>
            <th><input type="text" class="input-field" v-model="state.form.price" @keyup.enter="searchCondition"></th>
            <th><input type="text" class="input-field" v-model="state.form.discountPer" @keyup.enter="searchCondition"></th>
            <th>
              <select class="select-field" v-model="state.form.status">
                <option v-for="ps in productStatuses" :key="ps.key" :value="ps.key">{{ ps.description }}</option>
              </select>
            </th>
          </tr>

          <tr class="title">
            <th>선택</th>
            <th>No</th>
            <th v-for="tableHeader in tableHeaders" :key="tableHeader">{{ tableHeader }}</th>
          </tr>
        </thead>

        <tbody>
          <tr class="content" v-for="(product, idx) in state.products" :key="idx">
            <td class="column-check-box"><input type="checkbox" :name="'productSelection'" :value="product" v-model="state.selectedProducts"></td>
            <td class="column-no">{{ idx + 1 }}</td>
            <td class="column-product-category">{{ product.category.name }}</td>
            <td class="column-product-name">{{ product.name }}</td>
            <td class="column-product-price">{{ product.price }}</td>
            <td class="column-product-discount-per">{{ product.discountPer }}</td>
            <td class="column-product-status">{{ formatter.getProductStatusName(product.status) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button type="button" @click="goToPage(1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-double-left"></i></button>
        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-left"></i></button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-right"></i></button>
        <button type="button" @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-double-right"></i></button>
      </div>

      <div class="action-buttons">
        <button type="button" class="button btn-select" @click="select">추가</button>
        <button type="button" class="button btn-cancel" @click="cancel">취소 (추가 안함)</button>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, watch} from "vue";
import axios from "axios";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";

export default {
  name: "SearchProductModal",
  props: {show: Boolean},
  setup(props, {emit}) {
    const tableHeaders = ['카테고리', '이름', '가격', '할인율', '상태'];
    const flattenCategories = formatter.getFlattenCategories();
    const productStatuses = constants.PRODUCT_STATUSES;

    const state = reactive({
      products: [],
      selectedProducts: [],
      form: {categoryCode: '', code: '', name: '', price: '', discountPer: '', status: '',},
      page: {pageSize: 10, currentPage: 1, totalPages: 0,},
      onclickSearchCondition: false,
    });

    const select = () => {
      let selected = null;

      if (state.selectedProducts.length > 0) {
        selected = state.selectedProducts.map(product => {
          return {
            id: product.id,
            name: product.name
          };
        });
      }

      emit('product-selected', selected);
      closeModal();
    }

    const cancel = () => {
      emit('product-selected', null);
      closeModal();
    }

    const closeModal = () => {
      emit('close');
    }

    const initProducts = () => {
      state.products = [];
      state.selectedProducts = [];
    };

    const searchFull = () => {
      state.onclickSearchCondition = false;
      state.page.currentPage = 1;

      getFullList();
    };

    const searchCondition = () => {
      state.onclickSearchCondition = true;
      state.page.currentPage = 1;

      getSearchedList();
    };

    const getFullList = () => {
      axios.post("/api/product/search-all/excluding-recommended?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize).then(({data}) => {
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    }

    const getSearchedList = () => {
      axios.post("/api/product/search/excluding-recommended?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize, state.form).then(({data}) => {
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    }

    const goToPage = (page) => {
      state.page.currentPage = page;
      state.onclickSearchCondition ? getSearchedList() : getFullList();
    };

    const load = () => {
      // getFullList();
      initProducts();
      searchFull();
    };

    onMounted(load);

    watch(() => props.show, (newValue) => {
      if (newValue) {
        load(); // 모달이 보여질 때마다 load 함수 호출
      }
    });

    return {
      formatter,
      flattenCategories,
      state, tableHeaders, productStatuses,
      goToPage, searchCondition, select, cancel, closeModal
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/recommended-product/search-product-modal";
</style>

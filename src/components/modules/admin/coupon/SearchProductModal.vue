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
              <option v-for="cc in categoryCodes" :key="cc" :value="cc">{{ lib.getCategoryName(cc) }}</option>
            </select>
          </th>
          <th><input type="text" class="input-field" v-model="state.form.name" @keyup.enter="searchCondition"></th>
          <th><input type="text" class="input-field" v-model="state.form.price" @keyup.enter="searchCondition"></th>
          <th><input type="text" class="input-field" v-model="state.form.discountPer" @keyup.enter="searchCondition"></th>
          <th>
            <select class="select-field" v-model="state.form.status">
              <option v-for="s in productStatuses" :key="s" :value="s">{{ lib.getProductStatusName(s) }}</option>
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
          <td class="column-product-category">{{ lib.getCategoryName(product.category.code) }}</td>
          <td class="column-product-name">{{ product.name }}</td>
          <td class="column-product-price">{{ product.price }}</td>
          <td class="column-product-discount-per">{{ product.discountPer }}</td>
          <td class="column-product-status">{{ lib.getProductStatusName(product.status) }}</td>
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
        <button type="button" class="btn-select" @click="select">선택</button>
        <button type="button" class="btn-cancel" @click="cancel">취소 (선택 안함)</button>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import lib from "@/scripts/lib";
import axios from "axios";

export default {
  name: "SearchProductModal",
  props: {show: Boolean},
  setup(props, {emit}) {
    const tableHeaders = ['카테고리', '이름', '가격', '할인율', '상태'];
    const categoryCodes = lib.categoryCodes;
    const productStatuses = lib.productStatuses;

    const state = reactive({
      products: [],
      selectedProducts: [],
      form: {categoryCode: '', code: '', name: '', price: '', discountPer: '', status: '',},
      page: {pageSize: 5, currentPage: 1, totalPages: 0,},
    })

    const searchCondition = () => {
      state.page.currentPage = 1;
      getSearchedList();
    };

    const getSearchedList = () => {
      axios.post("/api/product/search?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize, state.form).then(({data}) => {
        state.products = data.products;
        state.page.totalPages = data.totalPages;
      });
    }

    const goToPage = (page) => {
      state.page.currentPage = page;
      getSearchedList();
    };

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

    return {
      lib,
      state, tableHeaders, productStatuses, categoryCodes,
      goToPage, searchCondition, select, cancel, closeModal
    }
  }
}
</script>

<style scoped>
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1000px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  z-index: 2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

table {
  border: 1px solid #e3e3e3;
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #e3e3e3;
  padding-inline: 5px;
}

thead > tr:first-child {
  background-color: #e3e3e3;
}

thead tr:nth-child(2) th {
  position: relative;
}

.column-check-box, .column-no {
  width: 30px;
  max-width: 30px;
}

.column-product-category {
  width: 110px;
  max-width: 110px;
}

.column-product-name {
  width: 300px;
  max-width: 300px;
  overflow: hidden; /* 내용이 넘칠 경우 숨김 */
  white-space: nowrap; /* 내용을 한 줄로 유지 */
  text-overflow: ellipsis; /* 내용이 넘칠 경우 말줄임표 사용 */
}

.column-product-price, .column-product-discount-per, .column-product-status {
  width: 80px;
  max-width: 80px;
}

.input-field, .select-field {
  width: 100%;
  height: 25px;
}

.pagination {
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.pagination button {
  border: none;
  background-color: transparent;
}

.btn-search {
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  justify-content: center;
  text-align: center;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  width: 100%;
  height: 25px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.btn-select {
  align-items: center;
  border-width: 0.0625rem;
  border-radius: 5px;
  font-size: .75rem;
  font-weight: 700;
  height: 2.0rem;
  justify-content: center;
  text-align: center;
  width: 100%;
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
}

.btn-cancel {
  align-items: center;
  border-width: 0.0625rem;
  border-radius: 5px;
  font-size: .75rem;
  font-weight: 700;
  height: 2.0rem;
  justify-content: center;
  text-align: center;
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  color: rgb(0, 0, 0);
}

input[type=checkbox] {
  accent-color:black;
}
</style>

<template>
  <div class="product-list">
    <div class="title">상품 목록</div>

    <div class="content">
      <p>
        <i class="bi bi-emoji-smile"></i> 상세 설명과 사이즈 변경은 해당 상품의 번호 링크를 클릭하여 진행해주세요.<br>
        <i class="bi bi-emoji-smile"></i> 변경 방법: 변경하고자 하는 대상의 체크 박스 선택
        <i class="bi bi-arrow-right"></i> 변경 내용 입력 <i class="bi bi-arrow-right"></i> '변경하기' 버튼 클릭<br>
        <span style="color: #dc3545;">
          <i class="bi bi-emoji-frown"></i> 체크박스 해제시 변경 내용은 반영되지 않습니다.
        </span>
      </p>

      <div class="action-buttons">
        <div class="action-buttons-left">
          <button type="button" class="button btn-search-condition" @click="searchCondition">조건 검색</button>
          <button type="button" class="button btn-search-full" @click="searchFull">전체 검색</button>
          <button type="button" class="button btn-clear-search" @click="clearSearchConditions">조건 초기화</button>
        </div>

        <div class="action-buttons-right">
          <button type="button" class="button btn-csv-download" @click="downloadCSV">CSV 다운로드 <i class="bi bi-download"></i></button>
          <button type="button" class="button btn-change-products" @click="changeProducts">변경하기</button>
        </div>
      </div>

      <table>
        <thead>
        <tr>
          <th colspan="2">조건</th>

          <th>
            <select class="select-field" v-model="state.form.categoryCode">
              <option value="">전체</option>
              <option v-for="fc in flattenCategories" :key="fc.code" :value="fc.code">{{ fc.name }}</option>
            </select>
          </th>

          <th><input type="text" class="input-field" disabled></th>
          <th><input type="text" class="input-field" v-model="state.form.name"></th>
          <th><input type="text" class="input-field" v-model="state.form.productSize"></th>
          <th><input type="text" class="input-field" v-model="state.form.price"></th>
          <th><input type="text" class="input-field" v-model="state.form.discountPer"></th>

          <th>
            <div class="date-cell">
              <input type="date" class="input-field date" v-model="state.form.startRegDate">
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endRegDate">
            </div>
          </th>

          <th>
            <div class="date-cell">
              <input type="date" class="input-field date" v-model="state.form.startModDate">
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endModDate">
            </div>
          </th>

          <th>
            <select class="select-field" v-model="state.form.isDisplay">
              <option value="">전체</option>
              <option value="true">표시</option>
              <option value="false">비표시</option>
            </select>
          </th>

          <th>
            <select class="select-field" v-model="state.form.status">
              <option value="">전체</option>
              <option v-for="ps in productStatuses" :key="ps.key" :value="ps.key">{{ ps.description }}</option>
            </select>
          </th>
        </tr>

        <tr>
          <th><input type="checkbox" v-model="state.selectedAll" @change="toggleSelectAll"/></th>
          <th>번호</th>
          <th v-for="(tableHeader, index) in tableHeaders" :key="index">
            {{ tableHeader }}
            <div class="sort-icons">
              <span @click="sort(sortKey[index])">▲</span>
              <span @click="sort(sortKey[index], true)">▼</span>
            </div>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(product, idx) in state.products" :key="idx">
          <td class="column-check-box">
            <input type="checkbox" :checked="state.isModify[idx].value" @change="modify(idx)"/>
          </td>

          <td class="column-no">
            <router-link :to="{ name: 'AdminProductUpdate', params: { id: product.id }}">
              {{ idx + 1 }}
            </router-link>
          </td>

          <td class="column-product-category">
            <select class="select-field" v-model="product.category.code" :disabled="!state.isModify[idx].value">
              <option v-for="fc in flattenCategories" :key="fc.code" :value="fc.code">{{ fc.name }}</option>
            </select>
          </td>

          <td class="column-product-image">
            <div class="product-image">
              <img :src="`${product.productImages[0].fileUrl}`" />
            </div>
          </td>

          <td class="column-product-name">
            <div class="product-name">
              <input type="text" class="input-field" id="product-name" v-model="product.name" :disabled="!state.isModify[idx].value">
            </div>
          </td>

          <td class="column-product-size">
            <div class="product-size">
              <span v-for="(ps, index) in product.productSizes" :key="index">
<!--                {{ getProductSize(ps) }}-->
                {{ps.size}} (재고:
                <input type="text" class="input-field" id="product-size-quantity" v-model="product.productSizes[index].adjustmentQuantity" :disabled="!state.isModify[idx].value">
                )<br>
              </span>
            </div>
          </td>

          <td class="column-product-price" data-unit="원">
            <input type="text" class="input-field" id="product-price" v-model="product.price" :disabled="!state.isModify[idx].value">
          </td>

          <td class="column-product-discount-per" data-unit="%">
            <input type="text" class="input-field" id="product-discount-per" v-model="product.discountPer" :disabled="!state.isModify[idx].value">
          </td>

          <td class="column-product-reg-date">
            {{ formatter.getFormattedDate(product.regDate, 'YYYY-MM-DD HH:mm:ss') }}
          </td>

          <td class="column-product-mod-date">
            {{ formatter.getFormattedDate(product.modDate, 'YYYY-MM-DD HH:mm:ss') }}
          </td>

          <td class="column-product-is-display">
            <select class="select-field" v-model="product.isDisplay" :disabled="!state.isModify[idx].value">
              <option :value="true">표시</option>
              <option :value="false">비표시</option>
            </select>
          </td>

          <td class="column-product-status">
            <select class="select-field" v-model="product.status" :disabled="!state.isModify[idx].value">
              <option v-for="ps in productStatuses" :key="ps.key" :value="ps.key">{{ ps.description }}</option>
            </select>
          </td>
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
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import dayjs from "dayjs";
import axios from "axios";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";

export default {
  name: 'ProductList',
  components: {},
  setup() {
    const tableHeaders = ['카테고리', '이미지', '품명', '사이즈', '가격', '할인율', '등록 날짜', '변경 날짜', '표시', '상태'];
    const sortKey = ['category', '', 'name', 'productSize', 'price', 'discountPer', 'regDate', 'modDate', 'isDisplay', 'status'];
    const flattenCategories = formatter.getFlattenCategories();
    const productStatuses = constants.PRODUCT_STATUSES;

    const state = reactive({
      products: [],
      form: {
        categoryCode: '', name: '', productSize: '', price: '', discountPer: '', isDisplay: '',
        status: '', startRegDate: '', endRegDate: '', startModDate: '', endModDate: ''
      },
      page: {pageSize: 5, currentPage: 1, totalPages: 0},
      sortDirections: {},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    });

    const getProductSize = (productSize) => {
      return `${productSize.size} (재고: ${productSize.quantity})`;
    };

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + data.category.name
            + '\t' + '-'
            + '\t' + data.name
            + '\t' + data.productSizes.map(ps => getProductSize(ps)).join(', ')
            + '\t' + formatter.getFormattedNumber(data.price) + ' 원'
            + '\t' + data.discountPer + ' %'
            + '\t' + formatter.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + formatter.getFormattedDate(data.modDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + (data.isDisplay ? '표시': '비표시')
            + '\t' + formatter.getProductStatusName(data.status)
            + '\n';
      });

      return header + rows;
    }

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `productlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.products);
      const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);

      // a 태그 생성하여 다운로드 링크 및 다운로드 파일명 설정
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);  // 링크 추가
      link.click();                     // 클릭 이벤트 발생 (다운로드 실행)
      document.body.removeChild(link);  // 링크 삭제
      URL.revokeObjectURL(url);         // URL 해제
    }

    const toggleSelectAll = () => {
      for (let i = 0; i < state.products.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/product/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        setLoadData(data);
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/product/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        setLoadData(data);
      })
    };

    const setLoadData = (data) => {
      state.products = data.products.map(product => ({
        ...product,
        productSizes: product.productSizes.map(size => ({
          ...size,
          // adjustmentQuantity 는 백엔드에서 재고 업데이트의 경우, 프론트에서 입력된 수정 전후의 수량차로 갱신하기 위함. 업데이트 시 실시간으로 상품이 판매되어 수량이 변경된 경우에 대비하기 위함.
          adjustmentQuantity: size.quantity
        }))
      }));
      state.page.totalPages = data.totalPages;
      state.selectedAll = false;
      state.isModify = Array(data.products.length).fill().map(() => ref(false));
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

    const clearSearchConditions = () => {
      state.form = {
        categoryCode: '', name: '', productSize: '', price: '', discountPer: '', isDisplay: true, status: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.products.sort((a, b) => {

        // 정렬 기준값이 같은 항목이 복수 존재할 때, 같은 항목 내 출력 순서가 랜덤한 것을 방지
        // 만약, 같은 항목 내에서 어떠한 기준으로 정렬 출력하고 싶다면, return 값 변경할 것
        if (a[key] === b[key]) {
          return 0;
        }
        // 오름차순의 경우, a>b일 때, 둘의 순서 변경
        // 내림차순의 경우, a<b일 때, 둘의 순서 변경
        return isDescending
            ? a[key] < b[key] ? 1 : -1
            : a[key] > b[key] ? 1 : -1;
      });
    };

    const changeProducts = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        alert('변경할 대상을 선택해주세요.'); // 선택된 항목이 없으면 alert 표시

      } else {
        const productDataList = state.products.filter((product, idx) => state.isModify[idx].value)
            .map(product => ({
              id: product.id,
              categoryCode: product.category.code,
              name: product.name,
              price: product.price,
              discountPer: product.discountPer,
              isDisplay: product.isDisplay,
              status: product.status
            }));

        const productSizesDataList = state.products.filter((product, idx) => state.isModify[idx].value)
            .flatMap(product => product.productSizes.map(size => ({
              productId: product.id,
              id: size.id,
              size: size.size,
              quantity: size.quantity,
              adjustmentQuantity: size.adjustmentQuantity
            })));

        const formData = new FormData();
        formData.append('productList', JSON.stringify(productDataList));
        formData.append('sizesList', JSON.stringify(productSizesDataList));

        axios.post("/api/product/update/multiple", formData, {
          headers: {'Content-Type': 'multipart/form-data'}

        }).then(() => {
          alert('성공적으로 변경되었습니다.');
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

    const goToPage = (page) => {
      state.page.currentPage = page;
      state.onclickSearchCondition ? getSearchedList() : getFullList();
    };

    const load = () => {
      getFullList();
    }

    onMounted(load);

    return {
      formatter,
      productStatuses, flattenCategories,
      tableHeaders, sortKey, state,
      getProductSize, downloadCSV, clearSearchConditions, searchCondition, searchFull, sort, goToPage,
      toggleSelectAll, modify, changeProducts,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/product/product-list";
</style>
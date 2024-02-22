<template>
  <div class="coupon-list">
    <div class="title">쿠폰 목록</div>

    <div class="content">
      <p>
        <i class="bi bi-emoji-smile"></i> 변경 방법: 변경하고자 하는 대상의 체크 박스 선택
        <i class="bi bi-arrow-right"></i> 변경 내용 입력 <i class="bi bi-arrow-right"></i> '변경하기' 버튼 클릭<br>
        <span style="color: #dc3545;">
          <i class="bi bi-emoji-frown"></i> 체크박스 해제시 변경 내용은 반영되지 않습니다.
        </span>
      </p>

      <div class="button-area">
        <div class="search-btn">
          <button type="button" class="btn-search-full" @click="searchFull">
            전체 검색
          </button>
          <button type="button" class="btn-search-condition" @click="searchCondition">
            조건 검색
          </button>
          <button type="button" class="btn-clear-search" @click="clearSearchConditions">
            조건 초기화
          </button>
        </div>

        <div class="download-btn">
          <button type="button" class="btn-csv-download" @click="downloadCSV">
            CSV 다운로드 <i class="bi bi-download"></i>
          </button>
          <button type="button" class="btn-change-coupons" @click="changeCoupons">
            변경하기
          </button>
        </div>
      </div>

      <table>
        <thead>
        <tr>
          <th colspan="2">조건</th>

          <th>
            <select class="select-field" v-model="state.form.type">
              <option value="">전체</option>
              <option v-for="ct in couponTypes" :key="ct" :value="ct">
                {{ lib.getCouponTypeName(ct) }}
              </option>
            </select>
          </th>

          <th><input type="text" class="input-field" v-model="state.form.code"></th>
          <th><input type="text" class="input-field" v-model="state.form.name"></th>
          <th><input type="text" class="input-field" v-model="state.form.minAmount"></th>

          <th>
            <select class="select-field" v-model="state.form.discountType">
              <option value="">전체</option>
              <option v-for="dt in discountTypes" :key="dt" :value="dt">
                {{ lib.getDiscountTypeName(dt) }}
              </option>
            </select>
          </th>

          <th>
            <input type="text" class="input-field" v-model="state.form.discountValue"/>
          </th>
          <th>
            <input type="text" class="input-field" v-model="state.form.targets" disabled/>
          </th>

          <th>
            <div class="date-cell">
              <input type="date" class="input-field date" v-model="state.form.startStartValidDate"/>
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endStartValidDate"/>
            </div>
          </th>

          <th>
            <div class="date-cell">
              <input type="date" class="input-field date" v-model="state.form.startEndValidDate"/>
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endEndValidDate"/>
            </div>
          </th>

          <th>
            <select class="select-field" v-model="state.form.status">
              <option value="">전체</option>
              <option v-for="cs in couponStatuses" :key="cs" :value="cs">
                {{ lib.getCouponStatusName(cs) }}
              </option>
            </select>
          </th>
        </tr>

        <tr>
          <th><input type="checkbox" v-model="state.selectedAll" @change="toggleSelectAll" /></th>
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
        <tr v-for="(coupon, idx) in state.coupons" :key="idx">
          <td>
            <input type="checkbox" :checked="state.isModify[idx].value" @change="modify(idx)" />
          </td>

          <td>
            <router-link :to="{ name: 'CouponUpdate', params: { id: coupon.id }}">
              {{ idx + 1 }}
            </router-link>
          </td>

          <td class="column-coupon-type">
            <select class="select-field" v-model="coupon.type" :disabled="!state.isModify[idx].value">
              <option v-for="ct in couponTypes" :key="ct" :value="ct">
                {{ lib.getCouponTypeName(ct) }}
              </option>
            </select>
          </td>

          <td class="column-coupon-code">
            <input type="text" class="input-field" id="coupon-code"
                   v-model="coupon.code" :disabled="!state.isModify[idx].value">
          </td>

          <td class="column-coupon-name">
            <input type="text" class="input-field" id="coupon-name"
                   v-model="coupon.name" :disabled="!state.isModify[idx].value">
          </td>

          <td class="column-coupon-min-amount">{{ lib.getFormattedNumber(coupon.minAmount) }} 원</td>
          <td class="column-coupon-discount-type">{{ lib.getDiscountTypeName(coupon.discountType) }}</td>

          <td class="column-coupon-discount-value">
            <span v-if="coupon.discountType === 'AMOUNT_DISCOUNT'">{{ lib.getFormattedNumber(coupon.discountValue) }} 원</span>
            <span v-else>{{ coupon.discountValue }} %</span>
          </td>

          <td class="column-coupon-targets">
            {{ getTargetUserEmails(coupon.users) }}<br>
            {{ getTargetCategoryNames(coupon.categories) }}<br>
            {{ getTargetProductNames(coupon.products) }}
          </td>

          <td class="column-coupon-start-valid-date">
            {{ lib.getFormattedDate(coupon.startValidDate, 'YYYY-MM-DD HH:mm:ss') }}
          </td>

          <td class="column-coupon-end-valid-date">
            {{ lib.getFormattedDate(coupon.endValidDate, 'YYYY-MM-DD HH:mm:ss') }}
          </td>

          <td class="column-coupon-status">
            <select class="select-field" v-model="coupon.status" :disabled="!state.isModify[idx].value">
              <option v-for="cs in couponStatuses" :key="cs" :value="cs">
                {{ lib.getCouponStatusName(cs) }}
              </option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="goToPage(1)" :disabled="state.page.currentPage === 1"><i class="bi bi-chevron-double-left"></i>
        </button>
        <button @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i
            class="bi bi-chevron-left"></i></button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button @click="goToPage(state.page.currentPage + 1)"
                :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-chevron-right"></i>
        </button>
        <button @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages"><i
            class="bi bi-chevron-double-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import dayjs from 'dayjs';
import lib from "@/scripts/lib";

export default {
  name: 'CouponList',
  components: {},
  setup() {
    const tableHeaders = ['구분', '코드', '이름', '최소 이용 금액', '할인 대상', '할인 금액/율', '대상', '유효기간 (시작)', '유효기간 (종료)', '상태'];
    const sortKey = ['type', 'code', 'name', 'minAmount', 'discountType', 'discountValue', 'startValidDate', 'endValidDate', 'status'];
    const couponTypes = lib.couponTypes;
    const discountTypes = lib.discountTypes;
    const couponStatuses = lib.couponStatuses;

    const state = reactive({
      coupons: [],
      form: {
        type:'', code: '', name: '', minAmount: '', discountType: '',
        startStartValidDate: '', endStartValidDate: '', startEndValidDate: '', endEndValidDate: '', status: '',
      },
      page: {pageSize: 8, currentPage: 1, totalPages: 0},
      sortDirections: {},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    });

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.coupons.sort((a, b) => {

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

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + lib.getCouponTypeName(data.type)
            + '\t' + data.code
            + '\t' + data.name
            + '\t' + data.minAmount
            + '\t' + lib.getDiscountTypeName(data.discountType)
            + '\t' + data.discountValue + (data.discountType === 'AMOUNT_DISCOUNT' ? '원' : '%')
            + '\t' + getTargetUserEmails(data.users) + ', ' + getTargetCategoryNames(data.categories) + ', ' + getTargetProductNames(data.products)
            + '\t' + lib.getFormattedDate(data.startValidDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + lib.getFormattedDate(data.endValidDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + lib.getCouponStatusName(data.status)
            + '\n';
      });

      return header + rows;
    };

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `couponlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.coupons);
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
    };

    const getTargetUserEmails = (couponUsers) => `유저: ${getUserEmails(couponUsers) || "전체"}`;
    const getTargetCategoryNames = (couponCategories) => `카테고리: ${getCategoryNames(couponCategories) || "대상 없음"}`;
    const getTargetProductNames = (couponProducts) => `상품: ${getProductNames(couponProducts) || "대상 없음"}`;


    const getCategoryNames = (targetCategories) => {
      if (lib.categoryCodes.length === targetCategories.length) {
        return '전체';
      } else {
        return targetCategories.map(tc => lib.getCategoryName(tc.code)).join(', ');
      }
    };

    const getUserEmails = (targetUsers) => {
      return targetUsers.map(tu => tu.email).join(', ');
    };

    const getProductNames = (targetProducts) => {
      return targetProducts.map(tp => tp.name).join(', ');
    };

    const toggleSelectAll = () => {
      for (let i = 0; i < state.coupons.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/coupon/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.coupons = data.coupons;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.coupons.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/coupon/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        state.coupons = data.coupons;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.coupons.length).fill().map(() => ref(false));
      })
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
        type:'', code: '', name: '', minAmount: '', discountType: '',
        startStartValidDate: '', endStartValidDate: '', startEndValidDate: '', endEndValidDate: '', status: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const changeCoupons = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.coupons.filter((coupon, idx) => state.isModify[idx].value)
            .map(coupon => ({
              id: coupon.id,
              type: coupon.type,
              code: coupon.code,
              name: coupon.name,
              status: coupon.status
            }));

        axios.post("/api/coupon/update/multiple", args).then(() => {
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
    };

    onMounted(load);

    return {
      lib, discountTypes, couponTypes, couponStatuses,
      tableHeaders, sortKey, state,
      sort, downloadCSV,
      getTargetUserEmails, getTargetCategoryNames, getTargetProductNames,
      searchCondition, searchFull, clearSearchConditions,
      goToPage, toggleSelectAll, modify, changeCoupons,
    }
  }
}
</script>

<style scoped>
.coupon-list {
  padding-inline: 30px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: 12px;
  display: flex;
  flex-direction: column;
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
  position: relative; /* 부모 요소에 대한 위치를 지정 */
}

.column-coupon-type {
  width: 120px;
}
.column-coupon-code {
  width: 200px;
}
.column-coupon-name {
  width: 200px;
}
.column-coupon-min-amount {
  width: 120px;
}
.column-coupon-discount-type {
  width: 100px;
}
.column-coupon-discount-value {
  width: 120px;
}
.column-coupon-targets {
  width: 300px;
}
.column-coupon-status {
  width: 120px;
}

.input-field, .select-field {
  width: 100%;
  height: 25px;
}

.date {
  width: 70px;
}

.date-cell {
  display: flex;
}

.sort-icons {
//display: inline-block; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
}

.button-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn-search-full {
  font-size: .75rem;
  font-weight: 700;
  height: 25px;
  width: 6rem;
  justify-content: center;
  text-align: center;
  margin-right: 5px;
  border: none;
  background-color: black;
  color: white;
}

.btn-search-condition {
  font-size: .75rem;
  font-weight: 700;
  height: 25px;
  width: 6rem;
  justify-content: center;
  text-align: center;
  margin-right: 5px;
  border: none;
  background-color: black;
  color: white;
}

.btn-clear-search {
  font-size: .75rem;
  font-weight: 700;
  height: 25px;
  width: 6rem;
  justify-content: center;
  text-align: center;
  margin-right: 5px;
  border: 1px solid black;
  background-color: white;
  color: black;
}

.btn-csv-download {
  font-size: .75rem;
  font-weight: 700;
  height: 25px;
  width: 10rem;
  justify-content: center;
  text-align: center;
  margin-right: 5px;
  border: 1px solid black;
  background-color: white;
  color: black;
}

.btn-change-coupons {
  font-size: .75rem;
  font-weight: 700;
  height: 25px;
  width: 6rem;
  justify-content: center;
  text-align: center;
  border: none;
  background-color: black;
  color: white;
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
</style>
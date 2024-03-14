<template>
  <div class="order-list">
    <div class="title">주문 내역</div>

    <div class="content">
      <p>
        <span>
          <i class="bi bi-emoji-smile"></i> 변경 방법: 변경하고자 하는 대상의 체크 박스 선택
            <i class="bi bi-arrow-right"></i> 변경 내용 입력
            <i class="bi bi-arrow-right"></i> '변경하기' 버튼 클릭<br>
          <i class="bi bi-emoji-smile"></i> 주문자 이메일과 주문 상태를 제외한 항목의 변경은 주문 번호 링크를 클릭하여, 상세 페이지로 이동한 후에 변경해주세요.<br>
        </span>
        <span style="color: #dc3545;">
          <i class="bi bi-emoji-frown"></i>체크박스 해제시 변경 내용은 반영되지 않습니다.
        </span>
      </p>

      <div class="button-area">
        <div class="search-btn">
          <button type="button" class="button btn-search-full" @click="searchFull">
            전체 검색
          </button>
          <button type="button" class="button btn-search-condition" @click="searchCondition">
            조건 검색
          </button>
          <button type="button" class="button btn-clear-search" @click="clearSearchConditions">
            조건 초기화
          </button>
        </div>

        <div class="download-btn">
          <button type="button" class="button btn-csv-download" @click="downloadCSV">
            CSV 다운로드 <i class="bi bi-download"></i>
          </button>
          <button type="button" class="button btn-change-orders" @click="changeOrders">변경하기</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th colspan="2">조건</th>
            <th><input type="text" class="input-field" v-model="state.form.orderNumber"></th>
            <th><input type="text" class="input-field" v-model="state.form.buyerEmail"></th>
            <th><input type="text" class="input-field" v-model="state.form.paymentMethod"></th>
            <th><input type="text" class="input-field" v-model="state.form.paymentAmount"></th>
            <th><input type="text" class="input-field" v-model="state.form.orderProduct"></th>
            <th>
              <select class="select-field" v-model="state.form.orderStatus">
                <option value="">전체</option>
                <option v-for="status in orderStatuses" :key="status" :value="status">{{
                    lib.getOrderStatusName(status)
                  }}
                </option>
              </select>
            </th>
            <th>
              <div class="date-cell">
                <input type="date" class="input-field date" v-model="state.form.startOrderDate">
                &nbsp;~&nbsp;
                <input type="date" class="input-field date" v-model="state.form.endOrderDate">
              </div>
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
          <tr v-for="(order, idx) in state.orders" :key="idx">
            <td class="column-check-box">
              <input type="checkbox" :checked="state.isModify[idx].value" @change="modify(idx)"/>
            </td>

            <td class="column-no">
              <router-link :to="{ name: 'AdminOrderUpdate', params: { id: order.id }}">
                {{idx + 1 }}
              </router-link>
            </td>

            <td class="column-order-number">{{ order.orderNumber }}</td>

            <td class="column-order-buyer-email">
              <input type="text" class="input-field" id="buyer-email"
                     v-model="order.buyerEmail" :disabled="!state.isModify[idx].value"/>
            </td>

            <td class="column-order-payment-method">{{ order.paymentMethod }} {{ order.cardNumber }}</td>
            <td class="column-order-payment-amount">{{ lib.getFormattedNumber(order.paymentAmount) }}원</td>

            <td class="column-order-product-name">
              {{ getOrderProducts(order.orderDetails) }}
            </td>

            <td class="column-order-status">
              <select class="select-field" v-model="order.status" :disabled="!state.isModify[idx].value">
                <option v-for="status in orderStatuses" :key="status" :value="status">
                  {{ lib.getOrderStatusName(status) }}
                </option>
              </select>
            </td>

            <td class="column-order-reg-date">{{ lib.getFormattedDate(order.regDate, 'YYYY-MM-DD HH:mm:ss') }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button type="button" @click="goToPage(1)" :disabled="state.page.currentPage === 1">
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages">
          <i class="bi bi-chevron-right"></i>
        </button>
        <button type="button" @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages">
          <i class="bi bi-chevron-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import axios from "axios";
import dayjs from 'dayjs';
import lib from "@/scripts/lib";

export default {
  name: 'OrderList',
  components: {},
  setup() {
    const tableHeaders = ['주문 번호', '주문자 이메일', '결제 수단', '결제 금액', '구입 항목', '주문 상태', '주문 날짜',];
    const sortKey = ['orderNumber', 'buyerEmail', 'paymentMethod', 'paymentAmount', 'orderProducts', 'status', 'regDate'];
    const orderStatuses = lib.orderStatuses;
    const shipmentStatuses = lib.shipmentStatuses;

    const state = reactive({
      orders: [],
      form: {
        id: 0, orderNumber: '', buyerEmail: '',
        paymentMethod: '', paymentAmount: '', orderProduct: '', orderStatus: '',
        startOrderDate: '', endOrderDate: '',
      },
      page: {pageSize: 15, currentPage: 1, totalPages: 0},
      sortDirections: {},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    });

    const getOrderProducts = (orderDetails) => {
      return `${orderDetails[0].product.name} 포함 총 ${getTotalQuantity(orderDetails)}건`;
    };

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + data.orderNumber
            + '\t' + data.buyerEmail
            + '\t' + data.paymentMethod + ' ' + data.cardNumber
            + '\t' + lib.getFormattedNumber(data.paymentAmount) + '원'
            + '\t' + getOrderProducts(data.orderDetails)
            + '\t' + lib.getOrderStatusName(data.status)
            + '\t' + lib.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\n';
      });

      return header + rows;
    };

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `orderlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.orders);
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

    const toggleSelectAll = () => {
      for (let i = 0; i < state.orders.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/order/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.orders = data.orders;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.orders.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/order/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        state.orders = data.orders;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.orders.length).fill().map(() => ref(false));
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
        orderNumber: '', buyerEmail: '', paymentMethod: '', paymentAmount: '',
        orderProduct: '', orderStatus: '', startOrderDate: '', endOrderDate: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    }

    const changeOrders = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.orders.filter((order, idx) => state.isModify[idx].value)
            .map(order => ({
              id: order.id,
              buyerEmail: order.buyerEmail,
              status: order.status
            }));

        axios.post("/api/order/update/multiple", args).then(() => {
          alert('주문 내역이 성공적으로 변경되었습니다.');
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
    }

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.orders.sort((a, b) => {

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
    }

    const goToPage = (page) => {
      state.page.currentPage = page;
      state.onclickSearchCondition ? getSearchedList() : getFullList();
    };

    const load = () => {
      getFullList();
    };

    const getTotalQuantity = (orderDetails) => {
      return orderDetails.reduce((sum, detail) => sum + detail.quantity, 0);
    };

    const getTotalPrice = (orderDetails) => {
      return orderDetails.reduce((sum, detail) => sum + detail.unitPrice, 0);
    };

    load();

    return {
      lib,
      tableHeaders, orderStatuses, shipmentStatuses, state, sortKey,
      getOrderProducts, downloadCSV, toggleSelectAll, clearSearchConditions, searchCondition, searchFull, modify, changeOrders, goToPage, sort,
      getTotalQuantity, getTotalPrice,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/order/order-list";
</style>
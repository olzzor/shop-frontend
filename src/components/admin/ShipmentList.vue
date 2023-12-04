<template>
  <div class="list">
    <div class="title">배송 내역</div>

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
          <button type="button" class="btn-search-condition" @click="searchCondition">
            조건 검색
          </button>
          <button type="button" class="btn-search-full" @click="searchFull">
            전체 검색
          </button>
          <button type="button" class="btn-clear-search" @click="clearSearchConditions">
            조건 초기화
          </button>
        </div>

        <div class="download-btn">
          <button type="button" class="btn-csv-download" @click="downloadCSV">
            CSV 다운로드 <i class="bi bi-download"></i>
          </button>
          <button type="button" class="btn-change-shipments" @click="changeShipments">
            변경하기
          </button>
        </div>
      </div>

      <table>
        <thead>
        <tr>
          <th colspan="2">조건</th>
          <th>
            <select class="select-field" v-model="state.form.courierCompany">
              <option value="">전체</option>
              <option v-for="cc in courierCompanies" :key="cc" :value="cc">
                {{ lib.getCourierCompanyName(cc) }}
              </option>
            </select>
          </th>
          <th><input type="text" class="input-field" v-model="state.form.trackingNumber"></th>
          <th>
            <select class="select-field" v-model="state.form.shipmentStatus">
              <option value="">전체</option>
              <option v-for="s in shipmentStatuses" :key="s" :value="s">
                {{ lib.getShipmentStatusName(s) }}
              </option>
            </select>
          </th>
          <th><input type="text" class="input-field" v-model="state.form.recipientName"></th>
          <th><input type="text" class="input-field" v-model="state.form.recipientPhone"></th>
          <th><input type="text" class="input-field" v-model="state.form.shippingAddress"></th>
          <th><input type="text" class="input-field" v-model="state.form.orderNumber"></th>
          <th><input type="text" class="input-field" v-model="state.form.orderProduct"></th>
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
        <tr v-for="(shipment, idx) in state.shipments" :key="idx">
          <td>
            <input type="checkbox" :checked="state.isModify[idx].value" @change="modify(idx)"/>
          </td>

          <td>{{ idx + 1 }}</td>

          <td>
            <select class="select-field" v-model="shipment.courierCompany" :disabled="!state.isModify[idx].value">
              <option v-for="cc in courierCompanies" :key="cc" :value="cc">
                {{ lib.getCourierCompanyName(cc) }}
              </option>
            </select>
          </td>

          <td>
            <input type="text" class="input-field" id="tracking-number"
                   v-model="shipment.trackingNumber" :disabled="!state.isModify[idx].value">
          </td>

          <td>
            <select class="select-field" v-model="shipment.status" :disabled="!state.isModify[idx].value">
              <option v-for="s in shipmentStatuses" :key="s" :value="s">
                {{ lib.getShipmentStatusName(s) }}
              </option>
            </select>
          </td>

          <td>
            <input type="text" class="input-field" id="recipient-name"
                   v-model="shipment.recipientName" :disabled="!state.isModify[idx].value">
          </td>

          <td>
            <input type="text" class="input-field" id="recipient-phone"
                   v-model="shipment.recipientPhone" :disabled="!state.isModify[idx].value">
          </td>

          <td>
            <input type="text" class="input-field" id="shipping-address"
                   v-model="shipment.shippingAddress" :disabled="!state.isModify[idx].value">
          </td>

          <td>{{ shipment.orderDetails[0].order.orderNumber }}</td>

          <td>
            <div v-for="(od, idx) in shipment.orderDetails" :key="idx">
              {{ getShippingProduct(od) }}<br>
            </div>
          </td>

          <td>{{ lib.getFormattedDate(shipment.regDate, 'YYYY-MM-DD HH:mm:ss') }}</td>

          <td>{{ lib.getFormattedDate(shipment.modDate, 'YYYY-MM-DD HH:mm:ss') }}</td>
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
import {reactive, ref} from "vue";
import axios from "axios";
import dayjs from 'dayjs';
import lib from "@/scripts/lib";

export default {
  name: 'ShipmentList',
  components: {},
  setup() {
    const tableHeaders = ['택배사', '송장 번호', '배송 상태', '수령인', '연락처', '배송지', '주문 번호', '주문 상품', '배송 정보 입력 날짜', '배송 정보 수정 날짜'];
    const sortKey = ['orderNumber', 'courier', 'trackingNumber', 'status', 'regDate', 'modDate'];
    const courierCompanies = lib.courierCompanies;
    const shipmentStatuses = lib.shipmentStatuses;

    const state = reactive({
      shipments: [],
      form: {
        courierCompany: '', trackingNumber: '', shipmentStatus: '',
        recipientName: '', recipientPhone: '', shippingAddress: '',
        orderNumber: '', orderProduct: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      },
      page: {pageSize: 10, currentPage: 1, totalPages: 0},
      sortDirections: {},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    })

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.shipments.sort((a, b) => {

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

    const getShippingProduct = (orderDetail) => {
      return `${orderDetail.product.name}/ ${orderDetail.productSize.size}/ ${orderDetail.quantity}개`;
    };

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + lib.getCourierCompanyName(data.courierCompany)
            + '\t' + data.trackingNumber
            + '\t' + lib.getShipmentStatusName(data.status)
            + '\t' + data.recipientName
            + '\t' + data.recipientPhone
            + '\t' + data.shippingAddress
            + '\t' + data.orderDetails[0].order.orderNumber
            + '\t' + data.orderDetails.map(od => getShippingProduct(od)).join(', ')
            + '\t' + lib.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + lib.getFormattedDate(data.modDate, 'YYYY-MM-DD HH:mm:ss')
            + '\n';
      });

      return header + rows;
    }

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `shipmentlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.shipments);
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
      for (let i = 0; i < state.shipments.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/shipment/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.shipments = data.shipments;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.shipments.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/shipment/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        state.shipments = data.shipments;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.shipments.length).fill().map(() => ref(false));
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
        courierCompany: '', trackingNumber: '', shipmentStatus: '',
        recipientName: '', recipientPhone: '', shippingAddress: '',
        orderNumber: '', orderProduct: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const changeShipments = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.shipments.filter((shipment, idx) => state.isModify[idx].value)
            .map(shipment => ({
              id: shipment.id,
              courierCompany: shipment.courierCompany,
              trackingNumber: shipment.trackingNumber,
              status: shipment.status
            }));

        axios.post("/api/shipment/update", args).then(() => {
          alert('배송 내역이 성공적으로 변경되었습니다.');
          load();

        }).catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                window.alert(error.response.data.message);
                break;
              case 404:
                window.alert(error.response.data.message);
                break;
              default:
                window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
          } else {
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
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

    load();

    return {
      lib, courierCompanies, shipmentStatuses,
      tableHeaders, sortKey, state,
      sort, getShippingProduct, downloadCSV, toggleSelectAll,
      clearSearchConditions, searchCondition, searchFull,
      modify, changeShipments, goToPage
    }
  }
}
</script>

<style scoped>
.list {
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

.input-field, .select-field {
  width: 100%;
  height: 25px;
}

.input-field.date {
  width: 75px;
}

.date-cell {
  display: flex;
}

.sort-icons {
  display: inline-block;
  position: absolute; /* 절대 위치 지정 */
  right: 5px; /* 셀의 오른쪽에 위치 */
  top: 50%; /* 셀의 중앙에 위치 */
  transform: translateY(-50%); /* Y축을 기준으로 50%만큼 이동하여 완전히 중앙에 위치 */
}

.button-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn-search-full, .btn-search-condition {
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

.btn-change-shipments {
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
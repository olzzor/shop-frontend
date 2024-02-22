<template>
  <div class="user-list">
    <div class="title">유저 내역</div>

    <div class="content">
      <p>
        <span>변경하고자 하는 유저 정보를 체크해서 변경내용을 입력, 변경하기 버튼을 클릭하세요.</span>
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
          <button type="button" class="btn-change-users" @click="changeUsers">
            변경하기
          </button>
        </div>
      </div>

      <table>
        <thead>
        <tr>
          <th colspan="2">조건</th>

          <th>
            <select class="select-field" v-model="state.form.authProvider">
              <option value="">전체</option>
              <option v-for="ap in authProviders" :key="ap" :value="ap">{{ ap }}</option>
            </select>
          </th>

          <th><input type="text" class="input-field" v-model="state.form.email"></th>
          <th><input type="text" class="input-field" v-model="state.form.name"></th>
          <th><input type="text" class="input-field" v-model="state.form.phoneNumber"></th>

          <th>
            <select class="select-field" v-model="state.form.adminFlag">
              <option value="">전체</option>
              <option value="true">○</option>
              <option value="false">☓</option>
            </select>
          </th>

          <th>
            <select class="select-field" v-model="state.form.activateFlag">
              <option value="">전체</option>
              <option value="true">○</option>
              <option value="false">☓</option>
            </select>
          </th>

          <th>
            <div class="date">
              <input type="date" class="input-field date" v-model="state.form.startRegDate">
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endRegDate">
            </div>
          </th>

          <th>
            <div class="date">
              <input type="date" class="input-field date" v-model="state.form.startModDate">
              &nbsp;~&nbsp;
              <input type="date" class="input-field date" v-model="state.form.endModDate">
            </div>
          </th>
        </tr>

        <tr>
          <th><input type="checkbox" v-model="state.selectedAll" @change="toggleSelectAll" /></th>
          <th>번호</th>
          <th v-for="(tableHeader, idx) in tableHeaders" :key="idx">{{ tableHeader }}</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(user, idx) in state.users" :key="idx">
          <td><input type="checkbox" v-model="state.isModify[idx].value" /></td>
          <td>{{ idx + 1 }}</td>
          <td>{{ user.authProvider }}</td>
          <td>{{ user.email }}</td>

          <td>
            <input type="text" class="input-field" id="name" v-model="user.name" :disabled="!state.isModify[idx].value">
          </td>
          <td>
            <input type="text" class="input-field" id="phone-number" v-model="user.phoneNumber" :disabled="!state.isModify[idx].value">
          </td>

          <td>
            <select class="select-field" v-model="user.adminFlag" :disabled="!state.isModify[idx].value">
              <option value="true">○</option>
              <option value="false">☓</option>
            </select>
          </td>

          <td>
            <select class="select-field" v-model="user.activateFlag" :disabled="!state.isModify[idx].value">
              <option value="true">○</option>
              <option value="false">☓</option>
            </select>
          </td>

          <td>{{ lib.getFormattedDate(user.regDate, 'YYYY-MM-DD HH:mm:ss') }}</td>
          <td>{{ lib.getFormattedDate(user.modDate, 'YYYY-MM-DD HH:mm:ss') }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="goToPage(1)" :disabled="state.page.currentPage === 1">
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span>{{ state.page.currentPage }} / {{ state.page.totalPages }}</span>
        <button @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages">
          <i class="bi bi-chevron-right"></i>
        </button>
        <button @click="goToPage(state.page.totalPages)" :disabled="state.page.currentPage === state.page.totalPages">
          <i class="bi bi-chevron-double-right"></i>
        </button>
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
  name: 'UserList',
  components: {},
  setup() {
    const tableHeaders = ['구분', '이메일', '이름', '전화번호', '관리자 권한', '활성 상태', '등록 날짜', '변경 날짜'];
    const authProviders = lib.authProviders;

    const state = reactive({
      users: [],
      form: {
        authProvider: '', email: '', name: '', phoneNumber: '', adminFlag: '', activateFlag: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      },
      page: {pageSize: 15, currentPage: 1, totalPages: 0,},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    });

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + data.authProvider
            + '\t' + data.email
            + '\t' + data.name
            + '\t' + data.phoneNumber
            + '\t' + (data.adminFlag ? '○' : '☓')
            + '\t' + (data.activateFlag ? '○' : '☓')
            + '\t' + lib.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + lib.getFormattedDate(data.modDate, 'YYYY-MM-DD HH:mm:ss')
            + '\n';
      });

      return header + rows;
    };

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `userlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.users);
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
      for (let i = 0; i < state.users.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get("/api/user/list?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize).then(({data}) => {
        state.users = data.users;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.users.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post("/api/user/search?page=" + (state.page.currentPage - 1) + "&size=" + state.page.pageSize, state.form).then(({data}) => {
        state.users = data.users;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.users.length).fill().map(() => ref(false));
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
        authProvider: '', email: '', name: '', phoneNumber: '',
        adminFlag: '', activateFlag: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const changeUsers = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.users.filter((user, idx) => state.isModify[idx].value)
            .map(user => ({
              id: user.id,
              name: user.name,
              adminFlag: user.adminFlag
            }));

        axios.post("/api/user/update/multiple", args).then(() => {
          alert('유저 정보가 변경되었습니다.');
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
      lib,
      tableHeaders, authProviders, state,
      downloadCSV, toggleSelectAll,
      searchCondition, searchFull, clearSearchConditions,
      modify, changeUsers, goToPage
    }
  }
}
</script>

<style scoped>
.user-list {
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

.input-field, .select-field {
  width: 100%;
  height: 25px;
}

.date {
  display: flex;
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

.btn-change-users {
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
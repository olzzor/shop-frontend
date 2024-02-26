<template>
  <div class="notice-list">
    <div class="title">공지 목록</div>

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
          <button type="button" class="button btn-change-notices" @click="changeNotices">
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
              <option v-for="nt in noticeTypes" :key="nt" :value="nt">
                {{ nt }}
              </option>
            </select>
          </th>

          <th><input type="text" class="input-field" v-model="state.form.title"></th>
          <th></th>

          <th>
            <select class="select-field" v-model="state.form.isSliderImage">
              <option value="">전체</option>
              <option value="true">표시</option>
              <option value="false">비표시</option>
            </select>
          </th>
          <th></th>

          <th>
            <select class="select-field" v-model="state.form.isModalImage">
              <option value="">전체</option>
              <option value="true">표시</option>
              <option value="false">비표시</option>
            </select>
          </th>
          <th></th>

          <th>
            <select class="select-field" v-model="state.form.status">
              <option value="">전체</option>
              <option v-for="ns in noticeStatuses" :key="ns" :value="ns">
                {{ lib.getNoticeStatusName(ns) }}
              </option>
            </select>
          </th>

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
        <tr v-for="(n, idx) in state.notices" :key="idx">
          <td class="column-check-box">
            <input type="checkbox" v-model="state.isModify[idx].value"/>
          </td>

          <td class="column-no">
            <router-link :to="{ name: 'AdminNoticeUpdate', params: { id: n.id }}">{{ idx + 1 }}</router-link>
          </td>

          <td class="column-notice-type">
            <select class="select-field" v-model="n.type" :disabled="!state.isModify[idx].value">
              <option v-for="nt in noticeTypes" :key="nt" :value="nt">
                {{ nt }}
              </option>
            </select>
          </td>

          <td class="column-notice-title">{{ n.title }}</td>

          <td class="column-notice-main-image">
            <div class="notice-main-image">
              <img :src="`${n.noticeMainImage.fileUrl}`"/>
            </div>
          </td>

          <td class="column-notice-slider">
            {{ n.isSliderImage ? '표시' : '비표시' }}
          </td>
          <td class="column-notice-slider-image">
            <div v-if="n.noticeSliderImage" class="notice-slider-image">
              <img :src="`${n.noticeSliderImage.fileUrl}`"/>
            </div>
          </td>

          <td class="column-notice-modal">
            {{ n.isModalImage ? '표시' : '비표시' }}
          </td>
          <td class="column-notice-modal-image">
            <div v-if="n.noticeModalImage" class="notice-modal-image">
              <img :src="`${n.noticeModalImage.fileUrl}`"/>
            </div>
          </td>

          <td class="column-notice-status">
            <select class="select-field" v-model="n.status" :disabled="!state.isModify[idx].value">
              <option v-for="ns in noticeStatuses" :key="ns" :value="ns">
                {{ lib.getNoticeStatusName(ns) }}
              </option>
            </select>
          </td>

          <td class="column-notice-reg-date">
            {{ lib.getFormattedDate(n.regDate, 'YYYY-MM-DD HH:mm:ss') }}
          </td>

          <td class="column-notice-mod-date">
            {{ lib.getFormattedDate(n.modDate, 'YYYY-MM-DD HH:mm:ss') }}
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
  name: 'NoticeList',
  components: {},
  setup() {
    const tableHeaders = ['구분', '제목', '메인 이미지', '슬라이더 표시', '슬라이더 이미지', '모달 표시', '모달 이미지', '상태', '등록 날짜', '변경 날짜'];
    const sortKey = ['type', 'title', 'status', 'isSliderImage', 'isModalImage', 'regDate', 'modDate'];
    const noticeTypes = lib.noticeTypes;
    const noticeStatuses = lib.noticeStatuses;

    const state = reactive({
      notices: [],
      form: {
        type: '', title: '', isSliderImage: '', isModalImage: '', status: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      },
      page: {pageSize: 5, currentPage: 1, totalPages: 0},
      isModify: [],
      selectedAll: false,
      sortDirections: {},
      onclickSearchCondition: false,
    });

    const convertCSV = (tableDatas) => {
      let header = '번호' + '\t' + tableHeaders.join('\t') + '\n';
      let rows = '';

      tableDatas.forEach((data, idx) => {
        rows += (idx + 1)
            + '\t' + data.type
            + '\t' + data.title
            + '\t' + '-'
            + '\t' + (data.isSliderImage ? '표시' : '비표시')
            + '\t' + '-'
            + '\t' + (data.isModalImage ? '표시' : '비표시')
            + '\t' + '-'
            + '\t' + lib.getNoticeStatusName(data.status)
            + '\t' + lib.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + lib.getFormattedDate(data.modDate, 'YYYY-MM-DD HH:mm:ss')
            + '\n';
      });

      return header + rows;
    };

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `noticelist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.notices);
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

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.notices.sort((a, b) => {

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

    const toggleSelectAll = () => {
      for (let i = 0; i < state.notices.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/notice/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.notices = data.notices;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.notices.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/notice/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        state.notices = data.notices;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.notices.length).fill().map(() => ref(false));
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
        type: '', title: '', isSliderImage: '', isModalImage: '', status: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const changeNotices = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.notices.filter((notice, idx) => state.isModify[idx].value)
            .map(notice => ({
              id: notice.id,
              type: notice.type,
              status: notice.status
            }));

        axios.post("/api/notice/update/multiple", args).then(() => {
          alert('공지 정보가 변경되었습니다.');
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
      lib, noticeTypes, noticeStatuses,
      tableHeaders, sortKey, state,
      downloadCSV, clearSearchConditions, searchCondition, searchFull, sort, goToPage,
      toggleSelectAll, modify, changeNotices
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/notice/notice-list";
</style>
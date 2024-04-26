<template>
  <div class="review-list">
    <div class="title">리뷰 내역</div>

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
          <button type="button" class="button btn-change-reviews" @click="changeReviews">
            변경하기
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th colspan="2">조건</th>
            <th>
              <select class="select-field" v-model="state.form.rating">
                <option value="">전체</option>
                <option v-for="num in 5" :value="num" :key="num">{{ num }}</option>
              </select>
            </th>

            <th><input type="text" class="input-field" v-model="state.form.title"></th>
            <th><input type="text" class="input-field" v-model="state.form.content"></th>
            <th><input type="text" class="input-field" v-model="state.form.userEmail"></th>

            <th>
              <select class="select-field" v-model="state.form.isActivate">
                <option value="">전체</option>
                <option value="true">◯</option>
                <option value="false">✕</option>
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
          <tr v-for="(review, idx) in state.reviews" :key="idx">
            <td class="column-check-box">
              <input type="checkbox" :checked="state.isModify[idx].value" @change="modify(idx)" />
            </td>

            <td class="column-no">
              <router-link :to="{ name: 'AdminReviewUpdate', params: { id: review.id }}">
                {{ idx + 1 }}
              </router-link>
            </td>

            <td class="column-review-rating">{{ review.rating }}</td>
            <td class="column-review-title ellipsis">{{ review.title }}</td>
            <td class="column-review-content ellipsis">{{ review.content }}</td>
            <td class="column-review-user-email">{{ review.userEmail }}</td>

            <td class="column-review-is-activate">
              <select class="select-field" v-model="review.isActivate" :disabled="!state.isModify[idx].value">
                <option value="true">○</option>
                <option value="false">☓</option>
              </select>
            </td>

            <td class="column-review-reg-date">
              {{ formatter.getFormattedDate(review.regDate, 'YYYY-MM-DD HH:mm:ss') }}
            </td>
            <td class="column-review-mod-date">
              {{ formatter.getFormattedDate(review.modDate, 'YYYY-MM-DD HH:mm:ss') }}
            </td>
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
import dayjs from 'dayjs';
import axios from "axios";
import formatter from "@/scripts/formatter";

export default {
  name: 'ReviewList',
  components: {},
  setup() {
    const tableHeaders = ['평점', '제목', '내용', '작성자 이메일', '활성 상태', '작성 날짜', '변경 날짜'];
    const sortKey = ['rating', 'title', 'content', 'userEmail', 'isActivate', 'regDate', 'modDate'];

    const state = reactive({
      reviews: [],
      form: {
        rating: '', title: '', content: '', userEmail: '', isActivate: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: '',
      },
      page: {pageSize: 15, currentPage: 1, totalPages: 0},
      sortDirections: {},
      isModify: [],
      selectedAll: false,
      onclickSearchCondition: false,
    });

    const sort = (key, isDescending = false) => {
      state.sortDirections[key] = isDescending;
      state.reviews.sort((a, b) => {

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
            + '\t' + data.rating
            + '\t' + data.title
            + '\t' + formatter.convertSpaces(data.content)
            + '\t' + data.userEmail
            + '\t' + (data.isActivate ? '○': '☓')
            + '\t' + formatter.getFormattedDate(data.regDate, 'YYYY-MM-DD HH:mm:ss')
            + '\t' + formatter.getFormattedDate(data.modDate, 'YYYY-MM-DD HH:mm:ss')
            + '\n';
      });

      return header + rows;
    };

    const downloadCSV = () => {
      // 다운로드 파일명 생성
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const filename = `reviewlist_${timestamp}.csv`;

      // 다운로드 링크 생성 : 데이터의 CSV 변환 -> CSV 데이터의 Blob 객체 생성 -> Blob 객체의 URL 생성
      const csv = convertCSV(state.reviews);
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
      for (let i = 0; i < state.reviews.length; i++) {
        state.isModify[i].value = state.selectedAll;
      }
      console.log("state.isModify after toggleSelectAll:", state.isModify);
    };

    const getFullList = () => {
      axios.get(`/api/review/list?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.reviews = data.reviews;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.reviews.length).fill().map(() => ref(false));
      });
    };

    const getSearchedList = () => {
      axios.post(`/api/review/search?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`, state.form).then(({data}) => {
        state.reviews = data.reviews;
        state.page.totalPages = data.totalPages;
        state.selectedAll = false;
        state.isModify = Array(data.reviews.length).fill().map(() => ref(false));
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
        rating: '', title: '', content: '', userEmail: '', isActivate: '',
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: ''
      };
    };

    const modify = (idx) => {
      state.isModify[idx].value = !state.isModify[idx].value;
      state.selectedAll = state.isModify.every(item => item.value);

      console.log(state.isModify.values);
      console.log("state.isModify after modify:", state.isModify.values);
    };

    const changeReviews = () => {
      const selectedItems = state.isModify.filter(item => item.value);

      if (selectedItems.length === 0) {
        // 선택된 항목이 없으면 alert 표시
        alert('변경할 대상을 선택해주세요.');

      } else {
        const args = state.reviews.filter((review, idx) => state.isModify[idx].value)
          .map(review => ({
            id: review.id,
            isActivate: review.isActivate
          }));

        axios.post("/api/review/update/multiple", args).then(() => {
          alert('문의 내역이 성공적으로 변경되었습니다.');
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
      formatter,
      tableHeaders, sortKey, state,
      sort, downloadCSV,
      searchFull, searchCondition, clearSearchConditions,
      goToPage, toggleSelectAll, modify, changeReviews,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/review/review-list";
</style>
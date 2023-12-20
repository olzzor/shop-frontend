<template>
  <div class="review-update">
    <div class="title">
      <p>리뷰 상세 및 변경</p>
      <button type="button" class="btn-update" @click="updateReview">변경하기</button>
    </div>

    <div class="content">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>BEFORE</th>
            <th>AFTER</th>
          </tr>
        </thead>

        <tbody>
        <tr>
          <td class="table-title">평점</td>
          <td>{{ state.review.rating }}</td>
          <td>{{ state.review.rating }}</td>
        </tr>

        <tr>
          <td class="table-title">제목</td>
          <td>{{ state.review.title }}</td>
          <td>{{ state.review.title }}</td>
        </tr>

        <tr>
          <td class="table-title">내용</td>
          <td><div v-html="lib.convertLineBreaks(state.review.content)"></div></td>
          <td><div v-html="lib.convertLineBreaks(state.review.content)"></div></td>
        </tr>

        <tr>
          <td class="table-title">이미지</td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(ri, index) in state.review.reviewImages" :key="index">
                <img class="review-image" :src="`${ri.fileUrl}`"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(ri, index) in state.review.reviewImages" :key="index">
                <img class="review-image" :src="`${ri.fileUrl}`"/>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="table-title">활성</td>
          <td>{{ state.review.activateFlag ? '○' : '☓' }}</td>
          <td>
            <select class="select-field" v-model="state.form.activateFlag">
              <option value="true">○</option>
              <option value="false">☓</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  name: 'ReviewUpdate',
  components: {},
  setup() {
    const route = useRoute();
    const reviewId = route.params.id;

    const state = reactive({
      review: {}, form: {},
    });

    const updateReview = async () => {
      axios.post('/api/review/update/single', state.form).then(() => {
        window.alert('변경되었습니다.');
        location.reload();

      }).catch(() => {
        window.alert('리뷰 상세 내용 변경에 실패하였습니다.');
      });
    };

    const load = () => {
      axios.get(`/api/review/detail/admin/${reviewId}`).then(({data}) => {
        state.review = data;
        state.form = JSON.parse(JSON.stringify(data));
      });
    };

    onMounted(load);

    return {
      lib,
      state,
      updateReview,
    }
  }
}
</script>

<style scoped>
.review-update {
  padding-inline: 30px;
}
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.title p {
  font-size: 20px;
  font-weight: bold;
}
.content {
  font-size: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
tbody .table-title {
  background-color: #e3e3e3;
  border-color: white;
}
th, td {
  border: 1px solid #e3e3e3;
  padding-left: 5px;
}
th {
  border: none;
  border-bottom: 1px solid #e3e3e3;
  text-align: center;
}
th:nth-child(1) {
  width: 10%;
}
th:nth-child(2), th:nth-child(3) {
  width: 40%;
}
tr {
  height: 40px;
}

.select-field {
  margin-bottom: 5px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 100%;
  height: 30px;
  background-color: transparent;
}

.image {
  position: relative;
  display: flex;
  overflow-x: auto; /* 이미지가 넘칠 경우 좌우 스크롤 */
  white-space: nowrap; /* 행 내부에서 줄바꿈 방지 */
}
.image-box {
  position: relative;
  margin-right: 6px;
  margin-block: 4px;
}
.review-image {
  height: 150px;
  float: left;
}

.btn-update {
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}
</style>
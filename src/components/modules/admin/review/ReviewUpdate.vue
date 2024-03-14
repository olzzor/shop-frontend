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

<style lang="scss" scoped>
@import "@/styles/modules/admin/review/review-update";
</style>
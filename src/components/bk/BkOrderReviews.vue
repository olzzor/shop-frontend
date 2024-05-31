<template>
  <div class="order-reviews" v-if="state.totalReviews > 0">
    <div class="title"></div>

    <div class="content">
      <div v-if="state.reviews.length > 0">
        <div class="review-summary">
          <div class="overall-average-rating">
            <div class="stars">
              <i v-for="index in 5" :key="index"
                 :class="index <= Math.round(state.averageRating * 2) / 2 ? (index <= state.averageRating ? 'bi bi-star-fill filled-star' : 'bi bi-star-half filled-star') : 'bi bi-star star'">
              </i>
            </div>
            <div class="total-reviews">
              <h1>{{ state.averageRating }}</h1>총 {{ state.totalReviews }}건
            </div>
          </div>

          <div class="score-specific-rating">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star">
              <div class="review-star">
                <i v-for="filledStar in star" :key="filledStar" class="bi bi-star-fill filled-star"></i>
                <i v-for="emptyStar in 5 - star" :key="emptyStar + 'empty'" class="bi bi-star star"></i>
              </div>
              <div class="review-bar">
                <div class="review-bar-filled" :style="{ width: ((state.countRating[star] || 0) / state.totalReviews) * 100 + '%' }"></div>
              </div>
              <div class="review-count">{{ state.countRating[star] || 0 }}</div>
            </div>
          </div>
        </div>

        <div class="review-detail">
          <div class="grid">
            <li v-for="r in state.reviews" :key="r.id">
              <div class="title-container">
                <div class="left-side">
                  <div class="review-rating">
                    <i v-for="index in 5" :key="index"
                       :class="index <= r.rating ? 'bi bi-star-fill filled-star' : 'bi bi-star star'"></i>
                  </div>
                  <div class="review-title">{{ r.title }}<i class="bi bi-image"
                                                            v-if="r.reviewImages && r.reviewImages.length"></i></div>
                </div>

                <div class="right-side">
                  <div class="review-writer">{{ r.userEmail }}</div>
                  <div class="review-date">{{ formatter.getFormattedDate(r.regDate, 'YYYY/MM/DD') }}</div>
                </div>
              </div>

              <div class="content-container">
                <div class="review-content">
                  <p v-html="formatter.convertLineBreaks(r.content)"></p>
                </div>
  <!--              <div class="review-images">-->
  <!--                <img v-for="ri in r.reviewImages" :key="ri.id" :src="`${ri.filePath}${ri.fileName}`" />-->
  <!--              </div>-->
                <div class="order-products-container">
                  <div class="product-images">
                    <img v-for="ps in r.productSizes" :key="ps.id"
                         :src="`${ps.product.productImages[0].filePath}${ps.product.productImages[0].fileName}`" />
                  </div>
                </div>
              </div>
            </li>
          </div>

          <button class="button btn-load-more" @click="loadMore">더 보기</button>
        </div>
      </div>

      <div v-else>
        <p>등록된 리뷰가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import formatter from "@/scripts/formatter";

export default {
  name: "OrderReviews",
  props: {productId: {type: Number, required: true}},
  setup() {
    const state = reactive({
      totalReviews: 0, averageRating: 0, countRating: {},
      reviews: [],
      page: {pageSize: 5, currentPage: 1, totalPages: 0},
    });

    const load = () => {
      // axios.get(`/api/review/product/${props.productId}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`).then(({data}) => {
      axios.get(`/api/review/all?page=${state.page.currentPage - 1}&size=${state.page.pageSize}`).then(({data}) => {
        console.log(data);
        if (state.page.currentPage === 1) {
          state.totalReviews = data.totalReviews;
          state.averageRating = data.averageRating;
          state.countRating = data.countRating;
        }
        state.reviews = state.reviews.concat(data.reviews);
        state.page.totalPages = data.totalPages;
      });
    }

    const loadMore = () => {
      state.page.currentPage++;
      load();
    }

    onMounted(load);

    return {
      formatter,
      state,
      load, loadMore
    }
  }
}
</script>

<style scoped>
.order-reviews {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  padding-inline: 15px;
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

.review-summary {
  display: flex;
  justify-content: space-between;
}

.total-reviews {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.total-reviews h1 {
  margin-right: 10px;
}

.score-specific-rating div{
  display: flex;
  align-items: center;
}

.score-specific-rating div{
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
}

.review-bar {
  height: 15px;
  width: 600px;
  background-color: #ECECEC;
  position: relative;
  margin-inline: 10px;
}

.review-bar-filled {
  position: absolute;
  height: 100%;
  background-color: black;
}

.stars i {
  font-size: 40px;
  margin-right: 5px;
}

.review-star i {
  font-size: 16px;
  margin-right: 3px;
}

.button {
  display: flex;
  justify-content: space-between;
}

.stars {
  display: flex;
  cursor: pointer;
}

.star {
  font-size: 24px;
  margin-right: 5px;
  color: #ccc; /* 비어있는 별의 색상 */
}

.filled-star {
  font-size: 24px;
  margin-right: 5px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ccc; /* 하단에 회색 테두리 */
  padding: 10px 0; /* 테두리와 리뷰 내용 사이의 간격을 추가 */
  gap: 20px; /* 리뷰와 제품 이미지 사이의 간격 */
}

.title-container {
  flex: 1; /* 전체 너비의 1부를 차지하게 설정 (이를 통해 가능한 모든 공간을 사용하게 됩니다) */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-side {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  gap: 10px;
}

.right-side {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.content-container {
  display: flex; /* 플렉스 박스로 설정하여 내부 아이템들을 수평 방향으로 배치합니다. */
  justify-content: space-between;
  align-items: flex-start; /* 상하 정렬은 상단으로 합니다. */
}

.review-content {
  flex: 1; /* 가능한 모든 공간을 차지하도록 설정합니다. */
  overflow-wrap: break-word; /* 텍스트가 너무 길면 줄바꿈이 되도록 설정합니다. */
}

.order-products-container {
  flex-shrink: 0;
  width: 300px; /* 우측의 order-products-container의 가로 길이를 고정으로 설정합니다. 원하는 크기로 조절할 수 있습니다. */
}

.product-images {
  display: flex;
  justify-content: flex-end;
}

.product-images img {
  max-height: 150px; /* 원하는 높이로 조정 */
  align-self: flex-end;
  margin-left: 10px;
}

.bi-image {
  margin-left: 10px;
  font-size: 1rem;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 100%;
  margin-block: 5px;
  border-radius: 5px;
  border: none; /* 테두리 제거 */
}

.btn-load-more {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

</style>
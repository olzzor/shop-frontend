<template>
  <div class="order-reviews" v-if="state.totalReviews > 0">
    <div class="title"></div>

    <div class="content">
      <div v-if="state.reviews.length > 0">
        <div class="review-summary">
          <div class="overall-average-rating">
            <div class="stars">
              <i v-for="index in 5" :key="index"
                 :class="index <= Math.round(state.averageRating) ? 'bi bi-star-fill filled-star' : 'bi bi-star-fill filled-star-gray'">
              </i>
            </div>
            <div class="total-reviews">
              <h2>{{ state.averageRating }}</h2>총 {{ state.totalReviews }}건
            </div>
          </div>

          <div class="score-specific-rating">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star">
              <div class="review-star">
                <i v-for="index in 5" :key="index"
                   :class="index <= star ? 'bi bi-star-fill filled-star-black' : 'bi bi-star-fill filled-star-gray'"></i>
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
<!--            <div class="item" v-for="r in displayedReviewImages" :key="r.id">-->
            <div class="item" v-for="r in state.reviews" :key="r.id">

              <div class="review">
                <div class="product-image-section">
                  <router-link :to="{ name: 'ProductDetail', params: { id: r.productSizes[currentProductImageIndices[r.id] || 0].product.id }}">
                    <span class="product-image-container" :style="{backgroundImage: `url(${r.productSizes[currentProductImageIndices[r.id] || 0].product.productImages[0].filePath}${r.productSizes[currentProductImageIndices[r.id] || 0].product.productImages[0].fileName})`}"></span>
                  </router-link>
                  <button class="btn-product-image-prev" v-if="r.productSizes.length > 1" @click="changeProductImage(r.id, -1)">◀</button>
                  <button class="btn-product-image-next" v-if="r.productSizes.length > 1" @click="changeProductImage(r.id, 1)">▶</button>
                </div>

                <div class="review-section">
                  <div class="rating-row">
                    <div class="review-rating">
                      <i v-for="index in 5" :key="index"
                         :class="index <= r.rating ? 'bi bi-star-fill filled-star-black' : 'bi bi-star-fill filled-star-gray'"></i>
                    </div>
                    <div class="review-writer">{{ r.userEmail }}</div>
                  </div>

                  <div class="content-row" @click="showReviewModal(r.id)">
                    <div class="review-title">{{ r.title }}</div>
                    <div class="review-content">
                      <p v-html="lib.convertLineBreaks(r.content)"></p>
                    </div>
                  </div>

                  <div class="review-image-row" v-if="r.reviewImages && r.reviewImages.length" @click="showReviewModal(r.id)">
                    <div v-for="(ri, idx) in displayReviewImages(r.id)" :key="idx">
                      <span class="review-image-container" :style="{backgroundImage: `url(${ri.filePath}${ri.fileName})`}"></span>
                    </div>
                    <button class="btn-review-image-prev" v-if="r.reviewImages.length > 5" @click="changeReviewImage(r.id, -1)">◀</button>
                    <button class="btn-review-image-next" v-if="r.reviewImages.length > 5" @click="changeReviewImage(r.id, 1)">▶</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="button" class="btn-load-more" v-if="state.page.currentPage < state.page.totalPages" @click="loadMore">VIEW MORE</button>
        </div>

        <ReviewModal v-if="state.showReviewModal" :show="state.showReviewModal"
                     :reviewId="state.selectedReviewId" @close="state.showReviewModal = false" />
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
import lib from "@/scripts/lib";
import ReviewModal from "@/components/modal/ReviewModal.vue";

export default {
  name: "OrderReviews",
  components: {ReviewModal},
  props: {productId: {type: Number, required: true}},
  setup() {
    const currentProductImageIndices = reactive({});
    const currentReviewImageIndices = reactive({});
    const state = reactive({
      showReviewModal: false, selectedReviewId: null,
      totalReviews: 0, averageRating: 0, countRating: {},
      reviews: [],
      page: {pageSize: 8, currentPage: 1, totalPages: 0},
    });

    const showReviewModal = (reviewId) => {
      state.selectedReviewId = reviewId;
      state.showReviewModal = true;
    };

    const displayReviewImages = (reviewId) => {
      const review = state.reviews.find(r => r.id === reviewId);
      const startIndex = currentReviewImageIndices[reviewId] || 0;
      let endIndex = startIndex + 5;
      let displayImages = review.reviewImages.slice(startIndex, endIndex);

      // 이미지 목록이 끝에 도달한 경우, 시작부터 추가로 이미지를 가져옴
      if (endIndex > review.reviewImages.length) {
        endIndex = endIndex - review.reviewImages.length;
        displayImages = displayImages.concat(review.reviewImages.slice(0, endIndex));
      }

      return displayImages;
    };

    const changeProductImage = (reviewId, direction) => {
      const totalImages = state.reviews.find(r => r.id === reviewId).productSizes.length;
      const currentIndex = currentProductImageIndices[reviewId] || 0;
      const nextIndex = (currentIndex + direction + totalImages) % totalImages;
      currentProductImageIndices[reviewId] = nextIndex;
    };

    const changeReviewImage = (reviewId, direction) => {
      const totalImages = state.reviews.find(r => r.id === reviewId).reviewImages.length;
      const currentIndex = currentReviewImageIndices[reviewId] || 0;
      let nextIndex = currentIndex + direction;

      if (nextIndex >= totalImages) {
        nextIndex = 0; // 시작으로 돌아감
      } else if (nextIndex < 0) {
        nextIndex = totalImages - 1; // 마지막으로 이동
      }

      currentReviewImageIndices[reviewId] = nextIndex;
    };

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
    };

    const loadMore = () => {
      state.page.currentPage++;
      load();
    };

    onMounted(load);

    return {
      lib,
      state,
      currentProductImageIndices, currentReviewImageIndices,
      showReviewModal,
      displayReviewImages, changeProductImage, changeReviewImage,
      load, loadMore
    }
  }
}
</script>

<style scoped>
.order-reviews {
  padding: 70px 0 20px 0;
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

.title {
}

.content {
}

.review-summary {
  display: flex;
  justify-content: space-between;
  margin: 30px 15px;
}

.total-reviews {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.total-reviews h2 {
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

.review-star i, .review-rating i {
  font-size: 16px;
  margin-right: 3px;
}

.filled-star-gray {
  color: lightgray;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 15px;
}

.review {
  display: flex; /* 플렉스박스 레이아웃 적용 */
  align-items: flex-start; /* 세로 방향으로 아이템들을 상단에 정렬 */
  border: 1px solid rgba(169, 169, 169, .3);
}

.product-image-section {
  position: relative;
  width: 45%; /* 이미지 섹션 너비 설정 */
}

.product-image-section button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  color: rgba(169, 169, 169, 0.7);
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.product-image-container {
  display: block;
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
}

.btn-product-image-prev {
  left: 5px;
}

.btn-product-image-next {
  right: 5px;
}

.review-section {
  flex-grow: 1; /* 남은 공간을 차지 */
  display: flex;
  flex-direction: column;
  height: 350px;
  width: 55%;
  padding: 10px 15px;
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 10px;
}

.content-row {
  margin-block: 5px;
}

.review-title {
  white-space: nowrap; /* 텍스트가 한 줄로만 표시되도록 설정 */
  overflow: hidden; /* 내용이 요소 크기를 넘어가면 내용을 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
  font-size: 15px;
  margin-bottom: 5px;
}

.review-content {
  overflow-wrap: break-word; /* 텍스트가 너무 길면 줄바꿈이 되도록 설정합니다. */
  overflow: hidden; /* 내용이 요소 크기를 넘어가면 내용을 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  color: darkgray;
}

.review-image-row {
  position: relative;
  display: flex;
  margin-top: auto;
  gap: 1.5px;
}

.review-image-row button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  color: rgba(169, 169, 169, 0.7);
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.review-image-container {
  display: block;
  width: 70px;
  height: 84px;
  background-size: cover;
  background-position: center;
}

.btn-review-image-prev {
  left: 3px;
}

.btn-review-image-next {
  right: 3px;
}

.btn-load-more {
  position: relative;
  display: flex;
  align-items: center;
  font-size: .75rem;
  justify-content: center;
  text-align: center;
  height: 40px;
  width: 150px;
  margin: 5px auto;
  border: none; /* 테두리 제거 */
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

</style>
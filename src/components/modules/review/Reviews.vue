<template>
  <div class="reviews" v-if="state.totalReviews > 0">
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
              <h2>{{ state.averageRating }}/5 점</h2>(총 {{ state.totalReviews }}건)
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
                    <span class="product-image-container" :style="{backgroundImage: `url(${r.productSizes[currentProductImageIndices[r.id] || 0].product.productImages[0].fileUrl})`}"></span>
                  </router-link>
                  <button type="button" class="btn-product-image-prev" v-if="r.productSizes.length > 1" @click="changeProductImage(r.id, -1)">◀</button>
                  <button type="button" class="btn-product-image-next" v-if="r.productSizes.length > 1" @click="changeProductImage(r.id, 1)">▶</button>
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
                      <span class="review-image-container" :style="{backgroundImage: `url(${ri.fileUrl})`}"></span>
                    </div>
                    <button type="button" class="btn-review-image-prev" v-if="r.reviewImages.length > 5" @click="changeReviewImage($event, r.id, -1)">◀</button>
                    <button type="button" class="btn-review-image-next" v-if="r.reviewImages.length > 5" @click="changeReviewImage($event, r.id, 1)">▶</button>
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
import ReviewModal from "@/components/modules/review/ReviewModal.vue";

export default {
  name: "Reviews",
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
      const imageCount = review.reviewImages.length; // 리뷰의 이미지 개수

      // 리뷰 이미지가 5개 이하인 경우, 전체 이미지 배열 반환
      if (imageCount <= 5) {
        return review.reviewImages;
      }

      const startIndex = currentReviewImageIndices[reviewId] || 0; // 현재 표시되고 있는 이미지의 시작 인덱스
      let endIndex = startIndex + 5; // 표시할 마지막 이미지의 인덱스 계산
      let displayImages = review.reviewImages.slice(startIndex, endIndex); // 시작 인덱스부터 끝 인덱스까지의 이미지를 잘라서 표시할 이미지 목록을 생성

      // 이미지 목록이 끝에 도달한 경우, 시작부터 추가로 이미지를 가져옴
      if (endIndex > imageCount) {
        endIndex = endIndex - imageCount;
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

    const changeReviewImage = (event, reviewId, direction) => {
      event.stopPropagation(); // 이벤트 버블링 중단

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

<style lang="scss" scoped>
@import "@/styles/modules/review/reviews";
</style>
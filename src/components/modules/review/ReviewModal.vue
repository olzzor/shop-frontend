<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <div class="review-info">
      <div class="rating-and-email">
        <div class="review-star">
          <i v-for="index in 5" :key="index"
           :class="index <= state.review.rating ? 'bi bi-star-fill filled-star-black' : 'bi bi-star-fill filled-star-gray'"></i>
        </div>
        <div class="review-user-email">{{ state.review.userEmail }}</div>
      </div>

      <div class="review-text">
        <div class="review-title">{{ state.review.title }}</div>
        <div class="review-content"><p v-html="formatter.convertLineBreaks(state.review.content)"></p></div>
      </div>
    </div>

    <div class="review-images" v-if="state.review.reviewImages && state.review.reviewImages.length">
      <transition name="slide-fade" mode="out-in">
<!--        <span class="image-container" :style="{backgroundImage: `url(${state.review.reviewImages[state.currentImageIndex].fileUrl})`}"></span>-->
        <img class="image-container" :src="`${state.review.reviewImages[state.currentImageIndex].fileUrl}`" />
      </transition>
      <button type="button" class="btn-image-prev" v-if="state.review.reviewImages.length > 1" @click="changeImage(-1)">◀</button>
      <button type="button" class="btn-image-next" v-if="state.review.reviewImages.length > 1" @click="changeImage(1)">▶</button>
    </div>

    <div class="footer">
      <div class="review-date">
        {{ formatter.getFormattedDate(state.review.regDate, 'YYYY/MM/DD') }}
        <span v-if="!isModDateAfterRegDate">(최근 수정 {{ formatter.getFormattedDate(state.review.modDate, 'YYYY-MM-DD') }})</span>
      </div>
      <div @click="close">닫기 X</div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import axios from "axios";
import formatter from "@/scripts/formatter";

export default {
  name: "ReviewModal",
  props: {show: Boolean, reviewId: Number},
  emits: ['close'],
  setup(props, {emit}) {
    const state = reactive({
      review: {},
      show: true,
      currentImageIndex: 0
    });

    const changeImage = (direction) => {
      const totalImages = state.review.reviewImages.length;
      state.currentImageIndex = (state.currentImageIndex + direction + totalImages) % totalImages;
    };

    const isModDateAfterRegDate = computed(() => {
      return new Date(state.review.modDate) !== new Date(state.review.regDate);
    });

    const close = () => {
      state.show = false;
      emit('close');
    };

    const load = () => {
      axios.get(`/api/review/public/${props.reviewId}`).then(({data}) => {
        state.review = data;

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    };

    onMounted(load);

    return {
      formatter,
      state, isModDateAfterRegDate,
      changeImage,close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/review/review-modal";
</style>

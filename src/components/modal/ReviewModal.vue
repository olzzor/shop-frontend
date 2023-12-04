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
        <div class="review-content"><p v-html="lib.convertLineBreaks(state.review.content)"></p></div>
      </div>
    </div>

    <div class="review-images" v-if="state.review.reviewImages && state.review.reviewImages.length">
      <span class="image-container" :style="{backgroundImage: `url(${state.review.reviewImages[state.currentImageIndex].filePath}${state.review.reviewImages[state.currentImageIndex].fileName})`}"></span>
      <button class="btn-image-prev" v-if="state.review.reviewImages.length > 1" @click="changeImage(-1)">◀</button>
      <button class="btn-image-next" v-if="state.review.reviewImages.length > 1" @click="changeImage(1)">▶</button>
    </div>

    <div class="footer">
      <div class="review-date">
        {{ lib.getFormattedDate(state.review.regDate, 'YYYY/MM/DD') }}
        <span v-if="!isModDateAfterRegDate">(최근 수정 {{ lib.getFormattedDate(state.review.modDate, 'YYYY-MM-DD') }})</span>
      </div>
      <div @click="close">닫기 X</div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";

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
      axios.get(`/api/review/${props.reviewId}`).then(({data}) => {
        state.review = data;

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
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
    };

    onMounted(load);

    return {
      lib,
      state, isModDateAfterRegDate,
      changeImage,close,
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검은색의 70% 투명도 */
  z-index: 999; /* 모달보다 하나 낮은 z-index */
}

.modal-content {
  position: fixed;
  top: 50%; /* 화면의 중앙에서 시작 */
  left: 50%; /* 화면의 중앙에서 시작 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 변환 */
  max-width: 600px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.rating-and-email {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 10px;
}

.review-star i {
  font-size: 16px;
  margin-right: 3px;
}

.review-text {
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
  color: darkgray;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 10px;
}

.review-images {
  position: relative;
}

.review-images button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  color: rgba(169, 169, 169, 0.7);
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.image-container {
  display: block;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center;
}

.btn-image-prev {
  left: 5px;
}

.btn-image-next {
  right: 5px;
}

.filled-star-gray {
  color: lightgray;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 10px;
}

.review-date {
  color: darkgray;
}
</style>

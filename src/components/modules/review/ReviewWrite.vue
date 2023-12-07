<template>
  <div class="write-review">
    <div class="title">
      리뷰 작성
    </div>

    <div class="content">
      <div class="field-container">
        <label for="review-rating" class="input-label">평점 <span class="required">*</span></label>
        <div class="field-content">
          <span class="message">평점을 입력해주세요.</span>
          <div id="review-rating" class="stars">
            <i v-for="(star, index) in 5" :key="index"
               :class="index < selectedStars ? 'bi bi-star-fill filled-star-black' : 'bi bi-star-fill filled-star-gray'"
               @mouseover="highlightStars(index)"
               @mouseout="resetStars"
               @click="selectStars(index)">
            </i>
          </div>
        </div>
      </div>

      <div class="field-container">
        <label for="review-title" class="input-label">제목 <span class="required">*</span></label>
        <div class="field-content">
          <span class="message">제목을 1자 이상, 100자 이하로 입력해주세요.</span>
          <input type="text" id="review-title" class="input-field" v-model="state.form.review.title">
        </div>
      </div>

      <div class="field-container">
        <label for="review-content" class="input-label">내용 <span class="required">*</span></label>
        <div class="field-content">
          <span class="message">내용을 1자 이상, 1000자 이하로 입력해주세요.</span>
          <textarea id="review-content" class="input-field" v-model="state.form.review.content" @input="autoGrow"/>
        </div>
      </div>

      <div class="field-container">
        <label for="review-images" class="input-label">이미지</label>
        <div class="field-content">
          <div class="review-images">
          <div class="image-box" v-for="(src, index) in images" :key="index">
            <img class="review-image" :src="src"/>
            <button class="btn-delete-image" @click="deleteImage(index)">X</button>
          </div>
          <div class="upload-box" @click="clickImageInput" @drop.prevent="dropImage" @dragover.prevent>
            <p><i class="bi bi-plus-lg"></i></p>
            <input type="file" id="review-images" multiple accept="image/*" ref="imageInput" @change="previewImage" style="display: none">
          </div>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button type="button" class="btn-write-reivew" @click="writeReview">작성하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import router from "@/scripts/router";
import {useRoute} from "vue-router";

export default {
  name: "WriteReview",
  setup() {
    const route = useRoute();
    const orderId = route.params.orderId;
    const hoveredStars = ref(0);
    const selectedStars = ref(0);
    const images = ref([]);
    const imageInput = ref(null);

    const state = reactive({
      form: {
        review: {orderId: orderId, rating: 0, title: "", content: ""},
        files: [],
      }
    });

    // 별을 마우스오버했을 때 강조 표시하는 로직
    const highlightStars = (index) => {
      selectedStars.value = index + 1;
    };

    // 별 위에서 마우스를 뗐을 때
    const resetStars = () => {
      selectedStars.value = state.form.review.rating;
    };

    // 별을 클릭했을 때 선택하는 로직
    const selectStars = (index) => {
      selectedStars.value = index + 1;
      state.form.review.rating = selectedStars.value;
      console.log("Selected stars:", selectedStars.value);
    };

    const clickImageInput = () => {
      if (imageInput.value) {
        imageInput.value.click();
      }
    };

    const previewImage = (event) => {
      const files = Array.from(event.target.files);
      for (let file of files) {
        images.value.push(URL.createObjectURL(file));
      }
      state.form.files = state.form.files.concat(files);
    };

    const dropImage = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      for (let file of files) {
        images.value.push(URL.createObjectURL(file));
      }
      state.form.files = state.form.files.concat(files);
    };

    const deleteImage = (index) => {
      images.value.splice(index, 1);
      state.form.files.splice(index, 1);
    };

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#review-content');
        textarea.style.height = '100px';
        textarea.style.height = (textarea.scrollHeight < 200 ? textarea.scrollHeight : 200) + 'px'; // 최대 높이 제한 (약 10줄)
      });
    };

    const checkInput = () => {
      let errorMessages = [];

      // rating 체크
      if (state.form.review.rating < 1 || state.form.review.rating > 5) {
        errorMessages.push("평점을 선택해 주세요.");
      }

      // title 체크
      if (!state.form.review.title || state.form.review.title.trim().length === 0) {
        errorMessages.push("제목을 입력해 주세요.");
      } else if (state.form.review.title.length > 100) {
        errorMessages.push("제목을 100자 이내로 입력해 주세요.");
      }

      // content 체크
      if (!state.form.review.content || state.form.review.content.trim().length === 0) {
        errorMessages.push("내용을 입력해 주세요.");
      } else if (state.form.review.content.length > 1000) {
        errorMessages.push("내용을 1000자 이내로 입력해 주세요.");
      }

      if (errorMessages.length > 0) {
        window.alert(errorMessages.join("\n"));
        return false;
      }

      return true;
    };

    const writeReview = () => {
      if (checkInput()) {
        const formData = new FormData();

        formData.append('review', JSON.stringify(state.form.review));
        state.form.files.forEach(file => {
          formData.append('files', file);
        });

        axios.post('/api/review/write', formData, {
          headers: {'Content-Type': 'multipart/form-data'}

        }).then(() => {
          window.alert('작성되었습니다.');
          router.push({path: "/"});

        }).catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 400: // BAD_REQUEST
                window.alert(error.response.data.message);
                break;
              case 401: // UNAUTHORIZED
                window.alert(error.response.data.message);
                break;
              default:
                window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
          } else {
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        });
      }
    };

    onMounted(autoGrow);

    return {
      hoveredStars, selectedStars, imageInput, images, state,
      highlightStars, resetStars, selectStars,
      clickImageInput, previewImage, dropImage, deleteImage,
      autoGrow, writeReview,
      // checkFileUpload,
    }
  }
}
</script>

<style scoped>
.write-review {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-inline: auto;
  max-width: 800px;
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

.input-label {
  margin-right: 10px; /* 라벨과 입력 필드 사이의 간격 */
  font-weight: bold; /* 라벨 텍스트를 굵게 표시 */
  width: 100px; /* 라벨의 너비를 고정합니다. */
  flex-shrink: 0;
}

.field-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.field-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px; /* 라벨과의 간격 조절 */
}

.input-field {
  margin-bottom: 10px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  height: 30px;
  background-color: transparent;
}

.review-images {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.image-box {
  position: relative;
  margin-right: 10px;
}

.review-image {
  height: 150px;
  float: left;
}

.btn-delete-image {
  position: absolute;
  right: 0;
  top: 0;
  border: none;
  background-color: black;
  color: white;
}

.upload-box {
  height: 150px;
  width: 100px;
  border: 1px solid lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
}

.upload-box p {
  font-size: 20px;
  color: darkgray;
}

.button-container {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
}

.btn-write-reivew {
  border: none;
  border-radius: 5px;
  font-size: .75rem;
  font-weight: 700;
  width: 70%;
  height: 2.8125rem;
  justify-content: center;
  text-align: center;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}

.stars {
  display: flex;
  cursor: pointer;
}

.filled-star-black {
  font-size: 24px;
  margin-right: 5px;
}

.filled-star-gray {
  font-size: 24px;
  margin-right: 5px;
  color: lightgray;
}

.required {
  color: #dc3545;
}

.message {
  font-size: 12px;
  margin-bottom: 5px;
  color: darkgray;
}
</style>
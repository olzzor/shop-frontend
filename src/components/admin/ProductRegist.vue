<template>
  <div class="product-regist">
    <div class="title">
      <p>상품 등록</p>
      <button type="button" class="btn-create-product" @click="createProduct">등록하기</button>
    </div>

    <div class="category-container">
      <label for="product-category" class="input-label">카테고리</label>
      <select id="product-category" class="select-field" v-model="state.form.product.categoryCode">
        <option disabled value="">카테고리를 선택해주세요.</option>
        <option v-for="code in categoryCodes" :key="code" :value="code">
          {{ lib.getCategoryName(code) }}
        </option>
      </select>
    </div>

    <div class="content">
      <div class="name-container">
        <label for="product-name" class="input-label">상품명</label>
        <input type="text" id="product-name" class="input-field" v-model="state.form.product.name">
      </div>

      <div class="price-container">
        <label for="product-price" class="input-label">가격</label>
        <input type="number" step="1" min="0" id="product-price" class="input-field" v-model="state.form.product.price"
               placeholder="가격">
      </div>

      <div class="discount-container">
        <label for="product-discount" class="input-label">할인 비율</label>
        <input type="number" min="0" max="100" id="product-discount" class="input-field"
               v-model="state.form.product.discountPer" placeholder="할인 비율">
      </div>

      <div class="size-container">
        <label for="product-size" class="input-label">사이즈
          <i class="bi bi-plus-square-fill" @click="addSizeInput"></i>
        </label>

        <div class="size-inputs-scrollable">
          <div v-for="(size, index) in state.form.sizes" :key="index" class="size-input-container">
            <input type="text" :id="'product-size-size' + index" class="input-field size-input"
                   v-model="state.form.sizes[index].size" placeholder="상품 사이즈"/>
            <input type="number" step="1" min="0" :id="'product-size-quantity-' + index"
                   class="input-field quantity-input"
                   v-model="state.form.sizes[index].quantity" placeholder="재고 수량"/>
            <i class="bi bi-dash-square-fill" @click="state.form.sizes.splice(index, 1)"></i>
          </div>
        </div>
      </div>

      <div class="detail-container">
        <label for="product-detail" class="input-label">상세 설명</label>
        <textarea class="input-field" id="product-detail" placeholder="설명" v-model="state.form.product.detail"
                  @input="autoGrow"/>
      </div>

      <div class="images-container">
        <label for="product-images" class="input-label">상품 이미지</label>
        <div class="image-box" v-for="(src, index) in images" :key="index">
          <img class="product-image" :src="src"/>
          <button class="delete-button" @click="deleteImage(index)">X</button>
        </div>
        <div class="upload-box" @click="clickImageInput" @drop.prevent="dropImage" @dragover.prevent>
          <p>+</p>
          <input type="file" id="product-images" multiple accept="image/*" ref="imageInput" @change="previewImage"
                 style="display: none">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import lib from "../../scripts/lib";

export default {
  name: "ProductRegist",
  components: {},
  setup() {
    const categoryCodes = lib.categoryCodes;
    const images = ref([]);
    const imageInput = ref(null);

    const state = reactive({
      form: {
        product: {categoryCode: '', name: '', price: 1, discountPer: 0, detail: '',},
        sizes: [{size: '', quantity: 1}],
        files: [],
      }
    });

    const addSizeInput = () => {
      state.form.sizes.push({size: "", quantity: 1});
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

    const createProduct = async () => {
      const formData = new FormData();

      formData.append('product', JSON.stringify(state.form.product));
      formData.append('sizes', JSON.stringify(state.form.sizes));
      state.form.files.forEach(file => {
        formData.append('files', file);
      });

      axios.post('/api/product/register', formData, {
        headers: {'Content-Type': 'multipart/form-data'}

      }).then(() => {
        window.alert('등록되었습니다.');
        location.reload();

      }).catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 400: // BAD_REQUEST
              window.alert(error.response.data.message);
              break;
            case 401:
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

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#product-detail');
        textarea.style.height = '100px';
        textarea.style.height = (textarea.scrollHeight < 200 ? textarea.scrollHeight : 200) + 'px'; // 최대 높이 제한 (약 10줄)
      });
    };

    onMounted(autoGrow);

    return {
      lib, categoryCodes,
      imageInput, images, state,
      addSizeInput,
      clickImageInput, previewImage, dropImage, deleteImage,
      autoGrow, createProduct,
    }
  }
}
</script>

<style scoped>
.product-regist {
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

.input-field, .select-field {
  margin-bottom: 10px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  height: 30px;
  background-color: transparent;
}

.input-field {
  width: 90%;
}
/* 웹킷 기반 브라우저(Chrome, Safari 등)의 자동완성 스타일을 덮어쓰기 위한 코드 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

.select-field {
  width: 40%;
}

.input-label {
  margin-right: 10px; /* 라벨과 입력 필드 사이의 간격 */
  font-weight: bold; /* 라벨 텍스트를 굵게 표시 */
  width: 100px; /* 라벨의 너비를 고정합니다. */
}

.category-container, .name-container, .price-container, .discount-container, .size-container, .detail-container, .images-container {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #e3e3e3;
  margin-block: 2px;
}

.size-inputs-scrollable {
  max-width: 90%; /* 가로 너비 제한 */
  overflow-x: auto; /* 가로 스크롤 활성화 */
  white-space: nowrap; /* 줄 바꿈 방지 */
  margin-bottom: 10px;
}

.size-input-container {
  display: inline-flex; /* 가로로 배열 */
  margin-right: 10px; /* 각 입력란 사이의 간격 */
}

.size-input {
  width: 80px; /* 원하는 길이로 조정 */
  margin-right: 10px; /* 오른쪽 간격 추가 */
}

.quantity-input {
  width: 70px; /* 원하는 길이로 조정 */
}

.image {
  position: relative;
  display: inline-block;
  display: flex;
  overflow-x: auto;
}

.image-box {
  position: relative;
  margin-right: 10px;
}

.product-image {
  height: 150px;
  float: left;
}

.delete-button {
  position: absolute;
  right: 0;
  top: 0;
  background-color: black;
  color: white;
  border: none; /* 입체적인 테두리 제거 */
  box-shadow: none; /* 그림자 효과 제거 */
  text-shadow: none; /* 텍스트 그림자 효과 제거 */
  outline: none; /* 선택 시 나타나는 외곽선 제거 */
}

.upload-box {
  height: 150px;
  width: 100px;
  border: 1px solid #e3e3e3;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
}

.upload-box p {
  font-size: 24px;
  color: #ccc;
}

.btn-create-product {
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
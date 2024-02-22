<template>
  <div class="product-regist">
    <div class="title">
      <p>상품 등록</p>
      <button class="btn-create-product" @click="createProduct">등록하기</button>
    </div>

    <div class="content">
      <div class="category-container">
        <label for="product-category" class="input-label">카테고리</label>
        <select id="product-category" class="select-field" v-model="state.form.product.categoryCode">
          <option disabled value="">카테고리를 선택해주세요.</option>
          <option v-for="code in categoryCodes" :key="code" :value="code">
            {{ lib.getCategoryName(code) }}
          </option>
        </select>
      </div>

      <div class="name-container">
        <label for="product-name" class="input-label">상품명</label>
        <input type="text" id="product-name" class="input-field" v-model="state.form.product.name" />
      </div>

      <div class="price-container">
        <label for="product-price" class="input-label">가격</label>
        <div class="input-container">
          <input type="number" step="1" min="0" id="product-price" class="input-field"
                 v-model="state.form.product.price" placeholder="가격" />
          <div class="error-message" v-if="state.errorMessage.price">{{ state.errorMessage.price }}</div>
        </div>
      </div>

      <div class="discount-container">
        <label for="product-discount" class="input-label">할인율</label>
        <div class="input-container">
          <input type="number" min="0" max="99" id="product-discount" class="input-field"
                 v-model="state.form.product.discountPer" placeholder="할인율" />
          <div class="error-message" v-if="state.errorMessage.discountPer">{{ state.errorMessage.discountPer }}</div>
        </div>
      </div>

      <div class="size-container">
        <label for="product-size" class="input-label">사이즈
          <i class="bi bi-plus-square-fill" @click="addSizeInput"></i>
        </label>

        <div class="size-inputs-scrollable">
          <div v-for="(size, index) in state.form.sizes" :key="index" class="size-input-container">
            <input type="text" :id="'product-size-size' + index" class="input-field size-input"
                   v-model="state.form.sizes[index].size" placeholder="상품 사이즈" />
            <input type="number" step="1" min="0" :id="'product-size-quantity-' + index"
                   class="input-field quantity-input" placeholder="재고 수량"
                   v-model="state.form.sizes[index].quantity" />
            <i class="bi bi-dash-square-fill" @click="state.form.sizes.splice(index, 1)"></i>
          </div>
        </div>
      </div>

      <div class="detail-container">
        <label for="product-detail" class="input-label">상세 설명</label>
        <textarea class="input-field" id="product-detail" placeholder="설명"
                  v-model="state.form.product.detail" @input="autoGrow"/>
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
                 style="display: none" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import lib from "../../../../scripts/lib";

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
      },
      errorMessage: {},
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

    const checkInput = () => {
      let result = true;
      state.errorMessage = {};

      if (state.form.product.price == null || state.form.product.price === '') {
        state.errorMessage.price = "가격을 입력해주세요.";
        result = false;
      } else if (state.form.product.price < 1) {
        state.errorMessage.price = "가격은 1 이상의 값이어야 합니다.";
        result = false;
      }

      if (state.form.product.discountPer == null || state.form.product.discountPer === '') {
        state.errorMessage.discountPer = "할인율을 입력해주세요.";
        result = false;
      } else if (state.form.product.discountPer < 0 || state.form.product.discountPer >= 100) {
        state.errorMessage.discountPer = "할인율은 0 이상 100 미만의 값이어야 합니다.";
        result = false;
      }

      return result;
    };

    const createProduct = async () => {
      if (checkInput()) {
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
            const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
            window.alert(errorMessage);
          } else {
            window.alert('오류가 발생했습니다. 다시 시도해주세요.');
          }
        });
      }
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

<style lang="scss" scoped>
@import "@/styles/modules/admin/product/product-regist";
</style>
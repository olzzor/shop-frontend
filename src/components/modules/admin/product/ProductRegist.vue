<template>
  <div class="product-regist">
    <div class="title">
      <p>상품 등록</p>
      <button type="button" class="btn-create-product" @click="createProduct" :disabled="state.isSubmitting">등록하기</button>
    </div>

    <div class="content">
      <!-- 카테고리 -->
      <div class="category-container">
        <label class="input-label" for="product-category">카테고리 <span class="required">*</span></label>

        <div class="input-container">
          <div class="category-input-container">
            <!-- 대카테고리 -->
            <div class="select-container">
              <select class="select-field" id="product-category-main"
                      v-model="state.categorySelection.selectedMainCategoryCode" @change="updateSubCategories">
                <option disabled value="">카테고리를 선택해주세요.</option>
                <option v-for="cat in categories" :key="cat.code" :value="cat.code">{{ cat.name }}</option>
              </select>
            </div>

            <!-- 소카테고리 -->
            <div class="select-container">
              <select class="select-field" id="product-category"
                      v-model="state.form.product.categoryCode" :disabled="state.categorySelection.isSubCategoryDisabled">
                <option disabled value="">카테고리를 선택해주세요.</option>
                <option v-for="cat in state.categorySelection.subCategories" :key="cat.code" :value="cat.code">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="error-message" v-if="state.errorMessage.categoryCode">{{ state.errorMessage.categoryCode }}</div>
        </div>
      </div>

      <!-- 이름 -->
      <div class="name-container">
        <label class="input-label" for="product-name">이름 <span class="required">*</span></label>
        <div class="input-container">
          <input type="text" class="input-field" id="product-name" v-model="state.form.product.name" />
          <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>
        </div>
      </div>

      <!-- 가격 -->
      <div class="price-container">
        <label class="input-label" for="product-price">가격 <span class="required">*</span></label>
        <div class="input-container">
          <input type="number" step="1" min="0" class="input-field" id="product-price"
                 placeholder="가격" v-model="state.form.product.price" />
          <div class="error-message" v-if="state.errorMessage.price">{{ state.errorMessage.price }}</div>
        </div>
      </div>

      <!-- 할인율 -->
      <div class="discount-container">
        <label class="input-label" for="product-discount">할인율 <span class="required">*</span></label>
        <div class="input-container">
          <input type="number" min="0" max="99" class="input-field" id="product-discount"
                 placeholder="할인율" v-model="state.form.product.discountPer" />
          <div class="error-message" v-if="state.errorMessage.discountPer">{{ state.errorMessage.discountPer }}</div>
        </div>
      </div>

      <!-- 사이즈 -->
      <div class="size-container">
        <label class="input-label" for="product-size">사이즈 <span class="required">*</span>
          &nbsp;<i class="bi bi-plus-square-fill" @click="addSizeInput"></i>
        </label>
        <div class="input-container">
          <div class="size-inputs-scrollable">
            <div class="size-input-container" v-for="(size, index) in state.form.sizes" :key="index" >
              <input type="text" class="input-field size-input" :id="'product-size-size' + index"
                     placeholder="상품 사이즈" v-model="state.form.sizes[index].size" />
              <input type="number" step="1" min="0" class="input-field quantity-input" :id="'product-size-quantity-' + index"
                     placeholder="재고 수량" v-model="state.form.sizes[index].quantity" />
              <i class="bi bi-dash-square-fill" @click="state.form.sizes.splice(index, 1)"></i>
            </div>
          </div>
          <div class="error-message" v-if="state.errorMessage.size">{{ state.errorMessage.size }}</div>
        </div>
      </div>

<!--      &lt;!&ndash; 사이즈 가이드 &ndash;&gt;-->
<!--      <div class="detail-container">-->
<!--        <label class="input-label" for="product-detail">사이즈 가이드</label>-->
<!--        <div class="input-container">-->
<!--          <textarea class="input-field" id="product-detail" placeholder="설명을 입력해주세요."-->
<!--                    v-model="state.form.detail.sizeGuide" @input="autoGrow"/>-->
<!--          <div class="error-message" v-if="state.errorMessage.detailSizeGuide">{{ state.errorMessage.detailSizeGuide }}</div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 이미지 -->
      <div class="images-container">
        <label class="input-label" for="product-images">이미지 <span class="required">*</span></label>
        <div class="image-box" v-for="(src, index) in images" :key="index">
          <img class="product-image" :src="src"/>
          <button type="button" class="btn-delete" @click="deleteImage(index)">X</button>
        </div>
        <div class="upload-box" @click="clickImageInput" @drop.prevent="dropImage" @dragover.prevent>
          <p>+</p>
          <input type="file" id="product-images" multiple accept="image/*" ref="imageInput" style="display: none"
                 @change="previewImage" />
        </div>
      </div>

      <!-- 제품 설명 -->
      <div class="detail-description-container">
        <label class="input-label" for="product-detail-description">제품 설명</label>
        <div class="input-container">
          <textarea class="input-field" id="product-detail-description" placeholder="설명을 입력해주세요."
                    v-model="state.form.detail.description" @input="autoGrow"/>
          <div class="error-message" v-if="state.errorMessage.detailDescription">{{ state.errorMessage.detailDescription }}</div>
        </div>
      </div>

      <!-- 상세 정보 -->
      <div class="detail-content-container">
        <label class="input-label" for="product-detail-content">상세 정보</label>
        <div class="input-container">
          <CKEditor id="product-detail-content" v-model="editorContent" :uploadType="'products'"/>
          <div class="error-message" v-if="state.errorMessage.detailContent">{{ state.errorMessage.detailContent }}</div>
        </div>
      </div>

      <!-- 표시 유무 20240411 추가 -->
      <div class="display-container">
        <label class="input-label" for="product-display">표시 <span class="required">*</span></label>
        <div class="input-container">
          <div class="select-container">
            <select class="select-field" id="product-display" v-model="state.form.product.isDisplay">
              <option :value="true">표시</option>
              <option :value="false">비표시</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import CKEditor from "@/components/common/CKEditor.vue";
import constants from "@/scripts/constants";

export default {
  name: "ProductRegist",
  components: {CKEditor},
  setup() {
    const categories = constants.CATEGORIES;
    const images = ref([]);
    const imageInput = ref(null);

    const editorContent = ref('');
    const state = reactive({
      isSubmitting: false,
      categorySelection: {selectedMainCategoryCode: '', subCategories: [], isSubCategoryDisabled: true,},
      form: {
        product: {categoryCode: '', name: '', price: 1, discountPer: 0, isDisplay: true},
        sizes: [{size: '', quantity: 1}],
        detail: {description: '', content: ''},
        files: [],
      },
      errorMessage: {},
    });

    const updateSubCategories = () => {
      const category = categories.find(cat => cat.code === state.categorySelection.selectedMainCategoryCode);

      if (category && category.subCategories) { // 서브 카테고리가 존재하는 경우
        state.categorySelection.isSubCategoryDisabled = false; // 서브 카테고리 셀렉트 박스 활성
        state.categorySelection.subCategories = category.subCategories; // 서브 카테고리값 취득
        state.form.product.categoryCode = ''; // 카테고리 선택값 초기화

      } else { // 서브 카테고리가 존재하지 않는 경우
        state.categorySelection.isSubCategoryDisabled = true; // 서브 카테고리 셀렉트 박스 비활성
        state.categorySelection.subCategories = [];
        state.form.product.categoryCode = category.code; // 카테고리 선택값으로 메인 카테고리 코드값 사용
      }
    };

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

      const MAX_NAME_LENGTH = 100;
      const MAX_DETAIL_DESCRIPTION_LENGTH = 2000;
      const MAX_DETAIL_CONTENT_LENGTH = 10000;

      state.errorMessage = {};

      if (!state.form.sizes.length || state.form.sizes.some(size => size.size === '' || size.quantity === '')) {
        state.errorMessage.size = "하나 이상의 사이즈를 입력해주세요.";
        result = false;
      }

      if (state.form.product.categoryCode.length === 0) {
        state.errorMessage.categoryCode = "카테고리를 선택해주세요.";
        result = false;
      }

      if (state.form.product.name.length === 0) {
        state.errorMessage.name = "상품명을 입력해주세요.";
        result = false;
      } else if (state.form.product.name.length > MAX_NAME_LENGTH) {
        state.errorMessage.name = `상품명은 ${MAX_NAME_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

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

      if (state.form.detail.description && state.form.detail.description.length > MAX_DETAIL_DESCRIPTION_LENGTH) {
        state.errorMessage.detailDescription = `제품 설명은 ${MAX_DETAIL_DESCRIPTION_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      if (state.form.detail.content && state.form.detail.content.length > MAX_DETAIL_CONTENT_LENGTH) {
        state.errorMessage.detailContent = `상세 정보는 ${MAX_DETAIL_CONTENT_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      return result;
    };

    const createProduct = async () => {
      state.isSubmitting = true;

      if (checkInput()) {
        state.form.detail.content = editorContent.value;

        const formData = new FormData();

        formData.append('product', JSON.stringify(state.form.product));
        formData.append('detail', JSON.stringify(state.form.detail));
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

        }).finally(() => {
          state.isSubmitting = false;
        });

      } else {
        state.isSubmitting = false;
      }
    };

    const autoGrow = () => {
      nextTick(() => {
        const textareas = document.querySelectorAll('textarea.input-field');
        textareas.forEach(textarea => {
          textarea.style.height = '100px';
          textarea.style.height = (textarea.scrollHeight < 150 ? textarea.scrollHeight : 150) + 'px';
        });
      });
    };

    onMounted(autoGrow);

    return {
      lib,
      categories, imageInput, images, editorContent, state,
      updateSubCategories,
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
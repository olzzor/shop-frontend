<template>
  <div class="product-update">
    <div class="title">
      <p>상품 상세 및 변경</p>
      <button type="button" class="btn-update" @click="updateProduct">변경하기</button>
    </div>

    <div class="content">
      <span style="color: #dc3545;">
        ※ 상품의 가격 및 할인율은 판매중에 변경할 수 없습니다. 내용을 변경하고자 하는 경우, 먼저 '일시 품절' 상태로 갱신한 후 변경하세요.
        가격 변경 중에 주문이 이루어지는 경우, 실제 결제 금액과 다른 금액의 주문 이력이 작성될 수 있습니다.
      </span>

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
          <td class="table-title">상품 코드</td>
          <td>{{ state.product.code }}</td>
          <td>{{ state.form.product.code }}</td>
        </tr>

        <tr>
          <td class="table-title">상품 분류</td>
          <td>{{ state.product.categoryName }}</td>
          <td>
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
<!--            <select class="select-field" v-model="state.form.product.categoryCode">-->
<!--              <option disabled value="">상품 분류</option>-->
<!--              <option v-for="fc in flattenCategories" :key="fc.code" :value="fc.code">{{ fc.name }}</option>-->
<!--            </select>-->
          </td>
        </tr>

        <tr>
          <td class="table-title">상품 명</td>
          <td>{{ state.product.name }}</td>
          <td>
            <input type="text" class="input-field" v-model="state.form.product.name" />
            <div class="error-message" v-if="state.errorMessage.name">{{ state.errorMessage.name }}</div>
          </td>
        </tr>

        <tr>
          <td class="table-title">사이즈</td>
          <td>
            <div v-for="(ps, index) in state.product.productSizes" :key="'before-' + index" class="product-size-before">
              {{ ps.size }}: {{ ps.quantity }}개
            </div>
          </td>
          <td>
            <div class="size-inputs-scrollable">
              <div v-for="(size, index) in state.form.sizes" :key="'after-' + index" class="product-size-after">
                {{ size.size }}:&nbsp;
                <input type="number" class="input-field quantity-input" placeholder="재고 수량"
                       v-model="size.adjustmentQuantity" />
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="table-title">제품 설명</td>
          <td v-html="formatter.convertLineBreaks(state.product.detail.description)"></td>
          <td>
            <textarea class="input-field" v-model="state.form.detail.description" @input="autoGrow" />
            <div class="error-message" v-if="state.errorMessage.detailDescription">{{ state.errorMessage.detailDescription }}</div>
          </td>
        </tr>

        <tr>
          <td class="table-title">상세 내용</td>
          <td>(생략)</td>
          <td><router-link :to="{ name: 'AdminProductDetailContentUpdate', params: { id: state.product.detail.id }}">내용 변경</router-link></td>
        </tr>

<!--        <tr>-->
<!--          <td class="table-title">사이즈 가이드</td>-->
<!--          <td v-html="formatter.convertLineBreaks(state.product.detail.sizeGuide)"></td>-->
<!--          <td>-->
<!--            <textarea class="input-field" v-model="state.form.detail.sizeGuide" @input="autoGrow" />-->
<!--            <div class="error-message" v-if="state.errorMessage.detailSizeGuide">{{ state.errorMessage.detailSizeGuide }}</div>-->
<!--          </td>-->
<!--        </tr>-->

        <tr>
          <td class="table-title">가격</td>
          <td>{{ formatter.getFormattedNumber(state.product.price) }}원</td>
          <td>
            <input type="number" class="input-field" min="1" placeholder="가격"
                   v-model="state.form.product.price" :disabled="state.product.status === 'ON_SALE'" />
            <div class="error-message" v-if="state.errorMessage.price">{{ state.errorMessage.price }}</div>
          </td>
        </tr>

        <tr>
          <td class="table-title">할인율</td>
          <td>{{ formatter.getFormattedNumber(state.product.discountPer) }}%</td>
          <td>
            <input type="number" class="input-field" min="0" max="99" placeholder="할인율"
                   v-model="state.form.product.discountPer" :disabled="state.product.status === 'ON_SALE'" />
            <div class="error-message" v-if="state.errorMessage.discountPer">{{ state.errorMessage.discountPer }}</div>
          </td>
        </tr>

        <tr>
          <td class="table-title">이미지</td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(pf, index) in state.product.productImages" :key="index">
                <img class="product-image" :src="`${pf.fileUrl}`" @click="showImage(pf.fileUrl)"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(src, index) in images" :key="index">
                <img class="product-image" :src="src"/>
                <button type="button" class="btn-delete-image" @click="deleteImage(index)">X</button>
              </div>
              <div class="upload-box" @click="clickImageInput" @drop.prevent="dropImage" @dragover.prevent>
                <p>+</p>
                <input type="file" multiple accept="image/*" ref="imageInput" @change="previewImage" style="display: none">
              </div>
            </div>
          </td>
        </tr>

        <!-- 20240411 추가 -->
        <tr>
          <td class="table-title">표시 유무</td>
          <td>{{ state.product.isDisplay ? '표시': '비표시'}}</td>
          <td>
            <select class="select-field" v-model="state.form.product.isDisplay">
              <option :value="true">표시</option>
              <option :value="false">비표시</option>
            </select>
          </td>
        </tr>

        <tr>
          <td class="table-title">판매 상태</td>
          <td>{{ formatter.getProductStatusName(state.product.status) }}</td>
          <td>
            <select class="select-field" v-model="state.form.product.status">
              <option disabled value="">판매 상태</option>
              <option v-for="ps in productStatuses" :key="ps.key" :value="ps.key">{{ ps.description }}</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";

export default {
  name: 'ProductUpdate',
  components: {},
  setup() {
    const flattenCategories = formatter.getFlattenCategories();
    const categories = constants.CATEGORIES;
    const productStatuses = constants.PRODUCT_STATUSES;

    const route = useRoute();
    const images = ref([]);
    const imageInput = ref(null);
    const existingImages = ref([]);

    const state = reactive({
      categorySelection: {selectedMainCategoryCode: '', subCategories: [], isSubCategoryDisabled: true,},
      product: {
        id: 0, categoryCode: '', categoryName: '', code: '', name: '', price: 1, discountPer: 0, isDisplay: true, status: '',
        detail: {},
        productSizes: [],
        productImages: []
      },
      form: {
        product: {id: 0, categoryCode: '', code: '', name: '', price: 1, discountPer: 0, isDisplay: true, status: '',},
        detail: {id: 0, description: '', sizeGuide: ''},
        sizes: [],
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

    const showImage = (fileUrl) => {
      window.open(fileUrl, '_blank');
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
        existingImages.value.push({
          displayOrder: (existingImages.value.length > 0)
              ? existingImages.value[existingImages.value.length - 1].displayOrder + 1
              : 0
        });
      }
      state.form.files = state.form.files.concat(files);
    };

    const dropImage = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      for (let file of files) {
        images.value.push(URL.createObjectURL(file));
        existingImages.value.push({
          displayOrder: (existingImages.value.length > 0)
              ? existingImages.value[existingImages.value.length - 1].displayOrder + 1
              : 0
        });
      }
      state.form.files = state.form.files.concat(files);
    };

    const deleteImage = (index) => {
      if (window.confirm("이미지를 삭제하시겠습니까?")) {
        // 미리보기 이미지 및 파일 제거
        images.value.splice(index, 1);
        state.form.files.splice(index, 1);

        // existingImages 에서 해당 항목 제거
        existingImages.value.splice(index, 1);

        // displayOrder 갱신
        for (let i = index; i < existingImages.value.length; i++) {
          existingImages.value[i].displayOrder -= 1;
        }
      }
    };

    const checkInput = () => {
      let result = true;

      const MAX_NAME_LENGTH = 100;
      const MAX_DETAIL_DESCRIPTION_LENGTH = 2000;
      const MAX_DETAIL_SIZE_GUIDE_LENGTH = 2000;

      state.errorMessage = {};

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

      if (state.form.detail.sizeGuide && state.form.detail.sizeGuide.length > MAX_DETAIL_SIZE_GUIDE_LENGTH) {
        state.errorMessage.detailSizeGuide = `사이즈 가이드는 ${MAX_DETAIL_SIZE_GUIDE_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      return result;
    };

    const updateProduct = async () => {
      if (checkInput()) {
        const formData = new FormData();

        formData.append('product', JSON.stringify(state.form.product))
        formData.append('detail', JSON.stringify(state.form.detail));
        formData.append('sizes', JSON.stringify(state.form.sizes));
        formData.append('existingImages', JSON.stringify(existingImages.value));
        state.form.files.forEach(file => {
          formData.append('files', file);
        });

        axios.post('/api/product/update/single', formData, {
          headers: {'Content-Type': 'multipart/form-data'}

        }).then(() => {
          window.alert('변경되었습니다.');
          load();

        }).catch(() => {
          window.alert('상품의 상세 내용 변경에 실패하였습니다.');
        });
      }
    };

    const load = () => {
      axios.get(`/api/product/detail/${route.params.id}`).then(({data}) => {
        setLoadData(data);
        autoGrow();
      });
    };

    const setLoadData = (data) => {
      state.product = {
        id: data.id,
        categoryCode: data.category.code,
        categoryName: data.category.name,
        code: data.code,
        name: data.name,
        price: data.price,
        discountPer: data.discountPer,
        isDisplay: data.isDisplay, // 20240411 추가
        status: data.status,
        detail: data.detail, // 20240403 추가
        productSizes: data.productSizes,
        productImages: data.productImages,
      };
      state.form.product = {
        id: data.id,
        code: data.code,
        name: data.name,
        price: data.price,
        discountPer: data.discountPer,
        isDisplay: data.isDisplay, // 20240411 추가
        status: data.status,
      };
      state.form.detail = { // 20240403 추가
        id: data.detail.id,
        description: data.detail.description,
        sizeGuide: data.detail.sizeGuide,
      };
      state.form.sizes = data.productSizes.map(ps => ({
        id: ps.id,
        size: ps.size,
        quantity: ps.quantity,
        // adjustmentQuantity 는 백엔드에서 재고 업데이트의 경우, 프론트에서 입력된 수정 전후의 수량차로 갱신하기 위함. 업데이트 시 실시간으로 상품이 판매되어 수량이 변경된 경우에 대비하기 위함.
        adjustmentQuantity: ps.quantity,
      }));
      state.form.files = [];

      /** 입력 카테고리 초기 선택값 설정 */
      // 변경 전 카테고리 코드가 일치하는 서브 카테고리를 갖는 메인 카테고리 취득
      const categoryCodeBefore = state.product.categoryCode;
      const selectedCategory = categories.find(cat => cat.subCategories?.some(subCat => subCat.code === categoryCodeBefore));

      if (selectedCategory) { // 카테고리가 취득된 경우
        state.categorySelection.selectedMainCategoryCode = selectedCategory.code; // 해당 카테고리 코드를 변경 후 메인 카테고리 초기값으로 설정
        updateSubCategories(); // 메인 카테고리에 속한 서브 카테고리 목록 업데이트
        state.form.product.categoryCode = categoryCodeBefore; // 변경 전 카테고리 코드를 변경 후 카테고리 코드 초기값으로 설정

      } else { // 카테고리가 취득되지 않은 경우 (변경 전 카테고리 코드가 메인 카테고리인 경우로, 서브 카테고리를 갖지않는 카테고리에 해당됨)
        state.categorySelection.selectedMainCategoryCode = categoryCodeBefore; // 변경 전 카테고리 코드를 변경 후 메인 카테고리 초기값으로 설정
        state.form.product.categoryCode = categoryCodeBefore; // 변경 전 카테고리 코드를 변경 후 카테고리 코드 초기값으로 설정
      }

      /** 상품 이미지 초기값 설정 */
      // 리뷰의 이미지 정보를 images ref와 existingImages ref에 설정
      if (data.productImages && data.productImages.length > 0) {
        images.value = data.productImages.map(img => img.fileUrl);
        existingImages.value = data.productImages.map(img => ({
          id: img.id,
          fileName: img.fileName,
          displayOrder: img.displayOrder
        }));
      }
    };

    const autoGrow = () => {
      nextTick(() => {
        const textareas = document.querySelectorAll('textarea.input-field');
        textareas.forEach(textarea => {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        });
      });
    };

    onMounted(load);

    return {
      formatter,
      categories, flattenCategories, productStatuses,
      imageInput, images, state,
      updateSubCategories,
      showImage, clickImageInput, previewImage, dropImage, deleteImage,
      updateProduct, autoGrow
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/product/product-update";
</style>
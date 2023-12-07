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
          <td>{{ lib.getCategoryName(state.product.categoryCode) }}</td>
          <td>
            <select class="select-field" v-model="state.form.product.categoryCode">
              <option disabled value="">상품 분류</option>
              <option v-for="categoryCode in categoryCodes" :key="categoryCode" :value="categoryCode">
                {{ lib.getCategoryName(categoryCode) }}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td class="table-title">상품 명</td>
          <td>{{ state.product.name }}</td>
          <td><input type="text" class="input-field" v-model="state.form.product.name"></td>
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
                <input type="number" class="input-field quantity-input" v-model="size.adjustmentQuantity"
                       placeholder="재고 수량"/>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="table-title">설명</td>
          <td v-html="lib.convertLineBreaks(state.product.detail)"></td>
          <td><textarea class="input-field" id="product-detail" v-model="state.form.product.detail" @input="autoGrow"/></td>
        </tr>

        <tr>
          <td class="table-title">가격</td>
          <td>{{ lib.getFormattedNumber(state.product.price) }}원</td>
          <td><input type="text" class="input-field" v-model="state.form.product.price" :disabled="state.product.status === 'ON_SALE'"></td>
        </tr>

        <tr>
          <td class="table-title">할인율</td>
          <td>{{ lib.getFormattedNumber(state.product.discountPer) }}%</td>
          <td><input type="text" class="input-field" v-model="state.form.product.discountPer" :disabled="state.product.status === 'ON_SALE'"></td>
        </tr>

        <tr>
          <td class="table-title">
            이미지
            <button type="button" class="btn-image-download" @click="downloadImage">
              <i class="bi bi-download"></i>
            </button>
          </td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(pf, index) in state.product.productImages" :key="index">
                <img class="product-image" :src="`${pf.filePath}${pf.fileName}`"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <div class="image-box" v-for="(src, index) in images" :key="index">
                <img class="product-image" :src="src"/>
                <button class="btn-delete-image" @click="deleteImage(index)">X</button>
              </div>
              <div class="upload-box" @click="clickImageInput" @drop.prevent="dropImage" @dragover.prevent>
                <p>+</p>
                <input type="file" multiple accept="image/*" ref="imageInput" @change="previewImage"
                       style="display: none">
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="table-title">판매 상태</td>
          <td>{{ lib.getProductStatusName(state.product.status) }}</td>
          <td>
            <select class="select-field" v-model="state.form.product.status">
              <option disabled value="">판매 상태</option>
              <option v-for="status in productStatuses" :key="status" :value="status">{{
                  lib.getProductStatusName(status)
                }}
              </option>
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
import lib from "@/scripts/lib";

export default {
  name: 'ProductUpdate',
  components: {},
  setup() {
    const categoryCodes = lib.categoryCodes;
    const productStatuses = lib.productStatuses;

    const route = useRoute();
    const images = ref([]);
    const imageInput = ref(null);

    const state = reactive({
      product: {
        id: 0, categoryCode: '', code: '', name: '', price: 1, discountPer: 0, detail: '', status: '',
        productImages: []
      },
      form: {
        product: {id: 0, categoryCode: '', code: '', name: '', price: 1, discountPer: 0, detail: '', status: '',},
        sizes: [],
        files: [],
      },
    });

    const downloadImage = () => {
      for (const file of state.product.productImages) {
        const link = document.createElement('a');
        link.href = `${file.filePath}${file.fileName}`;
        link.download = file.fileName;
        link.click();
      }
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

    const updateProduct = async () => {
      const formData = new FormData();

      formData.append('product', JSON.stringify(state.form.product));
      formData.append('sizes', JSON.stringify(state.form.sizes));
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
        code: data.code,
        categoryCode: data.category.code,
        name: data.name,
        price: data.price,
        discountPer: data.discountPer,
        detail: data.detail,
        status: data.status,
        productSizes: data.productSizes,
        productImages: data.productImages,
      };
      state.form.product = {
        id: data.id,
        code: data.code,
        categoryCode: data.category.code,
        name: data.name,
        price: data.price,
        discountPer: data.discountPer,
        detail: data.detail,
        status: data.status,
      };
      state.form.sizes = data.productSizes.map(ps => ({
        id: ps.id,
        size: ps.size,
        quantity: ps.quantity,
        adjustmentQuantity: ps.quantity,
      }));
      state.form.files = [];
    };

    const autoGrow = () => {
      nextTick(() => {
        const textarea = document.querySelector('#product-detail');
        if (textarea) {
          textarea.style.height = '100px';
          textarea.style.height = (textarea.scrollHeight < 250 ? textarea.scrollHeight : 250) + 'px';
        }
      });
    };

    onMounted(load);

    return {
      lib, categoryCodes, productStatuses,
      imageInput, images, state,
      downloadImage, clickImageInput, previewImage, dropImage, deleteImage,
      updateProduct, autoGrow
    }
  }
}
</script>

<style scoped>
.product-update {
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

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #e3e3e3;
  padding-left: 5px;
}

th {
  border: none;
  border-bottom: 1px solid #e3e3e3;
  text-align: center;
}

th:nth-child(1) {
  width: 10%;
}

th:nth-child(2), th:nth-child(3) {
  width: 45%;
}

tr {
  height: 40px;
}

tbody .table-title {
  background-color: #e3e3e3;
  border-color: white;
}

.input-field, .select-field {
  margin-bottom: 5px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 100%;
  height: 30px;
  background-color: transparent;
}

/* 웹킷 기반 브라우저(Chrome, Safari 등)의 자동완성 스타일을 덮어쓰기 위한 코드 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

.product-size-before, .product-size-after {
  align-items: center;
  display: inline-flex; /* 가로로 배열 */
  margin-right: 10px; /* 각 입력란 사이의 간격 */
}

.quantity-input {
  width: 70px;
}

.image {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.image-box {
  position: relative;
  margin-right: 6px;
  margin-block: 4px;
}

.product-image {
  height: 150px;
  float: left;
}

.btn-delete-image {
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
  margin-block: 4px;
}

.upload-box p {
  font-size: 24px;
  color: #ccc;
}

.btn-update {
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

.btn-image-download {
  border: none; /* 테두리 제거 */
  background-color: transparent; /* 배경색 투명으로 설정 */
  cursor: pointer; /* 마우스 커서를 손가락 모양으로 변경 */
}
</style>
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
          <td><input type="text" class="input-field" v-model="state.form.product.name" /></td>
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
          <td class="table-title">설명</td>
          <td v-html="lib.convertLineBreaks(state.product.detail)"></td>
          <td><textarea class="input-field" id="product-detail"
                        v-model="state.form.product.detail" @input="autoGrow" /></td>
        </tr>

        <tr>
          <td class="table-title">가격</td>
          <td>{{ lib.getFormattedNumber(state.product.price) }}원</td>
          <td>
            <input type="number" class="input-field" min="1" placeholder="가격"
                   v-model="state.form.product.price" :disabled="state.product.status === 'ON_SALE'" />
            <div class="error-message" v-if="state.errorMessage.price">{{ state.errorMessage.price }}</div>
          </td>
        </tr>

        <tr>
          <td class="table-title">할인율</td>
          <td>{{ lib.getFormattedNumber(state.product.discountPer) }}%</td>
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
              <option v-for="status in productStatuses" :key="status" :value="status">
                {{ lib.getProductStatusName(status) }}
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
      errorMessage: {},
    });

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

    const updateProduct = async () => {
      if (checkInput()) {
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
      showImage, clickImageInput, previewImage, dropImage, deleteImage,
      updateProduct, autoGrow
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/product/product-update";
</style>
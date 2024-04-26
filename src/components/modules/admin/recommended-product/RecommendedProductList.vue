<template>
  <div class="recommended-product-list">
    <div class="title">추천 상품 목록</div>

    <div class="content">
      <p>
        <i class="bi bi-emoji-smile"></i> 추천 상품은 최대 8개까지 등록할 수 있습니다.<br>
        <i class="bi bi-emoji-smile"></i> 출력 순서를 변경하고자 하는 경우 행을 드래그 앤 드롭하여 변경하기 버튼을 눌러주세요.
      </p>

      <div class="action-buttons">
        <div class="action-buttons-left">
          <button type="button" class="button btn-select-product" @click="showSearchProductModal = true">추가</button>
          <div class="error-message" v-if="state.errorMessage.selectProduct">{{ state.errorMessage.selectProduct }}</div>
        </div>

        <div class="action-buttons-right">
          <button type="button" class="button btn-change-recommended-products" @click="changeRecommendedProducts">변경하기</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th v-for="(tableHeader, idx) in tableHeaders" :key="idx">
              {{ tableHeader }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(rp, idx) in state.recommendedProducts" :key="rp.id" :class="idx === dragIndex ? 'dragging' : ''"
              :draggable="true" @dragstart="dragStart(idx)" @dragenter="dragEnter(idx)" @dragover.prevent @dragend="dragEnd">
            <td class="column-display-order">
              {{ rp.displayOrder }}
            </td>

            <td class="column-product-category">
              {{ rp.product.category.name }}
            </td>

            <td class="column-product-image">
              <div class="product-image">
                <img :src="`${rp.product.productImages[0].fileUrl}`" />
              </div>
            </td>

            <td class="column-product-name">
              <div class="product-name">
                {{ rp.product.name }}
              </div>
            </td>

            <td class="column-product-size">
              <div class="product-size">
                <span v-for="(ps, idx) in rp.product.productSizes" :key="idx">
                  {{ getProductSize(ps) }}<br>
                </span>
              </div>
            </td>

            <td class="column-product-price" data-unit="원">
              {{ rp.product.price }}
            </td>

            <td class="column-product-discount-per" data-unit="%">
              {{ rp.product.discountPer }}
            </td>

            <td class="column-product-display">
              {{ rp.product.isDisplay ? "표시" : "비표시" }}
            </td>

            <td class="column-product-status">
              {{ formatter.getProductStatusName(rp.product.status) }}
            </td>

            <td class="column-product-delete">
              <button type="button" class="button btn-delete-product" @click="deleteProduct(rp.id)">삭제</button>
            </td>
          </tr>

          <tr v-if="state.recommendedProducts.length === 0">
            <td colspan="10" class="text-center">등록된 추천 상품이 없습니다. 상품을 추가해주세요.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <SearchProductModal :show="showSearchProductModal" @close="showSearchProductModal = false" @product-selected="handleProductSelected"></SearchProductModal>

</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import draggable from "vuedraggable";
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";
import SearchProductModal from "@/components/modules/admin/recommended-product/SearchProductModal.vue";

export default {
  name: 'ProductList',
  components: {SearchProductModal},
  setup() {
    const tableHeaders = ['출력 순서', '카테고리', '이미지', '품명', '사이즈', '가격', '할인율', '표시', '상태', '삭제'];
    const productStatuses = constants.PRODUCT_STATUSES;

    const showSearchProductModal = ref(false);
    const dragIndex = ref(null);

    const state = reactive({
      isSubmitting: false,
      recommendedProducts: [],
      form: {
        displayOrder: 0,
        product: {categoryCode: '', name: '', price: '', discountPer: '', isDisplay: '',},
        startRegDate: '', endRegDate: '', startModDate: '', endModDate: ''
      },
      errorMessage: {},
    });

    const getProductSize = (productSize) => {
      return `${productSize.size} (재고: ${productSize.quantity})`;
    };

    const dragStart = (index) => {
      dragIndex.value = index;
    };

    const dragEnter = (index) => {
      if (index === dragIndex.value) return;
      const deleteElement = state.recommendedProducts.splice(dragIndex.value, 1)[0];
      state.recommendedProducts.splice(index, 0, deleteElement);
      dragIndex.value = index;
    };

    const dragEnd = () => {
      dragIndex.value = null;
    };

    const checkInput = (selectedProducts) => {
      let result = true;

      const MAX_RECOMMENDED_PRODUCTS = 8;

      state.errorMessage = {};

      if (selectedProducts && selectedProducts.length > MAX_RECOMMENDED_PRODUCTS) {
        state.errorMessage.selectProduct = `추천 상품은 최대 ${MAX_RECOMMENDED_PRODUCTS.toLocaleString()}개까지 등록할 수 있습니다.`;
        result = false;
      }

      return result;
    };

    const handleProductSelected = (selectedProducts) => {
      if (selectedProducts && selectedProducts.length > 0) { // 선택된 상품이 있을 경우
        const selectedProductIds = selectedProducts.map(product => product.id);
        addRecommendedProduct(selectedProductIds);
      }

      showSearchProductModal.value = false;
    };

    const addRecommendedProduct = (selectedProductIds) => {
      state.isSubmitting = true;

      if (checkInput(selectedProductIds)) {
        const payload = selectedProductIds.map((id, index) => ({
          productId: id,
          displayOrder: state.recommendedProducts.length + index + 1
        }));

        axios.post("/api/recommended-product/add", payload).then(() => {
          alert('추천 상품이 성공적으로 추가되었습니다.');
          load();

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

    const deleteProduct = (recommendedProductId) => {
      if (window.confirm('해당 상품을 추천 상품에서 삭제하시겠습니까?')) {
        axios.delete(`/api/recommended-product/delete/${recommendedProductId}`).then(() => {
          alert('삭제되었습니다.');
          load();
        });
      }
    };

    const getRecommendedProducts = () => {
      axios.get(`/api/recommended-product/list`).then(({data}) => {
        state.recommendedProducts = data;
      });
    };

    const changeRecommendedProducts = () => {
      const payload = state.recommendedProducts.map((rp, index) => ({
        id: rp.id,
        displayOrder: index + 1 // 순서대로 displayOrder를 1부터 시작하여 할당
      }));

      axios.post('/api/recommended-product/update', payload).then(() => {
        alert('성공적으로 변경되었습니다.');
        load();

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    };

    const load = () => {
      getRecommendedProducts();
    }

    onMounted(load);

    return {
      formatter,
      draggable,
      showSearchProductModal,
      productStatuses,
      tableHeaders, state,
      dragIndex,
      getProductSize,
      dragStart, dragEnter, dragEnd,
      handleProductSelected, addRecommendedProduct, deleteProduct, changeRecommendedProducts,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/recommended-product/recommended-product-list";
</style>
<template>
  <div class="available-products">

    <div class="title">
      <p v-if="isHomePage">최신 상품</p>
      <p v-else-if="isSearched" style="margin-top: 70px">검색 결과</p>
      <p v-else style="margin-top: 40px"></p>
    </div>

    <div class="content" v-if="products.length > 0">
      <div class="grid">
        <div class="item" v-for="(product, idx) in products" :key="idx">

          <div class="product">
            <div v-if="product.productImages && product.productImages.length > 0" class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: product.id }}">
                <span class="image-container"
                      :style="{backgroundImage: `url(${product.productImages[0].filePath}${product.productImages[0].fileName})`}" />
              </router-link>
            </div>
            <div v-else class="image-section"><span class="image-container"/></div>

            <div class="detail-section">
              <div class="info-section">
                <div class="title-row">
                  <span class="discount-per" v-if="product.discountPer">{{ product.discountPer }}%↓</span>
                  <span class="name">{{ product.name }}</span>
                </div>

                <div class="pricing-row">
                  <div class="price-container">
                    <small class="original-price" :class="{ 'sale': product.discountPer }">
                      {{ lib.getFormattedNumber(product.price) }}원</small>
                    <small class="discounted-price" v-if="product.discountPer">
                      {{ lib.getFormattedNumber(product.price - (product.price * product.discountPer / 100)) }}원</small>
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <span role="button" tabindex="0" @click="handleAddFavorite(product.id)">
                  <i class="bi bi-heart"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="margin: 60px 0 0 15px">상품이 없습니다.</div>

    <SelectProductSize v-if="showSelectProductSizeModal" @close="showSelectProductSizeModal = false"
                       :show="showSelectProductSizeModal" :productId="selectedProductId" />
  </div>
</template>

<script>
import {computed, ref, watch} from "vue";
import lib from "@/scripts/lib";
import {useStore} from 'vuex';
import {useRoute} from "vue-router";
import SelectProductSize from "@/components/modal/SelectProductSize.vue";

export default {
  name: "AvailableProducts",
  components: {SelectProductSize},
  props: {products: Array, isSearched: Boolean},
  setup(props) {
    watch(() => props.isSearched, (newValue, oldValue) => {
      console.log('isSearched changed from', oldValue, 'to', newValue);
    });

    const store = useStore();
    const route = useRoute();
    const isHomePage = computed(() => route.path === '/');
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);

    const handleAddFavorite = (productId) => {
      if (store.state.account.id) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    return {
      lib,
      isHomePage,
      showSelectProductSizeModal, selectedProductId,
      handleAddFavorite,
    };
  }
}
</script>

<style scoped>
.available-products {
  padding-block: 10px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-inline: 15px;
}

.content {
  margin-top: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.item {
  /* flex */
  /* flex-grow: 아이템이 컨테이너 내에서 추가적으로 늘어나는 비율을 설정 */
  /* flex-shrink: 아이템이 컨테이너 내에서 줄어드는 비율을 설정 */
  /* flex-basis: 아이템의 기본 크기를 설정 */
  flex: 0 0 25%;
  max-width: 25%;
  padding: 15px;
}

.product {
  border: 1px solid rgba(169, 169, 169, .3);
}

.image-container {
  display: block;
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
}

.detail-section {
  display: flex;
  padding: 10px 15px;
  justify-content: space-between;
//background-color: #f7f7f7;
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.title-row {
  display: flex; /* Use flexbox for the title row */
  align-items: center; /* Vertically center align items */
  font-size: 0.9rem;
  font-weight: bold;
}

.discount-per {
  display: inline;
  align-items: center;
  color: #dc3545;
  margin-right: 0.2rem;
}

.name {
  display: inline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.pricing-row {
  font-size: 0.9rem;
}

.price-container {
  display: flex; /* Use flexbox for the price container */
  align-items: center;
  gap: 0.25rem;
}

.original-price {
  color: #6c757d;
}

.original-price.sale {
  text-decoration: line-through;
}

.discounted-price {
  color: #dc3545;
}

.btn-load-more {
  position: relative;
  display: flex;
  align-items: center;
  font-size: .75rem;
  justify-content: center;
  text-align: center;
  height: 40px;
  width: 150px;
  margin: 5px auto;
  border: none; /* 테두리 제거 */
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}
</style>

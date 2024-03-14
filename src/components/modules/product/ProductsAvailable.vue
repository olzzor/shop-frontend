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
                <span class="image-container" :style="{backgroundImage: `url(${product.productImages[0].fileUrl})`}" />
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
    <div class="content no-product-data" v-else>상품이 없습니다.</div>

    <SelectProductSize v-if="showSelectProductSizeModal" @close="showSelectProductSizeModal = false"
                       :show="showSelectProductSizeModal" :productId="selectedProductId" />
  </div>
</template>

<script>
import {computed, ref, watch} from "vue";
import lib from "@/scripts/lib";
import store from "@/scripts/store";
import {useRoute} from "vue-router";
import SelectProductSize from "@/components/modules/favorite/SelectProductSizeModal.vue";

export default {
  name: "AvailableProducts",
  components: {SelectProductSize},
  props: {products: Array, isSearched: Boolean},
  setup(props) {
    const route = useRoute();
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const isHomePage = computed(() => route.path === '/');
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);

    const handleAddFavorite = (productId) => {
      if (isLoggedIn.value) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    watch(() => props.isSearched, (newValue, oldValue) => {
      console.log('isSearched changed from', oldValue, 'to', newValue);
    });

    return {
      lib,
      isHomePage,
      showSelectProductSizeModal, selectedProductId,
      handleAddFavorite,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/modules/product/products-available";
</style>

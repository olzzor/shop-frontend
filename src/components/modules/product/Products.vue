<template>
  <div class="products">

    <div class="title" :class="{'style-home': isHomePage, 'style-searched': isSearched, 'style-category': !isHomePage && !isSearched}">
<!--      <div v-if="isHomePage">상품</div>-->
<!--      <div v-else-if="isSearched" style="margin-top: 70px">검색 결과</div>-->
<!--      <div v-else style="margin-top: 40px">{{ currentCategoryName }}</div>-->
      <div class="product-title">
        <span v-if="isHomePage">NEW</span>
        <span v-else-if="isSearched">검색 결과</span>
        <span v-else>{{ currentCategoryName }}</span>
      </div>
      <div class="product-sorting-options">
        sort by
        <select v-model="sortOption" @change="changeSortOption(sortOption)">
          <option value="price,asc">Price, low to high</option>
          <option value="price,desc">Price, high to low</option>
          <option value="regDate,desc">Date, new to old</option>
          <option value="regDate,asc">Date, old to new</option>
        </select>
      </div>
    </div>

    <div class="content" v-if="products.length > 0">
      <div class="grid">
        <div class="item" v-for="(product, idx) in products" :key="idx">

          <div class="product">
            <div v-if="product.productImages && product.productImages.length > 0" class="image-section">
              <router-link :to="{ name: 'ProductDetail', params: { id: product.id }}">
<!--                <span class="image-container" :style="{backgroundImage: `url(${product.productImages[0].fileUrl})`}" />-->
                <img class="image-container" :src="`${product.productImages[0].fileUrl}`" />
                <div v-if="product.status !== 'ON_SALE'" class="not-in-stock-overlay">
                  <div class="not-in-stock">NOT IN STOCK</div>
                </div>
              </router-link>
            </div>
            <div v-else class="image-section"><span class="image-container"/></div>

            <div class="detail-section">
              <div class="info-section">
                <div class="title-row">
                  <span class="new-label" v-if="isNew(product.regDate)">NEW</span>
                  <span class="discount-per" v-if="product.discountPer">{{ product.discountPer }}%↓</span>
                  <span class="name">{{ product.name }}</span>
                </div>

                <div class="pricing-row">
                  <div class="price-container">
                    <small class="original-price" :class="{ 'sale': product.discountPer }">{{ formatter.getFormattedNumber(product.price) }}원</small>
                    <small class="discounted-price" v-if="product.discountPer">{{ formatter.getFormattedNumber(product.price - (product.price * product.discountPer / 100)) }}원</small>
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <span role="button" tabindex="0" @click="handleSelectProductSizeModal(product.id)">
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
import {useRoute} from "vue-router";
import dayjs from "dayjs";
import store from "@/scripts/store";
import formatter from "@/scripts/formatter";
import SelectProductSize from "@/components/modules/wishlist/SelectProductSizeModal.vue";

export default {
  name: "Products",
  components: {SelectProductSize},
  props: {products: Array, category: String, isSearched: Boolean},
  setup(props, {emit}) {
    const route = useRoute();
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const isHomePage = computed(() => route.path === '/');
    const currentCategoryName = computed(() => store.getters.categoryName);
    const showSelectProductSizeModal = ref(false);
    const selectedProductId = ref(null);
    const sortOption = ref('regDate,desc');

    const changeSortOption = (newSortOption) => {
      // 'sort-change' 이벤트를 발생시키고, 선택된 정렬 옵션을 인자로 전달
      emit('sort-change', newSortOption);
    };

    const isNew = (regDate) => {
      const today = dayjs();
      const registeredDate = dayjs(regDate);
      return registeredDate.isAfter(today.subtract(7, 'days'));
    };

    const handleSelectProductSizeModal = (productId) => {
      if (isLoggedIn.value) {
        selectedProductId.value = productId; // 선택한 제품 ID 설정
        showSelectProductSizeModal.value = true; // 사이즈 선택 모달 표시

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    // watch(() => route.params.cat, (newCat) => {
    //   const category = categories.find(c => c.slug === newCat) || {code: 0, name: '', slug: ''};
    //   store.dispatch('updateCurrentCategory', category);
    // });

    watch(() => props.isSearched, (newValue, oldValue) => {
      console.log('isSearched changed from', oldValue, 'to', newValue);
    });

    return {
      formatter,
      isHomePage, currentCategoryName,
      showSelectProductSizeModal, selectedProductId,
      sortOption, changeSortOption,
      isNew,
      handleSelectProductSizeModal,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/modules/product/products";
</style>

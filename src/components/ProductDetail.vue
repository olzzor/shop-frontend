<template>
  <div class="product-detail">
    <div class="title"></div>

    <div class="content">
      <div class="product-section">
        <div class="product-images">
          <div v-if="state.product.productImages && state.product.productImages.length > state.selectedImageIndex">
            <span class="selected-image-container" alt="Selected Product Image"
                  :style="{backgroundImage: `url(${state.product.productImages[state.selectedImageIndex].filePath}${state.product.productImages[state.selectedImageIndex].fileName})`}" />
          </div>

          <div class="image-wrapper">
            <div class="image-list" ref="imageListRef">
              <div v-for="(file, idx) in state.product.productImages" :key="idx">
              <span class="image-container" :style="{backgroundImage: `url(${file.filePath}${file.fileName})`}"
                    @click="selectImage(idx)" />
              </div>
            </div>

            <div class="image-list-navigation">
              <button class="button btn-scroll-up" type="button" @click="scrollImageList(-1)"><i
                  class="bi bi-chevron-up"></i></button>
              <div class="divider"></div>
              <button class="button btn-scroll-down" type="button" @click="scrollImageList(1)"><i
                  class="bi bi-chevron-down"></i></button>
            </div>
          </div>
        </div>

        <div class="product-info">
          <div class="product-title-row">
            <span class="product-discount-per" v-if="state.product.discountPer">
              {{ state.product.discountPer }}%↓
            </span>
            <span class="product-name">
              {{ state.product.name }}
            </span>
          </div>

          <div class="product-price-row">
            <div class="price-container">
              <small class="original-price" :class="{ 'sale': state.product.discountPer }">
                {{ lib.getFormattedNumber(state.product.price) }}원
              </small>
              <small class="discounted-price" v-if="state.product.discountPer">
                {{ lib.getFormattedNumber(price.getDiscountedPrice(state.product)) }}원
              </small>
            </div>
          </div>

          <!--          <div class="product-details">-->
          <!--            <p v-html="lib.convertLineBreaks(state.product.detail)"></p>-->
          <!--          </div>-->

          <div class="options">
            <div class="option-product-size">
              <div class="product-sizes">
                <select class="select-field" v-model="state.selectedSizeId">
                  <option v-if="state.product.productSizes && state.product.productSizes.length > 1"
                          value="0" disabled>사이즈를 선택해주세요.
                  </option>
                  <option v-for="ps in state.product.productSizes" :key="ps.id" :value="ps.id"
                          :disabled="ps.quantity === 0">
                    {{ ps.size }} <span class="size-stock">(재고: {{ ps.quantity }})</span>
                  </option>
                </select>
              </div>

              <div class="quantity-control">
                <button class="btn-quantity-down" @click="decrementQuantity"><i class="bi bi-dash-lg"></i></button>
                <input type="number" v-model="state.selectedQuantity" min="1">
                <button class="btn-quantity-up" @click="incrementQuantity"><i class="bi bi-plus-lg"></i></button>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="button btn-add-cart" type="button"
                    @click="addToCart(state.selectedSizeId)" :disabled="state.isSubmitting">
              장바구니 추가
            </button>
            <button class="button btn-add-favorite" type="button"
                    @click="isFavorite ? removeFavorite() : addFavorite()" :disabled="state.isSubmitting">
              <span v-if="isFavorite">관심 상품 삭제</span>
              <span v-else>관심 상품 추가</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 리뷰 섹션 추가 -->
<!--      <div class="review-section">-->
<!--        <ProductReviews :productId="Number(route.params.id)" />-->
<!--      </div>-->
    </div>

    <div v-if="state.product.status !== 'ON_SALE'" class="not-in-stock-overlay">
      <div class="not-in-stock">
      NOT IN STOCK
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref, watch} from "vue";
import {useStore} from 'vuex';
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";
import price from "@/scripts/price";

export default {
  name: "ProductDetail",
  data() {
    return {
      product: Object
    };
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const productId = route.params.id;
    const isFavorite = ref(false);
    const favoriteId = ref(0);
    const imageListRef = ref(null);
    const state = reactive({
      isSubmitting: false,
      product: {},
      selectedImageIndex: 0, selectedSizeId: 0, selectedQuantity: 1,
    });

    const scrollImageList = (direction) => {
      if (imageListRef.value) {
        const scrollAmount = 120; // 하나의 이미지 높이
        imageListRef.value.scrollTop += scrollAmount * direction;
      }
    };

    const decrementQuantity = () => {
      if (state.selectedQuantity > 1) {
        state.selectedQuantity -= 1;
      }
    };

    const incrementQuantity = () => {
      state.selectedQuantity += 1;
    };

    const addFavorite = () => {
      if (store.state.account.id) {
        const productSizeId = state.selectedSizeId;

        if (productSizeId === 0) {
          window.alert("사이즈를 선택해주세요.");

        } else {
          state.isSubmitting = true;

          axios.post(`/api/favorite/add/${productSizeId}`).then(() => {
            window.alert('관심 상품이 추가되었습니다.');
            checkFavorite();

          }).catch(error => {
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  window.alert(error.response.data.message);
                  break;
                case 404:
                  window.alert(error.response.data.message);
                  break;
                case 409:
                  window.alert(error.response.data.message);
                  break;
                default:
                  window.alert("오류가 발생했습니다. 다시 시도해주세요.");
              }
            } else {
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }

          }).finally(() => {
            state.isSubmitting = false;
          });
        }

      } else {
        window.alert("로그인이 필요합니다.");
      }
    };

    const removeFavorite = () => {
      if (favoriteId.value) {
        state.isSubmitting = true;

        axios.delete(`/api/favorite/delete/${favoriteId.value}`).then(() => {
          window.alert('관심 상품이 삭제되었습니다.');
          checkFavorite();

        }).finally(() => {
          state.isSubmitting = false;
        });
      }
    };

    const checkFavorite = () => {
      const productSizeId = state.selectedSizeId;

      if (store.state.account.id && productSizeId !== 0) {
        axios.get(`/api/favorite/check/${productSizeId}`).then(({data}) => {
          isFavorite.value = data.favorite;
          favoriteId.value = isFavorite.value ? data.id : 0;
        });
      }
    };

    const recordRecentlyViewedProduct = () => {
      // 유저 로그인 확인
      if (store.state.account.id) {
        // 로그인 유저의 경우, DB에 선택 상품 기록
        axios.post(`/api/recently-viewed-product/record/${state.product.id}`).then((res) => {
          console.log('Recently viewed product recorded:', res.data);
        })

      } else {
        // 비 로그인 유저의 경우, 로컬 스토리지에 선택 상품 저장
        const MAX_RECENTLY_VIEWED_PRODUCTS = 20;
        let recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
        const index = recentlyViewedProducts.findIndex(rp => rp.productId === state.product.id);

        if (index !== -1) {
          // 선택된 상품이 로컬 스토리지에 존재하는 경우, viewedAt만 갱신
          recentlyViewedProducts[index].viewedAt = lib.getFormattedDate(new Date(), 'YYYY-MM-DDTHH:mm:ss');

        } else {
          // 선택된 상품이 로컬 스토리지에 존재하지 않는 경우, (순서 엄수)

          // 최근 선택 상품 정보를 담은 배열의 길이가 제한을 넘는다면,
          // 가장 오래된 데이터(recentlyViewedProducts[MAX_RECENTLY_VIEWED_PRODUCTS - 1])를 삭제
          if (recentlyViewedProducts.length >= MAX_RECENTLY_VIEWED_PRODUCTS) {
            recentlyViewedProducts.pop();
          }

          // 선택된 상품 정보 생성
          const recentlyViewedProduct = {
            productId: state.product.id,
            viewedAt: lib.getFormattedDate(new Date(), 'YYYY-MM-DDTHH:mm:ss')
          };

          // 선택된 상품 정보를 recentlyViewedProducts[0]에 추가
          // pop 하지 않은 이유: 정렬 처리가 else 스코프 안으로 들어와야 하는데, if 에서도 필요하기 때문에 두 번 작성해야함.
          recentlyViewedProducts.unshift(recentlyViewedProduct);
        }

        // viewedAt 기반으로 내림차순 정렬
        recentlyViewedProducts.sort((rvp1, rvp2) => new Date(rvp2.viewedAt) - new Date(rvp1.viewedAt));

        localStorage.setItem('recentlyViewedProducts', JSON.stringify(recentlyViewedProducts));
      }
    };

    const selectImage = (index) => {
      state.selectedImageIndex = index;
    };

    const load = () => {
      axios.get(`/api/product/${productId}`).then(({data}) => {
        if (data.productSizes && data.productSizes.length === 1) {
          state.selectedSizeId = data.productSizes[0].id;
        }
        state.product = data;
        recordRecentlyViewedProduct();
        checkFavorite();
      });
    };

    const addToCart = (productSizeId) => {
      if (store.state.account.id) {

        if (productSizeId === 0) {
          window.alert("사이즈를 선택해주세요.");

        } else {
          state.isSubmitting = true;

          const payload = {
            productSizeId: productSizeId,
            quantity: state.selectedQuantity
          };

          axios.post('/api/cart/add/by-product-size', payload).then(() => {
            window.alert('장바구니에 추가되었습니다.');

          }).catch(error => {
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  window.alert(error.response.data.message);
                  break;
                case 404:
                  window.alert(error.response.data.message);
                  break;
                default:
                  window.alert("오류가 발생했습니다. 다시 시도해주세요.");
              }
            } else {
              window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }

          }).finally(() => {
            state.isSubmitting = false;
          });
        }
      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    watch(() => state.selectedSizeId, (newSizeId, oldSizeId) => {
      if (newSizeId !== oldSizeId) {
        checkFavorite();
      }
    });

    onMounted(load);

    return {
      lib, price,
      route, state, isFavorite, imageListRef,
      scrollImageList,
      decrementQuantity, incrementQuantity,
      addFavorite, removeFavorite, checkFavorite,
      selectImage, addToCart
    }
  }
}
</script>

<style scoped>
.product-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}

.content {
  padding-inline: 15px;
}

.product-detail .content {
  display: flex;
  flex-direction: column;
}

.product-section {
  display: flex;
  height: 800px;
}

.product-images {
  flex: 1;
  display: flex;
  flex-direction: row; /* 이미지 리스트와 선택된 이미지를 가로로 나열합니다. */
  align-items: flex-start; /* 이미지 리스트의 시작 부분에 정렬합니다. */
}

.selected-image-container {
  display: inline-block;
  width: 700px;
  height: 800px;
  background-size: cover;
  background-position: center;
}

/* 이미지 리스트와 네비게이션을 함께 감싸는 새로운 컨테이너 */
.image-wrapper {
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
  margin-right: 50px;
}

.image-list {
  overflow-y: hidden; /* 스크롤바를 숨깁니다. 스크롤은 버튼으로 제어됩니다. */
}

.image-container {
  display: inline-block;
  width: 80px;
  height: 96px;
  background-size: cover;
  background-position: center;
  margin-bottom: 4px;
}

.image-list-navigation {
  height: 45px;
  z-index: 1; /* 이미지 위에 표시되도록 */
  display: flex;
  justify-content: center;
  align-items: stretch;
  cursor: pointer;
}

.product-info {
  flex: 1;
  display: flex; /* Flex container로 설정 */
  flex-direction: column; /* 세로로 요소들을 정렬합니다 */
  justify-content: space-between; /* 공간을 최대한 활용하여 요소들을 분리합니다 */
}

.product-title-row {
  font-size: 2rem;
  font-weight: bold;
  white-space: normal;
  margin-bottom: 10px;
}

.product-discount-per {
  display: inline;
  color: #dc3545;
  margin-right: 5px;
}

.product-name {
  display: inline;
}

.product-price-row {
  font-size: 1.5rem;
}

.price-container {
  display: flex; /* Use flexbox for the price container */
  align-items: center;
  gap: 0.25rem;
}

.original-price {
  color: darkgray;
}

.original-price.sale {
  text-decoration: line-through;
}

.discounted-price {
  margin-left: .5rem;
  color: #dc3545;
}

.product-details {
  margin-block: 20px;
}

.option-product-size {
  display: flex;
  flex-direction: row;
  margin-block: 20px;
  height: 50px;
}

.product-sizes {
  flex: 1; /* 기존의 width: 80%을 flex로 바꾼다. */
}

.select-field {
  outline: none;
  padding-inline: 10px;
  height: 100%;
  width: 100%;
  font-size: 1rem;
}

.size-stock {
  font-color: #888; /* 회색으로 설정 */
  font-size: 0.9em; /* 폰트 크기를 조금 작게 설정 */
}

/* Firefox에서 spinner 숨기기 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Webkit 브라우저(Chrome, Safari 등)에서 spinner 숨기기 */
input[type="number"] {
  -moz-appearance: textfield;
}

.quantity-control {
  margin-left: 2%; /* 왼쪽의 여백을 자동으로 설정하여 오른쪽으로 이동시킨다. */
}

.quantity-control input[type="number"] {
  text-align: center;
  border: none;
  outline: none;
  padding: 5px;
  height: 50px;
  width: 50px;
}

.actions {
  width: 100%; /* 전체 너비를 차지하게 설정 */
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  width: 49%;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  border-radius: 5px;
  border: none; /* 테두리 제거 */
}

.btn-scroll-down,
.btn-scroll-up {
  margin: 0;
  height: 100%;
  background-color: darkgray;
  color: white;
  border-radius: 0px;
  border: none;
  display: block; /* block으로 설정하여 width를 제어 */
}

.divider {
  width: 1px;
  background-color: white;
}

.btn-quantity-down,
.btn-quantity-up {
  border: 1px solid #f5f5f5; /* 이곳에 원하는 테두리 색상을 입력 */
  outline: none; /* 버튼을 클릭했을 때의 테두리도 없애기 위해 추가 */
  height: 50px;
  background-color: darkgray;
  color: white;
}

.btn-add-cart {
  background: linear-gradient(to bottom, #3a3a3a, #000000);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  display: block; /* block으로 설정하여 width를 제어 */
}

.btn-add-favorite {
  background-color: white;
  color: black;
  border: 1px solid #000;
  display: block; /* block으로 설정하여 width를 제어 */
}

.not-in-stock-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 불투명한 검은색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}


.not-in-stock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
  color: white;
  font-size: 2.5rem;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 1s;
  z-index: 2;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

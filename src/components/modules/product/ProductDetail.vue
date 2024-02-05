<template>
  <div class="product-detail">
    <div class="title"></div>

    <div class="content">
      <div class="product-section">
        <div class="product-images">
          <div v-if="state.product.productImages && state.product.productImages.length > state.selectedImageIndex">
            <span class="selected-image-container" alt="Selected Product Image"
                  :style="{backgroundImage: `url(${state.product.productImages[state.selectedImageIndex].fileUrl})`}" />
          </div>

          <div class="image-wrapper">
            <div class="image-list" ref="imageListRef">
              <div v-for="(file, idx) in state.product.productImages" :key="idx">
                <span class="image-container" :style="{backgroundImage: `url(${file.fileUrl})`}"
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

    <div class="not-in-stock-overlay" v-if="!state.isLoading && state.product.status !== 'ON_SALE'">
      <div class="not-in-stock">NOT IN STOCK</div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref, watch} from "vue";
import {useStore} from 'vuex';
import {useRoute} from "vue-router";
import {isMobile} from "@/scripts/mixin";
import axios from "axios";
import lib from "@/scripts/lib";
import price from "@/scripts/price";
import router from "@/scripts/router";

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
      isLoading: true,
      isSubmitting: false,
      product: {},
      selectedImageIndex: 0, selectedSizeId: 0, selectedQuantity: 1,
    });

    const scrollImageList = (direction) => {
      if (imageListRef.value) {
        if (isMobile()) {
          imageListRef.value.scrollLeft += 84 * direction;
        } else {
          imageListRef.value.scrollTop += 104 * direction;
        }
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
      state.isLoading = true; // 상품 정보 요청 전 로딩 상태를 true로 설정

      axios.get(`/api/product/${productId}`).then(({data}) => {
        if (data.productSizes && data.productSizes.length === 1) {
          state.selectedSizeId = data.productSizes[0].id;
        }

        state.product = data;
        recordRecentlyViewedProduct();
        checkFavorite();

      }).catch(error => {
        let errorMessage = "오류가 발생했습니다. 다시 시도해주세요.";

        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = error.response.data.message;
              break;
          }
        }

        window.alert(errorMessage); // 오류 메시지를 사용자에게 알림
        router.back(); // 이전 페이지로 이동

      }).finally(() => {
        state.isLoading = false; // 요청 완료 후 로딩 상태를 false로 설정
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

<style lang="scss" scoped>
@import "@/styles/modules/product/product-detail";
</style>

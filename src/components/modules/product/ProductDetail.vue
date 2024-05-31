<template>
  <div class="product-detail">
    <div class="title"></div>

    <div class="content">
      <div class="product-section">
        <!-- 상품 이미지 -->
        <div class="product-images">
          <div v-if="state.product.productImages && state.product.productImages.length > state.selectedImageIndex"
               class="selected-image-container" @mousemove="zoom(true, $event)" @mouseleave="zoom(false)">
            <img class="selected-image" id="selected-image"
                 :src="`${state.product.productImages[state.selectedImageIndex].fileUrl}`" />
<!--            <div class="selected-image" id="selected-image"-->
<!--                 :style="{backgroundImage: `url(${state.product.productImages[state.selectedImageIndex].fileUrl})`}">-->
<!--            </div>-->
          </div>

          <div class="image-wrapper">
            <div class="image-list" ref="imageListRef">
              <div v-for="(file, idx) in state.product.productImages" :key="idx">
                <img class="image-container" :class="{ 'selected': idx === state.selectedImageIndex }"
                     :src="`${file.fileUrl}`" @click="selectImage(idx)" />
<!--                <span class="image-container" :class="{ 'selected': idx === state.selectedImageIndex }"-->
<!--                      :style="{backgroundImage: `url(${file.fileUrl})`}" @click="selectImage(idx)" />-->
              </div>
            </div>

            <!-- 없애도 깔끔하고 좋을듯 -->
            <div class="image-list-navigation">
              <button type="button" class="button btn-scroll-up" @click="scrollImageList(-1)"><i
                  class="bi bi-chevron-up"></i></button>
              <div class="divider"></div>
              <button type="button" class="button btn-scroll-down" @click="scrollImageList(1)"><i
                  class="bi bi-chevron-down"></i></button>
            </div>
          </div>
        </div>

        <!-- 상품 정보 -->
        <div class="product-info">
          <!-- 품명 -->
          <div class="title-row">
            <span class="new-label" v-if="isNew(state.product.regDate)">NEW</span>
            <span class="discount-per" v-if="state.product.discountPer">{{ state.product.discountPer }}%↓</span>
            <span class="name">{{ state.product.name }}</span>
          </div>

          <div class="price-actions-row">
            <!-- 가격 -->
            <div class="price-container">
              <small class="original-price" :class="{ 'sale': state.product.discountPer }">
                {{ formatter.getFormattedNumber(state.product.price) }}원
              </small>
              <small class="discounted-price" v-if="state.product.discountPer">
                {{ formatter.getFormattedNumber(price.getDiscountedPrice(state.product)) }}원
              </small>
            </div>

            <!-- 위시리스트 버튼 -->
            <div class="action-container">
              <button type="button" class="button btn-add-wishlist"
                      @click="isWishlist ? removeFromWishlist() : addToWishlist()" :disabled="state.isSubmitting">
                <span v-if="isWishlist"><i class="bi bi-heart-fill"></i></span>
                <span v-else><i class="bi bi-heart"></i></span>
              </button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 상세 -->
          <div class="product-details">
            <div class="description" v-if="state.product.detail && state.product.detail.description">
              <span v-html="formatter.convertLineBreaks(state.product.detail.description)"></span>
            </div>
<!--            &lt;!&ndash; 제품 설명 &ndash;&gt;-->
<!--            <div class="description">-->
<!--              <div class="description-title" @click="toggleShowDetail('description')">-->
<!--                <span>제품 설명 </span>-->
<!--                <i class="bi" :class="{'bi-chevron-down': !state.showDetail.description, 'bi-chevron-up': state.showDetail.description}"></i>-->
<!--              </div>-->
<!--              <div v-if="state.showDetail.description" class="description-content">-->
<!--                <span v-if="state.product.detail.description" v-html="formatter.convertLineBreaks(state.product.detail.description)"></span>-->
<!--                <span v-else>설명이 없습니다.</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 사이즈 가이드 &ndash;&gt;-->
<!--            <div class="size-guide">-->
<!--              <div class="size-guide-title" @click="toggleShowDetail('sizeGuide')">-->
<!--                <span>사이즈 가이드 </span>-->
<!--                <i class="bi" :class="{'bi-chevron-down': !state.showDetail.sizeGuide, 'bi-chevron-up': state.showDetail.sizeGuide}"></i>-->
<!--              </div>-->
<!--              <div v-if="state.showDetail.sizeGuide" class="size-guide-content">-->
<!--                <span v-if="state.product.detail.sizeGuide" v-html="formatter.convertLineBreaks(state.product.detail.sizeGuide)"></span>-->
<!--                <span v-else>설명이 없습니다.</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 교환 및 환불 &ndash;&gt;-->
<!--            <div class="exchange-return">-->
<!--              <div class="exchange-return-title" @click="toggleShowDetail('exchangeReturn')">-->
<!--                <span>교환 및 환불 </span>-->
<!--                <i class="bi" :class="{'bi-chevron-down': !state.showDetail.exchangeReturn, 'bi-chevron-up': state.showDetail.exchangeReturn}"></i>-->
<!--              </div>-->
<!--              <div v-if="state.showDetail.exchangeReturn" class="exchange-return-content">-->
<!--                <span>-->
<!--                  빈티지의류 특성 상 교환 및 환불이 어렵습니다.<br>-->
<!--                  신중한 구매 부탁 드리겠습니다.-->
<!--                </span>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 기타 문의 &ndash;&gt;-->
<!--            <div class="other-inquiry">-->
<!--              <div class="other-inquiry-title" @click="toggleShowDetail('otherInquiry')">-->
<!--                <span>기타 문의 </span>-->
<!--                <i class="bi" :class="{'bi-chevron-down': !state.showDetail.otherInquiry, 'bi-chevron-up': state.showDetail.otherInquiry}"></i>-->
<!--              </div>-->
<!--              <div v-if="state.showDetail.otherInquiry" class="other-inquiry-content">-->
<!--                <span>-->
<!--                  기타 문의 사항은 아래로 문의 부탁드립니다.<br>-->
<!--                  오픈 카카오: https://open.kakao.com/d/sW3ukRnc-->
<!--                </span>-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <!-- 선택 옵션 -->
          <div class="options">
            <div class="option-product-size">
              <div class="product-sizes">
                <select class="select-field" v-model="state.selectedSizeId">
                  <option v-if="state.product.productSizes && state.product.productSizes.length > 1"
                          value="0" disabled>size (필수)
                  </option>
                  <option v-for="ps in state.product.productSizes" :key="ps.id" :value="ps.id"
                          :disabled="ps.quantity === 0">
                    {{ ps.size }}<!-- <span class="size-stock">(재고: {{ ps.quantity }})</span> -->
                    <span v-if="ps.quantity === 0"> (품절)</span>
                  </option>
                </select>
              </div>

              <div class="quantity-control">
                <button type="button" class="btn-quantity-down" @click="decrementQuantity"><i class="bi bi-dash-lg"></i></button>
                <input type="number" v-model="state.selectedQuantity" min="1">
                <button type="button" class="btn-quantity-up" @click="incrementQuantity"><i class="bi bi-plus-lg"></i></button>
              </div>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="actions">
            <button type="button" class="button btn-add-cart"
                    @click="addToCart(state.selectedSizeId)" :disabled="state.isSubmitting">
              카트 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 상세 정보 섹션 추가 -->
      <div class="product-detail-section">
        <div class="content" v-if="state.product.detail && state.product.detail.content">
          <span v-html="state.product.detail.content"></span>
        </div>

        <div class="announce">
          - 라이트하우스에서 판매하는 빈티지 제품들은 새상품이 아닌 중고 상품으로, 컨디션에 민감하신 분들은 신중한 구매결정 부탁드립니다.<br>
          - 간혹 오프라인 스토어에서 판매된 제품이 품절 처리가 되어있지 않은 경우가 있어요. 양해 부탁드립니다.<br>
          - 제품의 실측은 측정 위치, 재는 방법에 따라 오차가 있을 수 있습니다.<br>
          - 오프라인 스토어는 매 주 월요일,화요일 휴무로 해당 기간 주문건은 수요일 일괄 발송됩니다. (주말 주문건은 월요일 발송!)<br>
          - 택배는 롯데택배로 발송됩니다. (기본 3,000 / 제주 및 산간지역 6,000)
        </div>
      </div>

      <!-- Q&A 섹션 추가 -->
      <div class="qa-section">
        <b>Q&A (<span class="count-inquiries">{{ state.totalContacts }}</span>)</b><br>
        구매하시려는 상품에 대해 궁금한 점이 있으면 문의주세요.

        <div class="actions">
          <button type="button" class="button btn-inquiry-product" @click="showContactUsModal('PRODUCT_INFO')">상품문의</button>
          <button type="button" class="button btn-inquiry-personal" @click="showContactUsModal('PERSONAL')">1:1 문의</button>
        </div>

        <div class="contacts" v-if="state.contacts.length > 0">
          <div class="pagination" v-if="state.page.totalPages > 1">
            <button type="button" @click="goToPage(state.page.currentPage - 1)" :disabled="state.page.currentPage === 1"><i class="bi bi-caret-left-fill"></i></button>
            <span v-for="page in state.page.totalPages" :key="page" :class="{ 'current-page': state.page.currentPage === page }" @click="goToPage(page)"> {{ page }} </span>
            <button type="button" @click="goToPage(state.page.currentPage + 1)" :disabled="state.page.currentPage === state.page.totalPages"><i class="bi bi-caret-right-fill"></i></button>
          </div>

          <table>
            <thead>
              <tr><th></th><th>제목</th><th>답변</th><th>작성자</th><th v-if="!isMobile">작성 날짜</th></tr>
            </thead>
            <tbody>
              <template v-for="contact in state.contacts" :key="contact.id">
                <tr class="inquiry-title" @click="toggleContactContent(contact)">
                  <td class="is-private-col"><i class="bi" :class="contact.isPrivate ? 'bi-lock' : 'bi-unlock'"></i></td>
                  <td class="title-col">{{ contact.title }}</td>
                  <td class="status-col">{{ formatter.getContactStatusName(contact.status) }}</td>
                  <td class="inquirer-email-col">{{ contact.inquirerEmail }}</td>
                  <td class="reg-date-col" v-if="!isMobile">{{ formatter.getFormattedDate(contact.regDate, 'YYYY-MM-DD') }}</td>
                </tr>
                <tr class="inquiry-content" v-if="!contact.isPrivate && state.selectedContactId === contact.id">
                  <td class="inquiry-content-empty-col"></td>
                  <td class="inquiry-content-col" :colspan="isMobile ? 3 : 4">{{ contact.content }}</td>
                </tr>
                <tr class="answer-content" v-if="!contact.isPrivate && state.selectedContactId === contact.id && contact.status === 'ANSWERED'">
                  <td class="answer-content-empty-col"></td>
                  <td class="answer-content-col" :colspan="isMobile ? 3 : 4"><span class="indent">└</span>{{ state.selectedContactAnswerContent }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="contacts no-contact-data" v-else>등록된 문의가 없습니다.</div>
      </div>
    </div>

    <div class="not-in-stock-overlay" v-if="!state.isLoading && state.product.status !== 'ON_SALE'">
      <div class="not-in-stock">NOT IN STOCK</div>
    </div>

    <ContactUsModal v-if="state.showContactUsModal" :show="state.showContactUsModal"
                    :type="state.contact.type" :product="state.contact.product"
                    @close="state.showContactUsModal = false" @updated="load" />
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {isMobile} from "@/scripts/mixin";
import dayjs from "dayjs";
import axios from "axios";
import formatter from "@/scripts/formatter";
import price from "@/scripts/price";
import router from "@/scripts/router";
import store from "@/scripts/store";
import ContactUsModal from "@/components/modules/contact/ContactUsModal.vue";

export default {
  name: "ProductDetail",
  components: {ContactUsModal},
  data() {
    return {
      product: Object,
    };
  },
  setup() {
    const route = useRoute();
    const productId = route.params.id;
    const isLoggedIn = computed(() => store.getters.userId !== 0);
    const isWishlist = ref(false);
    const wishlistId = ref(0);
    const imageListRef = ref(null);
    const state = reactive({
      isLoading: true,
      isSubmitting: false,
      product: {},
      selectedImageIndex: 0,
      selectedSizeId: 0,
      selectedQuantity: 1,
      showDetail: {description: false, sizeGuide: false, exchangeReturn: false, otherInquiry: false},
      // 문의 관련
      showContactUsModal: false,
      totalContacts: 0,
      selectedContactId: 0,
      selectedContactAnswerContent: '',
      contact: {type: '', product: {id:0, name:''}},
      contacts: [],
      page: {pageSize: 5, currentPage: 1, totalPages: 0},
    });

    const isNew = (regDate) => {
      const today = dayjs();
      const registeredDate = dayjs(regDate);
      return registeredDate.isAfter(today.subtract(7, 'days'));
    };

    const toggleShowDetail = (key) => {
      state.showDetail[key] = !state.showDetail[key];
    };

    const toggleContactContent = (contact) => {
      if (state.selectedContactId === contact.id) {
        state.selectedContactId = null;
        state.selectedContactAnswerContent = '';

      } else {
        state.selectedContactId = contact.id;

        if (contact.status === 'ANSWERED')
        getProductContactAnswer(contact.id);
      }
    };

    // TODO: 인증서 해결 후 모바일 대응 추가할 것. touchmove, touchend
    const zoom = (zoom, mouseEvent) => {
      const selectedImage = document.querySelector('#selected-image');

      if (zoom) { // mousemove 상태
        const x = mouseEvent.clientX - mouseEvent.target.offsetLeft; // 이미지 내 X 좌표
        const y = mouseEvent.clientY - mouseEvent.target.offsetTop; // 이미지 내 Y 좌표

        selectedImage.style.transformOrigin = `${x}px ${y}px`;
        selectedImage.style.transform = 'scale(2)';

      } else { // mouseleave 상태
        selectedImage.style.transformOrigin = `center`;
        selectedImage.style.transform = 'scale(1)';
      }
    };

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

    const addToWishlist = () => {
      if (isLoggedIn.value) {
        const productSizeId = state.selectedSizeId;

        if (productSizeId === 0) {
          window.alert("사이즈를 선택해주세요.");

        } else {
          state.isSubmitting = true;

          axios.post(`/api/wishlist/add/${productSizeId}`).then(() => {
            window.alert('상품이 위시리스트에 추가되었습니다.');
            checkWishlist();

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
        }

      } else {
        window.alert("로그인이 필요합니다.");
      }
    };

    const removeFromWishlist = () => {
      if (wishlistId.value) {
        state.isSubmitting = true;

        axios.delete(`/api/wishlist/delete/${wishlistId.value}`).then(() => {
          window.alert('상품이 위시리스트에서 삭제되었습니다.');
          checkWishlist();

        }).finally(() => {
          state.isSubmitting = false;
        });
      }
    };

    const checkWishlist = () => {
      const productSizeId = state.selectedSizeId;

      if (isLoggedIn.value && productSizeId !== 0) {
        axios.get(`/api/wishlist/check/${productSizeId}`).then(({data}) => {
          isWishlist.value = data.isWishlist;
          wishlistId.value = isWishlist.value ? data.id : 0;
        });
      }
    };

    const recordProductViewLog = () => {
      axios.post(`/api/product/record/view-log/${productId}`).then(() => {
      });
    };

    const recordRecentlyViewedProduct = () => {
      // 유저 로그인 확인
      if (isLoggedIn.value) {
        // 로그인 유저의 경우, DB에 선택 상품 기록
        axios.post(`/api/recently-viewed-product/record/${state.product.id}`).then((res) => {
          console.log('Recently viewed product recorded:', res.data);
        });

      } else {
        // 비 로그인 유저의 경우, 로컬 스토리지에 선택 상품 저장
        const MAX_RECENTLY_VIEWED_PRODUCTS = 20;
        let recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
        const index = recentlyViewedProducts.findIndex(rp => rp.productId === state.product.id);

        if (index !== -1) {
          // 선택된 상품이 로컬 스토리지에 존재하는 경우, viewedAt만 갱신
          recentlyViewedProducts[index].viewedAt = formatter.getFormattedDate(new Date(), 'YYYY-MM-DDTHH:mm:ss');

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
            viewedAt: formatter.getFormattedDate(new Date(), 'YYYY-MM-DDTHH:mm:ss')
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

    const getProductContactList = () => {
      axios.get(`/api/contact/list/${productId}?page=${state.page.currentPage - 1}&size=${state.page.pageSize}&sort=regDate,desc`).then(({data}) => {
        state.contacts = data.contacts;
        state.totalContacts = data.totalContacts;
        state.page.totalPages = data.totalPages;

      }).catch(() => {
        window.alert('오류가 발생했습니다. 다시 시도해주세요.');
      });
    };

    const getProductContactAnswer = (contactId) => {
      axios.get(`/api/contact/answer/${contactId}`).then(({data}) => {
        state.selectedContactAnswerContent  = data;

      }).catch(() => {
        window.alert('오류가 발생했습니다. 다시 시도해주세요.');
      });
    };

    const load = () => {
      state.isLoading = true; // 상품 정보 요청 전 로딩 상태를 true로 설정

      axios.get(`/api/product/${productId}`).then(({data}) => {
        if (data.productSizes && data.productSizes.length === 1) {
          state.selectedSizeId = data.productSizes[0].id;
        }

        state.product = data;
        recordRecentlyViewedProduct();
        checkWishlist();
        recordProductViewLog();

        state.page.currentPage = 1;
        getProductContactList();

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        router.back(); // 이전 페이지로 이동

      }).finally(() => {
        state.isLoading = false; // 요청 완료 후 로딩 상태를 false로 설정
      });
    };

    const addToCart = (productSizeId) => {
      if (isLoggedIn.value) {
        if (productSizeId === 0) {
          window.alert("사이즈를 선택해주세요.");

        } else {
          state.isSubmitting = true;

          const payload = {
            productSizeId: productSizeId,
            quantity: state.selectedQuantity
          };

          axios.post('/api/cart/add/by-product-size', payload).then(() => {
            window.alert('카트에 추가되었습니다.');

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
        }

      } else {
        window.alert('로그인이 필요합니다.');
      }
    };

    const showContactUsModal = (type) => {
      if (type === 'PRODUCT_INFO') {
        // 상품 문의의 경우
        state.contact.type = type;
        state.contact.product = state.product;

      } else {
        // 1:1 문의의 경우
        state.contact.type = '';
        state.contact.product = {id: 0, name:''};
      }
      state.showContactUsModal = true;
    };

    const goToPage = (page) => {
      state.page.currentPage = page;
      getProductContactList();
    };

    watch(() => state.selectedSizeId, (newSizeId, oldSizeId) => {
      if (newSizeId !== oldSizeId) {
        checkWishlist();
      }
    });

    onMounted(load);

    return {
      formatter, price,
      isMobile,
      route, state, isWishlist, imageListRef,
      isNew,
      zoom,
      scrollImageList,
      decrementQuantity, incrementQuantity,
      addToWishlist, removeFromWishlist, checkWishlist,
      toggleShowDetail,
      selectImage, addToCart,
      load,
      toggleContactContent, showContactUsModal, goToPage,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/product/product-detail";
</style>

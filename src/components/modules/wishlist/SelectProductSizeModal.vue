<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <span class="product-name">{{ state.product.name }}</span>

    <div class="product-sizes">
      <ul>
        <li v-for="(ps, idx) in state.product.productSizes" :key="idx">
          <div class="size">
            {{ ps.size }} <span class="size-stock">(재고: {{ ps.quantity }})</span>
          </div>
          <span v-if="ps.wishlists && ps.wishlists.length > 0" role="button" tabindex="0"
                @click="removeFromWishlist(ps.wishlists[0].id)">
            <i class="bi bi-heart-fill"></i>
          </span>
          <span v-else role="button" tabindex="0" @click="addToWishlist(ps.id)">
            <i class="bi bi-heart"></i>
          </span>
        </li>
      </ul>
    </div>

    <div class="actions">
      <span class="close-text" @click="close">닫기 X</span>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";

export default {
  name: "SelectProductSize",
  props: {show: Boolean, productId: Number},
  emits: ['close'],
  setup(props, {emit}) {
    const state = reactive({
      show: true,
      product: {},
    })

    const addToWishlist = (productSizeId) => {
      axios.post(`/api/wishlist/add/${productSizeId}`).then(() => {
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

    const removeFromWishlist = (wishlistId) => {
      axios.delete(`/api/wishlist/delete/${wishlistId}`).then(() => {
        load();
      })
    };

    const load = () => {
      const productId = props.productId;

      axios.get(`/api/product/with-user-wishlists/${productId}`).then(({data}) => {
        state.product = data;
      })
    }

    onMounted(load);

    const close = () => {
      state.show = false;
      emit('close');
    }

    return {
      state,
      addToWishlist, removeFromWishlist,
      close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/wishlist/select-product-size-modal";
</style>

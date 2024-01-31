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
          <span v-if="ps.favorites && ps.favorites.length > 0" role="button" tabindex="0"
                @click="removeFavorite(ps.favorites[0].id)">
            <i class="bi bi-heart-fill"></i>
          </span>
          <span v-else role="button" tabindex="0" @click="addFavorite(ps.id)">
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

    const addFavorite = (productSizeId) => {
      axios.post(`/api/favorite/add/${productSizeId}`).then(() => {
        load();

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
      });
    };

    const removeFavorite = (favoriteId) => {
      axios.delete(`/api/favorite/delete/${favoriteId}`).then(() => {
        load();
      })
    };

    const load = () => {
      const productId = props.productId;

      axios.get(`/api/product/with-user-favorites/${productId}`).then(({data}) => {
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
      addFavorite, removeFavorite,
      close,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/favorite/select-product-size-modal";
</style>

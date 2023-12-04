<template>
  <div class="modal-overlay" v-if="state.show"></div>

  <div class="modal-content" v-if="state.show">
    <h4>{{ state.product.name }}</h4>

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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검은색의 70% 투명도 */
  z-index: 999; /* 모달보다 하나 낮은 z-index */
}

.modal-content {
  position: fixed;
  top: 50%; /* 화면의 중앙에서 시작 */
  left: 50%; /* 화면의 중앙에서 시작 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 변환 */
  z-index: 1000;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-size: .75rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  display: flex;
  justify-content: space-between; /* size 내용은 왼쪽, heart icon 은 오른쪽으로 정렬합니다. */
  align-items: center; /* 항목들을 수직으로 중앙 정렬합니다. */
  border-bottom: 1px solid #eee;
  padding-block: 5px;
  padding-inline: 10px;
}

ul li i {
  float: right;
}

.size-stock {
  font-color: #888; /* 회색으로 설정 */
}

.actions {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 20px;
}

.close-text {
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
}
</style>

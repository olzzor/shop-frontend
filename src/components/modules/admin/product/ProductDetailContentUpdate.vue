<template>
  <div class="product-detail-content-update">
    <div class="title">
      <p>상품 상세 내용 변경</p>
      <button type="button" class="btn-update" @click="updateProductDetailContent">변경하기</button>
    </div>

    <div class="content">
      <div class="content-container">
        <CKEditor id="product-detail-content" v-model="editorContent" :uploadType="'products'"/>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";
import CKEditor from "@/components/common/CKEditor.vue";

export default {
  name: "ProductDetailContentUpdate",
  components: {CKEditor},
  data() {
    return {
      product: Object
    };
  },

  setup() {
    const route = useRoute();
    const editorContent = ref('');
    const state = reactive({
      form: {id: 0, content: ''}
    })

    const updateProductDetailContent = async () => {
      state.form.content = editorContent.value;

      axios.post('/api/product-detail/update/content', state.form).then(() => {
        window.alert('변경되었습니다.');
        load();
      }).catch(() => {
        window.alert('상품의 상세 내용 변경에 실패하였습니다.');
      });
    };

    const load = () => {
      axios.get(`/api/product-detail/content/${route.params.id}`).then(({data}) => {
        state.form.id = data.id;
        editorContent.value = data.content;
      })
    };

    onMounted(load);

    return {
      lib,
      editorContent, state,
      updateProductDetailContent,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/product/product-detail-content-update";
</style>

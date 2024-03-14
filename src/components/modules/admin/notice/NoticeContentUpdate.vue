<template>
  <div class="notice-content-update">
    <div class="title">
      <p>공지 상세 및 변경 (내용)</p>
      <button type="button" class="btn-update" @click="updateNotice">변경하기</button>
    </div>

    <div class="content">
      <div class="content-container">
<!--        <ToastUIEditor id="notice-content" v-model="editorContent" :uploadType="'notices'"/>-->
        <CKEditor id="notice-content" v-model="editorContent" :uploadType="'notices'"/>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";
// import ToastUIEditor from "@/components/common/ToastUIEditor.vue";
import CKEditor from "@/components/common/CKEditor.vue";

export default {
  name: "NoticeContentUpdate",
  components: {CKEditor},
  data() {
    return {
      notice: Object
    };
  },

  setup() {
    const route = useRoute();
    const editorContent = ref('');
    const state = reactive({
      form: {id: 0, content: ''}
    })

    const updateNotice = async () => {
      state.form.content = editorContent.value;

      axios.post('/api/notice/update/content', state.form).then(() => {
        window.alert('변경되었습니다.');
        load();
      }).catch(() => {
        window.alert('공지의 상세 내용 변경에 실패하였습니다.');
      });
    };

    const load = () => {
      axios.get(`/api/notice/content/${route.params.id}`).then(({data}) => {
        state.form.id = data.id;
        editorContent.value = data.content;
      })
    };

    onMounted(load);

    return {
      lib,
      editorContent, state,
      updateNotice,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/notice/notice-content-update";
</style>

<template>
  <div class="notice-content-update">
    <div class="title">
      <p>공지 상세 및 변경 (내용)</p>
      <button type="button" class="btn-update" @click="updateNotice">변경하기</button>
    </div>

    <div class="content">
      <div class="content-container">
        <ToastUIEditorComponent id="notice-content" v-model="editorContent" :uploadType="'notices'"/>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";
import ToastUIEditorComponent from "@/components/common/ToastUIEditor.vue";

export default {
  name: "NoticeContentUpdate",
  components: {ToastUIEditorComponent},
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

<!--<style>-->
<style scoped>
.notice-content-update {
  padding-inline: 30px;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title p {
  font-size: 20px;
  font-weight: bold;
}

.content {
  font-size: 12px;
}

.content-container {
  display: flex;
  flex-direction: row;
}

#notice-content {
  height: 800px;
  width: 100%;
}

.btn-update {
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}
</style>

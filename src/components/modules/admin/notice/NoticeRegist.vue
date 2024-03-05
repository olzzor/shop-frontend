<template>
  <div class="notice-regist">
    <div class="title">
      <p>공지 등록</p>
      <button type="button" class="btn-create-notice" @click="createNotice">등록하기</button>
    </div>

    <div class="content">
      <!-- 구분 선택 -->
      <div class="type-container">
        <label class="input-label" for="notice-type">구분</label>
        <div class="select-container">
          <select class="select-field" id="notice-type" v-model="state.form.notice.type">
            <option value="" disabled>구분</option>
            <option v-for="nt in noticeTypes" :key="nt" :value="nt">{{ nt }}</option>
          </select>
          <div class="error-message" v-if="state.errorMessage.type">{{ state.errorMessage.type }}</div>
        </div>
      </div>

      <!-- 메인이미지 업로드 -->
      <div class="main-image-container">
        <label class="input-label" for="notice-main-image">메인 이미지</label>
        <div class="input-container">
          <input type="file" class="file-input" id="notice-main-image" accept="image/*" @change="handleMainImageUpload"/>
          <div class="error-message" v-if="state.errorMessage.mainImage">{{ state.errorMessage.mainImage }}</div>
        </div>
      </div>

      <!-- 제목 입력 -->
      <div class="title-container">
        <label class="input-label" for="notice-title" >제목</label>
        <div class="input-container">
          <input type="text" class="input-field" id="notice-title" v-model="state.form.notice.title" placeholder="제목">
          <div class="error-message" v-if="state.errorMessage.title">{{ state.errorMessage.title }}</div>
        </div>
      </div>

      <!-- 내용 입력 -->
      <div class="content-container">
        <label class="input-label" for="notice-content">내용</label>
        <ToastUIEditorComponent id="notice-content" v-model="editorContent" :uploadType="'notices'"/>
      </div>

      <!-- 상태 선택 -->
      <div class="status-container">
        <label class="input-label" for="notice-status">상태</label>
        <select class="select-field" id="notice-status" v-model="state.form.notice.status">
          <option value="" disabled>상태</option>
          <option v-for="ns in noticeStatuses" :key="ns" :value="ns">
            {{ lib.getNoticeStatusName(ns) }}
          </option>
        </select>
      </div>

      <!-- 슬라이더 표시 유무 선택 및 이미지 업로드 -->
      <div class="show-in-slider-container">
        <label class="input-label" for="notice-show-in-slider">슬라이더 표시</label>
        <div class="input-container">
          <!-- state.form.notice.isSliderImage 현재 값을 select 요소의 값에 바인딩 -->
          <!-- 선택된 값이 'true' 문자열인 경우 state.form.notice.isSliderImage true로 설정하고, 그렇지 않은 경우 false로 설정 -->
          <select class="select-field" id="notice-show-in-slider" :value="state.form.notice.isSliderImage"
                  @change="state.form.notice.isSliderImage = ($event.target.value === 'true')">
            <option value="" disabled>슬라이더 표시</option>
            <option value=true>표시</option>
            <option value=false>비표시</option>
          </select>
          <input type="file" class="file-input" id="notice-show-in-slider-image" accept="image/*"
                 @change="handleSliderImageUpload" :disabled="!state.form.notice.isSliderImage"/>
          <div class="error-message" v-if="state.errorMessage.sliderImage">{{ state.errorMessage.sliderImage }}</div>
        </div>
      </div>

      <!-- 모달 표시 유무 선택 및 이미지 업로드 -->
      <div class="show-in-modal-container">
        <label class="input-label" for="notice-show-in-modal">모달 표시</label>
        <div class="input-container">
          <!-- state.form.notice.isModalImage 현재 값을 select 요소의 값에 바인딩 -->
          <!-- 선택된 값이 'true' 문자열인 경우 state.form.notice.isModalImage true로 설정하고, 그렇지 않은 경우 false로 설정 -->
          <select class="select-field" id="notice-show-in-modal" :value="state.form.notice.isModalImage"
                  @change="state.form.notice.isModalImage = ($event.target.value === 'true')">
            <option value="" disabled>모달 표시</option>
            <option value=true>표시</option>
            <option value=false>비표시</option>
          </select>
          <input type="file" class="file-input" id="notice-show-in-modal-image" accept="image/*"
                 @change="handleModalImageUpload" :disabled="!state.form.notice.isModalImage"/>
          <div class="error-message" v-if="state.errorMessage.modalImage">{{ state.errorMessage.modalImage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
// import CKEditorComponent from "@/components/shared/CKEditorComponent.vue";
import ToastUIEditorComponent from "@/components/common/ToastUIEditor.vue";

export default {
  name: "NoticeRegist",
  components: {ToastUIEditorComponent},
  setup() {
    const noticeTypes = lib.noticeTypes;
    const noticeStatuses = lib.noticeStatuses;

    const editorContent = ref('');
    const state = reactive({
      form: {
        notice: {type: '', title: '', content: '', status: 'INACTIVE', isSliderImage: false, isModalImage: false},
        files: {mainImage: null, sliderImage: null, modalImage: null},
      },
      errorMessage: {},
    });

    const handleMainImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        state.form.files.mainImage = file;
      }
    };

    const handleSliderImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        state.form.files.sliderImage = file;
      }
    };

    const handleModalImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        state.form.files.modalImage = file;
      }
    };

    const checkInput = () => {
      let result = true;

      const MAX_TITLE_LENGTH = 100;

      state.errorMessage = {};

      if (state.form.notice.type.length === 0) {
        state.errorMessage.type = "구분을 선택해주세요.";
      }

      if (!state.form.files.mainImage) {
        state.errorMessage.mainImage = "메인 이미지를 업로드해주세요.";
        result = false;
      }

      if (state.form.notice.title.length === 0) {
        state.errorMessage.title = "제목을 입력해주세요.";
        result = false;
      } else if (state.form.notice.title.length > MAX_TITLE_LENGTH) {
        state.errorMessage.title = "제목은 100자 이하로 입력해주세요.";
        result = false;
      }

      if (state.form.notice.isSliderImage && !state.form.files.sliderImage) {
        state.errorMessage.sliderImage = "슬라이더 이미지를 업로드해주세요.";
        result = false;
      }

      if (state.form.notice.isModalImage && !state.form.files.modalImage) {
        state.errorMessage.modalImage = "모달 이미지를 업로드해주세요.";
        result = false;
      }

      return result;
    };
    
    const createNotice = async () => {
      if (checkInput()) {
        state.form.notice.content = editorContent.value;

        const formData = new FormData();

        formData.append('notice', JSON.stringify(state.form.notice));

        // 각 이미지를 각각의 키로 FormData 객체에 추가
        formData.append('mainImage', state.form.files.mainImage);
        formData.append('sliderImage', state.form.files.sliderImage);
        formData.append('modalImage', state.form.files.modalImage);

        axios.post('/api/notice/register', formData, {
          headers: {'Content-Type': 'multipart/form-data'}

        }).then(() => {
          window.alert('등록되었습니다.');
          window.location.reload();

        }).catch(error => {
          if (error.response) {
            const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
            window.alert(errorMessage);
          } else {
            window.alert('오류가 발생했습니다. 다시 시도해주세요.');
          }
        });
      }
    };

    return {
      lib, noticeTypes, noticeStatuses,
      editorContent, state,
      handleMainImageUpload, handleSliderImageUpload, handleModalImageUpload,
      createNotice,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/notice/notice-regist";
</style>
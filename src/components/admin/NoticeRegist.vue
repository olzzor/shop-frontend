<template>
  <div class="notice-regist">
    <div class="title">
      <p>공지 등록</p>
      <button type="button" class="btn-create-notice" @click="createNotice">등록하기</button>
    </div>

    <div class="content">
      <div class="type-container">
        <label for="notice-type" class="input-label">구분</label>
        <select id="notice-type" class="select-field" v-model="state.form.notice.type">
          <option value="" disabled>구분</option>
          <option v-for="nt in noticeTypes" :key="nt" :value="nt">
            {{ nt }}
          </option>
        </select>
      </div>

      <div class="main-image-container">
        <label for="notice-main-image" class="input-label">메인 이미지</label>
        <input type="file" id="notice-main-image" class="file-input" accept="image/*" @change="handleMainImageUpload"/>
      </div>

      <div class="title-container">
        <label for="notice-title" class="input-label">제목</label>
        <input type="text" id="notice-title" class="input-field" v-model="state.form.notice.title" placeholder="제목">
      </div>

      <div class="content-container">
        <label for="notice-content" class="input-label">내용</label>
        <ToastUIEditorComponent id="notice-content" v-model="editorContent" :uploadType="'notices'"/>
      </div>

      <div class="status-container">
        <label for="notice-status" class="input-label">상태</label>
        <select id="notice-status" class="select-field" v-model="state.form.notice.status">
          <option value="" disabled>상태</option>
          <option v-for="ns in noticeStatuses" :key="ns" :value="ns">
            {{ lib.getNoticeStatusName(ns) }}
          </option>
        </select>
      </div>

      <div class="show-in-slider-container">
        <label for="notice-show-in-slider" class="input-label">슬라이더 표시</label>
        <!-- state.form.notice.isSliderImage 현재 값을 select 요소의 값에 바인딩 -->
        <!-- 선택된 값이 'true' 문자열인 경우 state.form.notice.isSliderImage true로 설정하고, 그렇지 않은 경우 false로 설정 -->
        <select id="notice-show-in-slider" class="select-field"
                :value="state.form.notice.isSliderImage"
                @change="state.form.notice.isSliderImage = ($event.target.value === 'true')">
          <option value="" disabled>슬라이더 표시</option>
          <option value=true>표시</option>
          <option value=false>비표시</option>
        </select>
        <input type="file" id="notice-show-in-slider-image" class="file-input" accept="image/*"
               @change="handleSliderImageUpload" :disabled="!state.form.notice.isSliderImage"/>
      </div>

      <div class="show-in-modal-container">
        <label for="notice-show-in-modal" class="input-label">모달 표시</label>
        <!-- state.form.notice.isModalImage 현재 값을 select 요소의 값에 바인딩 -->
        <!-- 선택된 값이 'true' 문자열인 경우 state.form.notice.isModalImage true로 설정하고, 그렇지 않은 경우 false로 설정 -->
        <select id="notice-show-in-modal" class="select-field"
                :value="state.form.notice.isModalImage"
                @change="state.form.notice.isModalImage = ($event.target.value === 'true')">
          <option value="" disabled>모달 표시</option>
          <option value=true>표시</option>
          <option value=false>비표시</option>
        </select>
        <input type="file" id="notice-show-in-modal-image" class="file-input" accept="image/*"
               @change="handleModalImageUpload" :disabled="!state.form.notice.isModalImage"/>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
// import CKEditorComponent from "@/components/shared/CKEditorComponent.vue";
import ToastUIEditorComponent from "@/components/shared/ToastUIEditorComponent.vue";

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
      }
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

    const createNotice = async () => {
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
          switch (error.response.status) {
            case 400: // BAD_REQUEST
              window.alert(error.response.data.message);
              break;
            case 401: // UNAUTHORIZED
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

    return {
      lib, noticeTypes, noticeStatuses,
      editorContent, state,
      handleMainImageUpload, handleSliderImageUpload, handleModalImageUpload,
      createNotice,
    }
  }
}
</script>

<style scoped>
.notice-regist {
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

.input-field, .select-field {
  margin-bottom: 10px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  height: 30px;
  background-color: transparent;
}

.input-field {
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 90%;
  height: 30px;
}

.select-field {
  border-color: #545454;
  outline: none;
  width: 40%;
  height: 30px;
}

.input-label {
  margin-right: 10px; /* 라벨과 입력 필드 사이의 간격 */
  font-weight: bold; /* 라벨 텍스트를 굵게 표시 */
  width: 100px; /* 라벨의 너비를 고정합니다. */
}

.type-container, .main-image-container, .title-container, .content-container, .status-container, .show-in-slider-container, .show-in-modal-container {
  display: flex;
  flex-direction: row;
}

.content-container {
  min-height: 510px;
}

.period-container div {
  display: flex;
}

.period-container div input {
  width: 40%;
}

.file-input {
  margin-bottom: 10px;
}

/* 슬라이더와 모달의 이미지 파일 입력 필드 크기 조정 */
#notice-show-in-slider-image, #notice-show-in-modal-image {
  margin-left: 10px;
  width: 40%;
}

#notice-content {
  width: 90%;
}

.btn-create-notice {
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
<template>
  <div class="notice-update">
    <div class="title">
      <p>공지 상세 및 변경</p>
      <button type="button" class="btn-update" @click="updateNotice">변경하기</button>
    </div>

    <div class="content">
      <table>
        <thead>
          <tr>
            <th></th><th></th><th>BEFORE</th><th>AFTER</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colspan="2" class="table-title">구분</td>
            <td>{{ state.notice.type }}</td>
            <td>
              <div class="select-container">
                <select class="select-field" v-model="state.form.notice.type">
                  <option v-for="nt in noticeTypes" :key="nt" :value="nt">{{ nt }}</option>
                </select>
                <div class="error-message" v-if="state.errorMessage.type">{{ state.errorMessage.type }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">제목</td>
            <td>{{ state.notice.title }}</td>
            <td>
              <div class="input-container">
                <input type="text" class="input-field" v-model="state.form.notice.title">
                <div class="error-message" v-if="state.errorMessage.title">{{ state.errorMessage.title }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">내용</td>
            <td>(생략)</td>
            <td><router-link :to="{ name: 'AdminNoticeContentUpdate', params: { id: state.notice.id }}">내용 변경</router-link></td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">메인 이미지</td>
            <td>
              <div class="image">
                <div class="image-box" v-if="state.notice.noticeMainImage">
                  <img class="notice-image" :src="`${state.notice.noticeMainImage.fileUrl}`" @click="showImage(state.notice.noticeMainImage.fileUrl)" />
                </div>
              </div>
            </td>
            <td>
              <div class="image">
                <div class="input-container">
                  <input type="file" class="file-input" id="notice-main-image" accept="image/*" @change="handleMainImageUpload"/>
                  <div class="error-message" v-if="state.errorMessage.mainImage">{{ state.errorMessage.mainImage }}</div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td rowspan="2" class="table-title">슬라이더</td>
            <td class="table-title">표시</td>
            <td>{{ state.notice.isSliderImage ? '표시' : '비표시' }}</td>
            <td>
              <select class="select-field" :value="state.form.notice.isSliderImage"
                      @change="state.form.notice.isSliderImage = ($event.target.value === 'true')">
                <option value=true>표시</option>
                <option value=false>비표시</option>
              </select>
            </td>
          </tr>

          <tr>
            <td class="table-title">이미지</td>
            <td>
              <div class="image">
                <div class="image-box" v-if="state.notice.noticeSliderImage">
                  <img class="notice-image" :src="`${state.notice.noticeSliderImage.fileUrl}`" @click="showImage(state.notice.noticeSliderImage.fileUrl)" />
                </div>
              </div>
            </td>
            <td>
              <div class="image">
                <div class="input-container">
                  <input type="file" class="file-input" id="notice-slider-image" accept="image/*"
                         @change="handleSliderImageUpload" :disabled="!state.form.notice.isSliderImage"/>
                  <div class="error-message" v-if="state.errorMessage.sliderImage">{{ state.errorMessage.sliderImage }}</div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td rowspan="2" class="table-title">모달</td>
            <td class="table-title">표시</td>
            <td>{{ state.notice.isModalImage ? '표시' : '비표시' }}</td>
            <td>
              <select class="select-field" :value="state.form.notice.isModalImage"
                      @change="state.form.notice.isModalImage = ($event.target.value === 'true')">
                <option value=true>표시</option>
                <option value=false>비표시</option>
              </select>
            </td>
          </tr>

          <tr>
            <td class="table-title">이미지</td>
            <td>
              <div class="image">
                <div class="image-box" v-if="state.notice.noticeModalImage">
                  <img class="notice-image" :src="`${state.notice.noticeModalImage.fileUrl}`" @click="showImage(state.notice.noticeModalImage.fileUrl)" />
                </div>
              </div>
            </td>
            <td>
              <div class="image">
                <div class="input-container">
                  <input type="file" class="file-input" id="notice-modal-image" accept="image/*"
                         @change="handleModalImageUpload" :disabled="!state.form.notice.isModalImage"/>
                  <div class="error-message" v-if="state.errorMessage.modalImage">{{ state.errorMessage.modalImage }}</div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">상태</td>
            <td>{{ lib.getNoticeStatusName(state.notice.status) }}</td>
            <td>
              <select class="select-field" v-model="state.form.notice.status">
                <option v-for="ns in noticeStatuses" :key="ns" :value="ns">
                  &nbsp;{{ lib.getNoticeStatusName(ns) }}
                </option>
              </select>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  name: 'NoticeUpdate',
  components: {},
  setup() {
    const noticeTypes = lib.noticeTypes;
    const noticeStatuses = lib.noticeStatuses;

    const route = useRoute();

    const state = reactive({
      notice: {},
      form: {
        notice: {},
        files: {mainImage: null, sliderImage: null, modalImage: null},
      },
      errorMessage: {},
    });

    const showImage = (fileUrl) => {
      window.open(fileUrl, '_blank');
    };

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

      if (!state.form.files.mainImage && !state.notice.noticeMainImage) {
        state.errorMessage.mainImage = "메인 이미지를 업로드해주세요.";
        result = false;
      }

      if (state.form.notice.title.length === 0) {
        state.errorMessage.title = "제목을 입력해주세요.";
        result = false;
      } else if (state.form.notice.title.length > MAX_TITLE_LENGTH) {
        state.errorMessage.title = `제목은 ${MAX_TITLE_LENGTH.toLocaleString()}자 이하로 입력해주세요.`;
        result = false;
      }

      if (state.form.notice.isSliderImage && !state.form.files.sliderImage && !state.notice.noticeSliderImage) {
        state.errorMessage.sliderImage = "슬라이더 이미지를 업로드해주세요.";
        result = false;
      }

      if (state.form.notice.isModalImage && !state.form.files.modalImage && !state.notice.noticeModalImage) {
        state.errorMessage.modalImage = "모달 이미지를 업로드해주세요.";
        result = false;
      }

      return result;
    };

    const updateNotice = async () => {
      if (checkInput()) {
        const formData = new FormData();

        formData.append('notice', JSON.stringify(state.form.notice));

        // 각 이미지를 각각의 키로 FormData 객체에 추가
        formData.append('mainImage', state.form.files.mainImage);
        formData.append('sliderImage', state.form.files.sliderImage);
        formData.append('modalImage', state.form.files.modalImage);

        axios.post('/api/notice/update/single', formData, {
          headers: {'Content-Type': 'multipart/form-data'}

        }).then(() => {
          window.alert('변경되었습니다.');
          load();

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

    const load = () => {
      axios.get(`/api/notice/detail/${route.params.id}`).then(({data}) => {
        setLoadData(data);
      });
    };

    const setLoadData = (data) => {
      state.notice = data;
      state.form.notice = {
        id: data.id,
        type: data.type,
        title: data.title,
        content: data.content,
        status: data.status,
        isSliderImage: data.isSliderImage,
        isModalImage: data.isModalImage
      };
      // state.form.files = {};
    }

    onMounted(load);

    return {
      lib, noticeTypes, noticeStatuses,
      state,
      showImage, handleMainImageUpload, handleSliderImageUpload, handleModalImageUpload,
      updateNotice,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/notice/notice-update";
</style>
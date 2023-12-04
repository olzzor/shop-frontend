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
            <th></th>
            <th></th>
            <th>BEFORE</th>
            <th>AFTER</th>
          </tr>
        </thead>

        <tbody>
        <tr>
          <td colspan="2" class="table-title">구분</td>
          <td>{{ state.notice.type }}</td>
          <td>
            <select class="select-field" v-model="state.form.notice.type">
              <option v-for="nt in noticeTypes" :key="nt" :value="nt">{{ nt }}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">제목</td>
          <td>{{ state.notice.title }}</td>
          <td><input type="text" class="input-field" v-model="state.form.notice.title"></td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">내용</td>
          <td>(생략)</td>
          <td><router-link :to="{ name: 'NoticeContentUpdate', params: { id: state.notice.id }}">내용 변경</router-link></td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">
            메인 이미지
            <button type="button" class="btn-image-download" @click="downloadImage(state.notice.noticeMainImage)">
              <i class="bi bi-download"></i>
            </button>
          </td>
          <td>
            <div class="image">
              <div v-if="state.notice.noticeMainImage" class="image-box">
                <img class="notice-image" :src="`${state.notice.noticeMainImage.filePath}${state.notice.noticeMainImage.fileName}`"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <div class="image">
                <input type="file" id="notice-main-image" class="file-input" accept="image/*"
                       @change="handleMainImageUpload"/>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td rowspan="2" class="table-title">슬라이더</td>
          <td class="table-title">표시</td>
          <td>{{ state.notice.isSliderImage ? '표시' : '비표시' }}</td>
          <td>
            <select class="select-field"
                    :value="state.form.notice.isSliderImage"
                    @change="state.form.notice.isSliderImage = ($event.target.value === 'true')">
              <option value=true>표시</option>
              <option value=false>비표시</option>
            </select>
          </td>
        </tr>

        <tr>
          <td class="table-title">이미지
            <button v-if="state.notice.noticeSliderImage" type="button" class="btn-image-download" @click="downloadImage(state.notice.noticeSliderImage)">
              <i class="bi bi-download"></i>
            </button>
          </td>
          <td>
            <div class="image">
              <div v-if="state.notice.noticeSliderImage" class="image-box">
                <img class="notice-image" :src="`${state.notice.noticeSliderImage.filePath}${state.notice.noticeSliderImage.fileName}`"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <input type="file" id="notice-slider-image" class="file-input" accept="image/*"
                     @change="handleSliderImageUpload" :disabled="!state.form.notice.isSliderImage"/>
            </div>
          </td>
        </tr>

        <tr>
          <td rowspan="2" class="table-title">모달</td>
          <td class="table-title">표시</td>
          <td>{{ state.notice.isModalImage ? '표시' : '비표시' }}</td>
          <td>
            <select class="select-field"
                    :value="state.form.notice.isModalImage"
                    @change="state.form.notice.isModalImage = ($event.target.value === 'true')">
              <option value=true>표시</option>
              <option value=false>비표시</option>
            </select>
          </td>
        </tr>

        <tr>
          <td class="table-title">이미지
            <button v-if="state.notice.noticeModalImage" type="button" class="btn-image-download" @click="downloadImage(state.notice.noticeModalImage)">
              <i class="bi bi-download"></i>
            </button>
          </td>
          <td>
            <div class="image">
              <div v-if="state.notice.noticeModalImage" class="image-box">
                <img class="notice-image" :src="`${state.notice.noticeModalImage.filePath}${state.notice.noticeModalImage.fileName}`"/>
              </div>
            </div>
          </td>
          <td>
            <div class="image">
              <input type="file" id="notice-modal-image" class="file-input" accept="image/*"
                     @change="handleModalImageUpload" :disabled="!state.form.notice.isModalImage"/>
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
    });

    const downloadImage = (noticeImage) => {
      const link = document.createElement('a');
      link.href = `${noticeImage.filePath}${noticeImage.fileName}`;
      link.download = noticeImage.fileName;
      link.click();
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

    const updateNotice = async () => {
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
      downloadImage, handleMainImageUpload, handleSliderImageUpload, handleModalImageUpload,
      updateNotice,
    }
  }
}
</script>

<style scoped>
.notice-update {
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

table {
  width: 100%;
  border-collapse: collapse;
}

tbody .table-title {
  background-color: #e3e3e3;
  border-color: white;
}

th, td {
  border: 1px solid #e3e3e3;
  padding-left: 5px;
}

th {
  border: none;
  border-bottom: 1px solid #e3e3e3;
  text-align: center;
}

th:nth-child(1), th:nth-child(2) {
  width: 5%;
}

th:nth-child(3), th:nth-child(4) {
  width: 45%;
}

tr {
  height: 40px;
}

.input-field, .select-field {
  margin-bottom: 5px;
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 100%;
  height: 30px;
  background-color: transparent;
}

.input-field {
  border: none;
  border-bottom: 1px solid #545454;
  outline: none;
  width: 100%;
  height: 30px;
}

.image {
  position: relative;
  display: inline-block;
  display: flex;
  overflow-x: auto; /* 이미지가 넘칠 경우 좌우 스크롤 */
  white-space: nowrap; /* 행 내부에서 줄바꿈 방지 */
}

.image-box {
  position: relative;
  margin-right: 6px;
  margin-block: 4px;
}

.notice-image {
  height: 150px;
  float: left;
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

.btn-image-download {
  border: none; /* 테두리 제거 */
  background-color: transparent; /* 배경색 투명으로 설정 */
  cursor: pointer; /* 마우스 커서를 손가락 모양으로 변경 */
}
</style>
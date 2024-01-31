<template>
  <div class="contact-update">
    <div class="title">문의 내역 상세</div>

    <div class="content">
      <ul>
        <li v-for="(contact, idx) in state.contacts" :key="idx">
          <div class="contact">
            <div class="contact-header">
              <span class="contact-title">[{{ lib.getContactTypeName(contact.type) }}] {{ contact.title }}</span>
              <span class="contact-inquirer">{{ contact.inquirerName }} ({{ contact.inquirerEmail }})</span>
            </div>

            <div class="contact-body">
              <span class="contact-content" v-html="lib.convertLineBreaks(contact.content)"></span>
            </div>

            <div class="contact-footer">
              <span class="contact-date">{{ lib.getFormattedDate(contact.regDate, 'YYYY-MM-DD HH:mm:ss') }}</span>
              <span class="contact-status">{{ lib.getContactStatusName(contact.status) }}</span>
            </div>
          </div>
        </li>
      </ul>

      <div class="answer-container">
        <div class="content-field" :class="{ 'input-error': state.errorMessage.content }">
          <textarea class="input-field" id="answer-content" placeholder="답변 내용" v-model="state.form.content" />
        </div>
        <div class="error-message" v-if="state.errorMessage.content">{{ state.errorMessage.content }}</div>
      </div>

      <div class="button-container">
        <button class="button btn-answer" type="button" @click="answer">답변하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";

export default {
  name: 'ContactUpdate',
  components: {},
  setup() {
    const route = useRoute();
    const contactId = route.params.id;
    const tableHeaders = ['문의 날짜', '문의자 이름', '문의자 메일', '문의 사항', '문의 제목', '문의 내용', '문의 상태'];

    const state = reactive({
      contacts: [],
      form: {id: 0, title: "", content: ""},
      errorMessage: {},
    });

    const answer = () => {
      const latestContact = state.contacts[state.contacts.length - 1];
      state.form.id = latestContact.id;
      state.form.title = "RE : " + latestContact.title;

      const args = JSON.parse(JSON.stringify(state.form));
      axios.post('/api/contact/answer', args).then(() => {
        window.alert('답변되었습니다.');
        load();
      });
    };

    const load = () => {
      axios.get(`/api/contact/detail/${contactId}`).then(({data}) => {
        state.contacts = [];
        for (let d of data) {
          state.contacts.push(d);
        }
      });
    };

    onMounted(load);

    return {
      lib,
      tableHeaders, state,
      answer
    }
  }
}
</script>

<style scoped>
.contact-update {
  padding-inline: 30px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: .75rem;
}

.input-field {
  border: none;
  outline: none;
  width: 100%;
  height: 30px;
  font-size: .75rem;
}

/* 웹킷 기반 브라우저(Chrome, Safari 등)의 자동완성 스타일을 덮어쓰기 위한 코드 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

.button {
  display: flex;
  justify-content: space-between;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  display: flex;
  border-bottom: 1px solid #eee;
}

.contact {
  display: flex; /* Flexbox 적용 */
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 10px 20px 10px 20px;
}
.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 아이템을 수직으로 중앙 정렬합니다 */
}

.contact-title {
  font-size: 1rem; /* 글자 크기를 증가하여 두 줄을 차지하게 합니다 */
  flex: 1; /* 나머지 공간을 차지하게 합니다 */
}

.contact-body {
  margin-block: 0.5rem;
}

.contact-footer {
  display: flex;
  justify-content: space-between;
  color: #888;
  align-items: center; /* 아이콘들을 수직 중앙에 위치시킵니다. */
}

.content-field {
  display: flex; /* Use flex to align items in one line */
  align-items: center; /* Vertically align items in the middle */
  border: 1px solid #ccc; /* Add border around the container */
  padding: 5px 10px; /* Add some padding inside the container */
  border-radius: 5px; /* Optional: for rounded corners */
  width: 100%;
  margin-top: 10px;
}

.content-field textarea.input-field {
  height: 150px; /* 원하는 높이값으로 조정하세요 */
}

.error-message {
  color: #dc3545;
  font-size: .75rem;
}

.button-container {
  display: flex;
  justify-content: center;
}

.btn-answer {
  align-items: center;
  justify-content: center;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  width: 500px;
  border-radius: 5px;
  border: none;
  margin: 10px 0 5px 0;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
}
</style>
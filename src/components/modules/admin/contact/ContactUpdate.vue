<template>
  <div class="contact-update">
    <div class="title">문의 내역 상세</div>

    <div class="content">
      <ul>
        <li v-for="(contact, idx) in state.contacts" :key="idx">
          <div class="contact">
            <div class="contact-header">
              <span class="contact-title">[{{ formatter.getContactTypeName(contact.type) }}] {{ contact.title }}</span>
              <span class="contact-inquirer">{{ contact.inquirerName }} ({{ contact.inquirerEmail }})</span>
            </div>

            <div class="contact-body">
              <span class="contact-content" v-html="formatter.convertLineBreaks(contact.content)"></span>
            </div>

            <div class="contact-footer">
              <span class="contact-date">{{ formatter.getFormattedDate(contact.regDate, 'YYYY-MM-DD HH:mm:ss') }}</span>
              <span class="contact-status">{{ formatter.getContactStatusName(contact.status) }}</span>
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
        <button type="button" class="btn-answer" @click="answer">답변하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import formatter from "@/scripts/formatter";

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
      formatter,
      tableHeaders, state,
      answer
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/contact/contact-update";
</style>
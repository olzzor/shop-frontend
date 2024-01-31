<template>
  <div class="contact-history">
    <div class="title">
      <span>문의 내역</span>
      <button class="btn-contact-us" type="button" @click="state.showContactUsModal = true">+ 1:1 문의하기</button>
    </div>

    <div class="content" v-if="state.contacts.length>0">
      <ul>
        <li v-for="(contact, idx) in state.contacts" :key="idx">
          <div class="contact">
            <div class="contact-details">
              <span class="contact-title">[{{ lib.getContactTypeName(contact.type) }}] {{ contact.title }}</span>
              <span class="contact-date">{{ lib.getFormattedDate(contact.regDate, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>

            <div class="contact-status">
              <router-link :to="{ name: 'ContactDetail', params: { id: contact.id }}">
                {{ lib.getContactStatusName(contact.status) }}
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content no-contact-data" v-else>등록된 문의 내역이 없습니다.</div>

    <ContactUsModal v-if="state.showContactUsModal" :show="state.showContactUsModal"
                    @close="state.showContactUsModal = false" @updated="load" />
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import ContactUsModal from "@/components/modules/contact/ContactUsModal.vue";

export default {
  name: 'ContactHistory',
  components: {ContactUsModal},
  setup() {
    const state = reactive({
      headerList: ['문의자 이름', '문의자 메일', '문의 사항', '문의 제목', '문의 상태', '문의 날짜'],
      contacts: [],
      showContactUsModal: false,
    })

    const load = () => {
      axios.get("/api/contact/history").then(({data}) => {
        state.contacts = data;
      });
    };

    onMounted(load);

    return {
      lib,
      state,
      load,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/contact/contact-history";
</style>
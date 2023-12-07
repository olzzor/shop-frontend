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
              <span class="contact-title">[{{ contact.type }}] {{ contact.title }}</span>
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
    <div v-else>등록된 문의 내역이 없습니다.</div>

    <ContactUsModal v-if="state.showContactUsModal" :show="state.showContactUsModal"
                    @close="state.showContactUsModal = false" @updated="load" />
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import lib from "@/scripts/lib";
import ContactUsModal from "@/components/modules/components/modal/ContactUsModal.vue";

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

<style scoped>
.contact-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}

.title {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: .75rem;
}

.btn-contact-us {
  background-color: #000; /* 버튼의 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양 변경 */
  font-size: 0.8rem;
  text-align: center;
  width: 100px;
  height: 28px;
  line-height: 28px;
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
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: space-between;
  width: 100%;
}

.contact-details {
  display: flex;
  flex-grow: 1; /* 가능한 모든 여유 공간을 차지하도록 설정 */
  flex-direction: column;
  margin: 10px 20px 10px 20px;
}

.contact-title {
  font-size: 1rem;
}

.contact-date {
  color: #888;
}

.contact-status {
  align-items: center; /* 아이콘들을 수직 중앙에 위치시킵니다. */
  flex: 0 0 auto; /* 고정 크기, 변경 불가능 */
  display: flex; /* 아이콘들을 수평으로 배치 */
  margin: 10px 20px 10px 20px;
}
</style>
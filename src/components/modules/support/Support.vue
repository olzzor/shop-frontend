<template>
  <div class="support">
    <div class="title"></div>

    <div class="content">
      <div class="contact-us">
        <ContactUs />
      </div>

      <div class="FAQ">
        <FrequentlyAskedQuestions />
      </div>
      <!--      <a href="/customer/contact-us" class="link">문의하기</a>-->
      <!--      <a href="/customer/FAQ" class="link">자주 묻는 질문</a>-->
      <!--      <a href="" class="link">배송 및 반품 정보</a>-->
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
// import axios from "axios";
// import store from "@/scripts/store";
import ContactUs from "@/components/modules/support/ContactUs.vue";
import FrequentlyAskedQuestions from "@/components/modules/support/FrequentlyAskedQuestions.vue";

export default {
  name: "Support",
  components: {ContactUs, FrequentlyAskedQuestions},
  setup() {
    const state = reactive({
      user: {},
      form: {
        password: "",
      },
    });

    return {state}
  },
}
</script>

<style scoped>
.support {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-inline: 15px;
}

.content {
  padding-inline: 15px;
  display: flex;
  justify-content: space-between;
}

.contact-us {
  flex: 0 0 40%;
  margin-right: 1%; /* 오른쪽 마진 추가 */
}

.FAQ {
  flex: 0 0 60%;
}
</style>

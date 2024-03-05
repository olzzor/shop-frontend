<template>
  <div class="frequently-asked-questions">
    <div class="title">
      <span>자주 묻는 질문</span>
      <button type="button" class="btn-contact-us" @click="state.showContactUsModal = true">+ 1:1 문의하기</button>
    </div>

    <div class="content">
      <div v-for="section in faqData" :key="section.title" class="sections">
        <div class="section">{{ section.title }}</div>

        <div v-for="qa in section.qaList" :key="qa.question" class="qa-container">
          <div class="question" @click="toggleQuestion(section.title, qa.id)">
            Q. {{ qa.question }}
            <i class="bi" :class="isQuestionOpen(section.title, qa.id) ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
          </div>

          <div class="answer" v-if="isQuestionOpen(section.title, qa.id)">
            A. {{ qa.answer }}
          </div>
        </div>
      </div>
    </div>

    <ContactUsModal v-if="state.showContactUsModal" :show="state.showContactUsModal"
                    @close="state.showContactUsModal = false" @updated="load" />
  </div>
</template>

<script>
import {reactive} from "vue";
import ContactUsModal from "@/components/modules/contact/ContactUsModal.vue";

export default {
  name: "FrequentlyAskedQuestions",
  components: {ContactUsModal},
  setup() {
    const state = reactive({
      showContactUsModal: false,
    });

    const faqData = reactive([
      {
        title: "주문 및 결제",
        qaList: [
          {id: 1, question: "주문을 취소하려면 어떻게 해야 합니까?", answer: "주문 취소는 주문이 배송되기 전에만 가능합니다. 주문 취소를 원하시면 '주문 내역'에서 해당 주문을 찾아 '주문 취소' 버튼을 클릭하십시오."},
          {id: 2, question: "어떤 결제 방법을 사용할 수 있나요?", answer: "우리는 카드 결제를 받고 있습니다."}
        ]
      },
      {
        title: "배송",
        qaList: [
          {id: 1, question: "배송은 얼마나 걸립니까?", answer: "표준 배송은 주문 후 5-7 영업일이 소요됩니다. 긴급 배송은 추가 비용이 발생하며 주문 후 2-3 영업일이 소요됩니다."},
          {id: 2, question: "배송 상태를 어떻게 확인할 수 있나요?", answer: "'주문 내역'에서 주문을 선택하면 배송 상태를 확인할 수 있습니다."}
        ]
      },
      {
        title: "반품 및 교환",
        qaList: [
          {id: 1, question: "상품을 반품하려면 어떻게 해야 합니까?", answer: "반품을 원하시면, 반품 요청을 접수하십시오. 반품은 구매일로부터 7일 이내에 접수해야 합니다."},
          {id: 2, question: "교환하려면 어떻게 해야 합니까?", answer: "교환을 원하시면, 우선 반품을 진행하고, 새로운 상품을 주문하십시오."}
        ]
      },
      {
        title: "계정 관리",
        qaList: [
          {id: 1, question: "계정 비밀번호를 잊어버렸습니다. 어떻게 재설정할 수 있나요?", answer: "'비밀번호 찾기' 링크를 클릭하여 이메일 주소를 입력하십시오. 임시 비밀번호를 이메일로 보내드립니다."},
        ]
      },
      {
        title: "상품 정보",
        qaList: [
          {id: 1, question: "상품의 재고를 어떻게 확인할 수 있나요?", answer: "각 상품 페이지에는 상품의 재고 상태가 표시됩니다. 만약 상품이 품절된 경우, 상품 페이지에 '품절'이라고 표시됩니다."},
          // {id: 2, question: "상품 사이즈가 맞지 않을 경우 어떻게 하나요?", answer: "상품 페이지에는 사이즈 차트가 있어 참조하실 수 있습니다. 만약 사이즈가 맞지 않는 경우, 무료로 교환하실 수 있습니다."}
        ]
      },
      {
        title: "할인 및 프로모션",
        qaList: [
          {id: 1, question: "쿠폰을 어떻게 사용하나요?", answer: "장바구니 페이지에 쿠폰을 선택하는 부분이 있습니다. 쿠폰을 선택하시면 할인이 적용됩니다."},
          // {id: 2, question: "회원가입 할인은 어떻게 받을 수 있나요?", answer: "회원가입을 하시면 이메일로 할인 코드를 보내드립니다."}
        ]
      },
      {
        title: "기타",
        qaList: [
          {id: 1, question: "제품에 문제가 있을 경우 어떻게 해야 하나요?", answer: "문제가 있는 제품을 받으셨다면 고객 서비스 센터로 연락 주시기 바랍니다. 가능한 한 빨리 해결해 드리겠습니다."},
          {id: 2, question: "온라인 상점 외에 오프라인 매장도 있나요?", answer: "네, 오프라인 매장의 위치는 웹사이트의 ‘매장 찾기’ 섹션에서 확인하실 수 있습니다."}
        ]
      },
      {
        title: "국제 주문",
        qaList: [
          {id: 1, question: "해외 배송은 가능한가요?", answer: "아니요, 국내 배송만 대응하고 있습니다."},
        ]
      },
    ]);

    const openQuestions = reactive({});

    const toggleQuestion = (section, id) => {
      if (!openQuestions[section]) {
        openQuestions[section] = {};
      }
      openQuestions[section][id] = !openQuestions[section][id];
    };

    const isQuestionOpen = (section, id) => {
      return openQuestions[section] && openQuestions[section][id];
    };

    return {
      state, faqData,
      toggleQuestion, isQuestionOpen
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/support/frequently-asked-questions";
</style>
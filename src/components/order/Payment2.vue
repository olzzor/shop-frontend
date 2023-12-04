<template>
  <div class="order">
    <div class="container">
      <div class="col-md-7 col-lg-8"><h4 class="mb-3">주문자 정보</h4>
        <div class="needs-validation" novalidate="">
          <div class="row g-3">
            <div class="col-12"><label for="username" class="form-label">이름</label>
              <input type="text" class="form-control" id="username" v-model="state.form.name" @change="onDataChanged">
            </div>
            <div class="col-12"><label for="address" class="form-label">주소</label>
              <input type="text" class="form-control" id="address" v-model="state.form.address" @change="onDataChanged">
            </div>
          </div>
          <hr class="my-4">
          <h4 class="mb-3">결제 수단</h4>
          <div class="my-3">
            <div class="form-check">
              <input id="card" name="paymentMethod" type="radio" class="form-check-input"
                     value="card" v-model="state.form.payment" @change="onDataChanged">
              <label class="form-check-label" for="card">신용카드
              </label></div>
            <div class="form-check">
              <input id="bank" name="paymentMethod" type="radio" class="form-check-input"
                     value="bank" v-model="state.form.payment" @change="onDataChanged">
              <label class="form-check-label" for="bank">무통장입금</label>
            </div>
          </div>
          <label for="cc-name" class="form-label">카드 번호</label>
          <input type="text"
                 class="form-control"
                 id="cc-name"
                 v-model="state.form.cardNumber" @change="onDataChanged">
          <hr class="my-4">
          <button class="w-100 btn btn-primary btn-lg" @click="submit()">결제하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import router from "@/scripts/router";
// import axios from "axios";

export default {
  name: "Payment2",
  props: {
    paymentState: Object
  },
  setup() {
    const state = reactive({
      items: [],
      form: {
        name: "",
        address: "",
        payment: "",
        cardNumber: "",
        items: "",
      }
    })
    const submit = () => {
      const args = JSON.parse(JSON.stringify(state.form));
      args.items = JSON.stringify(state.items);

      axios.post("/api/orders", args).then(() => {
        alert('주문 완료하였습니다.');
        router.push({path: "/orders"})
      })
    };
    return {state, submit}
  }
}
</script>

<style scoped>
</style>
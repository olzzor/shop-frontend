<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>배송 정보 입력</h2>
      <div class="name">
        <input type="text" class="input-field" v-model="state.form.orderNumber" placeholder="주문 번호" disabled>

        <select class="select-field" v-model="state.form.courier">
          <option v-for="cc in courierCompanies" :key="cc" :value="cc">
            {{ lib.getCourierCompanyName(cc) }}
          </option>
        </select>

        <input type="text" class="input-field" v-model="state.form.trackingNumber" placeholder="송장 번호">

        <select class="select-field" v-model="state.form.status">
          <option v-for="status in shipmentStatuses" :key="status" :value="status">
            {{ lib.getShipmentStatusName(status) }}
          </option>
        </select>
      </div>
      <button @click="regist">저장</button>
      <button @click="closeModal">취소</button>
    </div>
  </div>
</template>

<script>
import {reactive} from 'vue';
import axios from 'axios';
import lib from "@/scripts/lib";

export default {
  props: ['isVisible', 'orderNumber'],
  setup(props, {emit}) {
    const courierCompanies = lib.courierCompanies;
    const shipmentStatuses = lib.shipmentStatuses;

    const state = reactive({
      form: {orderNumber: "", courier: "", trackingNumber: "", status: "",}
    })

    const regist = () => {
      axios.post('/api/shipment/regist', state.form).then(() => {
        closeModal();
      });
    }

    const closeModal = () => {
      emit('close');
    };

    const load = () => {
      state.form.orderNumber = props.orderNumber;
    }
    load();

    return {
      lib, courierCompanies, shipmentStatuses,
      state,
      regist, closeModal,
    };
  }
}
</script>

<!--<style>-->
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

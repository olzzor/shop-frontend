<template>
  <div class="shipment-detail">
    <div class="title">
      <p>주문 상세 및 변경</p>
      <button type="button" class="btn-update" @click="updateOrder">변경하기</button>
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
          <td colspan="2" class="table-title">주문 번호</td>
          <td>{{ state.order.orderNumber }}</td>
          <td>{{ state.order.orderNumber }}</td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">주문자 이메일</td>
          <td>{{ state.order.buyerEmail }}</td>
          <td><input type="text" class="input-field" v-model="state.form.buyerEmail"/></td>
        </tr>

        <tr>
          <td rowspan="2" class="table-title">결제</td>
          <td class="table-title">결제 수단</td>
          <td>
            {{ state.order.paymentMethod }}
            {{ state.order.cardNumber }}
          </td>
          <td>
            {{ state.order.paymentMethod }}
            {{ state.order.cardNumber }}
          </td>
        </tr>

        <tr>
          <td class="table-title">금액</td>
          <td>{{ lib.getFormattedNumber(state.order.paymentAmount) }}원</td>
          <td>{{ lib.getFormattedNumber(state.order.paymentAmount) }}원</td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">주문 상품</td>
          <td>
            <div v-for="od in state.order.orderDetails" :key="od">
              {{ od.product.name }}/ {{ od.productSize.size }}/ {{ od.quantity }}개/ {{ lib.getFormattedNumber(od.unitPrice) }}원
            </div>
          </td>
          <td>
            <div v-for="od in state.order.orderDetails" :key="od">
              {{ od.product.name }}/ {{ od.productSize.size }}/ {{ od.quantity }}개/ {{ lib.getFormattedNumber(od.unitPrice) }}원
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">주문 상태</td>
          <td>{{ lib.getOrderStatusName(state.order.status) }}</td>
          <td>
            <select class="select-field" v-model="state.form.status">
              <option disabled value="">주문 상태</option>
              <option v-for="status in orderStatuses" :key="status" :value="status">{{ lib.getOrderStatusName(status) }}</option>
            </select>
          </td>
        </tr>

        <template v-for="(od, idx) in state.order.orderDetails" :key="idx">
          <tr>
            <td rowspan="6" class="table-title">{{ od.product.name }}</td>
            <td class="table-title">수령인</td>
            <td>{{ od.shipment.recipientName }}</td>
            <td><input type="text" class="input-field" v-model="state.form.orderDetails[idx].shipment.recipientName"/></td>
          </tr>

          <tr>
            <td class="table-title">연락처</td>
            <td>{{ od.shipment.recipientPhone }}</td>
            <td><input type="text" class="input-field" v-model="state.form.orderDetails[idx].shipment.recipientPhone"/></td>
          </tr>

          <tr>
            <td class="table-title">주소</td>
            <td>{{ od.shipment.shippingAddress }}</td>
            <td><input type="text" class="input-field" v-model="state.form.orderDetails[idx].shipment.shippingAddress"/></td>
          </tr>

          <tr>
            <td class="table-title">배송 업체</td>
            <td>{{ lib.getCourierCompanyName(od.shipment.courierCompany) }}</td>
            <td>
              <select class="select-field" v-model="state.form.orderDetails[idx].shipment.courierCompany">
                <option disabled value=""></option>
                <option v-for="cc in courierCompanies" :key="cc" :value="cc">
                  {{ lib.getCourierCompanyName(cc) }}
                </option>
              </select>
            </td>
          </tr>

          <tr>
            <td class="table-title">송장 번호</td>
            <td>{{ od.shipment.trackingNumber }}</td>
            <td><input type="text" class="input-field" v-model="state.form.orderDetails[idx].shipment.trackingNumber"/></td>
          </tr>

          <tr>
            <td class="table-title">배송 상태</td>
            <td>{{ lib.getShipmentStatusName(od.shipment.status) }}</td>
            <td>
              <select class="select-field" v-model="state.form.orderDetails[idx].shipment.status">
                <option disabled value=""></option>
                <option v-for="status in shipmentStatuses" :key="status" :value="status">{{ lib.getShipmentStatusName(status) }}</option>
              </select>
            </td>
          </tr>
        </template>
        </tbody>
      </table>

      <div class="message">
        <span>※ 배송 완료 상품은 변경이 불가능합니다.</span>
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
  name: 'OrderUpdate',
  components: {},
  setup() {
    const courierCompanies = lib.courierCompanies;
    const orderStatuses = lib.orderStatuses;
    const shipmentStatuses = lib.shipmentStatuses;

    const route = useRoute();
    const state = reactive({
      order: {},
      form: {
        id:0, buyerEmail: "", status: "",
        orderDetails: {
          shipment: {id:0, recipientName: '', recipientPhone: '', shippingAddress: '', courierCompany: '', trackingNumber:'', status: ''}
        }
      },
    })

    const updateOrder = async () => {
      axios.post('/api/order/update/single', state.form).then(() => {
        window.alert('변경되었습니다.');
        location.reload();
      });
    }

    const load = () => {
      axios.get(`/api/order/detail/admin/${route.params.id}`).then(({data}) => {
        state.order = data;
        state.form = JSON.parse(JSON.stringify(data));
      });
    }

    onMounted(load);

    return {
      lib,
      state, courierCompanies, orderStatuses, shipmentStatuses,
      updateOrder,
    }
  }
}
</script>

<style scoped>
.shipment-detail {
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
  width: 10%;
}

th:nth-child(3), th:nth-child(4) {
  width: 40%;
}

tr {
  height: 40px;
}

tbody .table-title {
  background-color: #e3e3e3;
  border-color: white;
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

.product-detail td:first-child {
  width: 100px;
}

.product-detail td:last-child {
  width: 100px;
  text-align: center;
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
</style>
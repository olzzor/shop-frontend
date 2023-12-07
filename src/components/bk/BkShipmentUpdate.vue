<template>
  <div class="shipment-detail">
    <div class="title">
      주문 상세
    </div>

    <div class="content">
      <table>
        <thead>
        <tr>
          <th colspan="2"></th>
          <th>변경 전</th>
          <th>변경 후</th>
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
            <div v-for="order in state.order.orderDetails" :key="order">
              {{ order.product.name }}
            </div>
          </td>
          <td>
            <div v-for="order in state.order.orderDetails" :key="order">
              {{ order.product.name }}
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="table-title">주문 상태</td>
          <td>{{ lib.getOrderStatusName(state.order.status) }}</td>
          <td>
            <select class="select-field" v-model="state.form.status">
              <option disabled value="">주문 상태</option>
              <option v-for="status in orderStatuses" :key="status" :value="status">{{
                  lib.getOrderStatusName(status)
                }}
              </option>
            </select>
          </td>
        </tr>

        <template v-for="(orderDetail, idx) in state.order.orderDetails" :key="idx">
          <tr>
            <td rowspan="6" class="table-title">배송 정보 ({{ idx + 1 }})</td>
            <td class="table-title">수령인</td>
            <td>{{ orderDetail.shipment.recipientName }}</td>
            <td><input type="text" class="input-field" v-model="state.form.orderDetails[idx].shipment.recipientName"/>
            </td>
          </tr>

          <tr>
            <td class="table-title">연락처</td>
            <td>{{ orderDetail.shipment.recipientPhone }}</td>
            <td><input type="text" class="input-field" v-model="state.form.shipments[idx].recipientPhone"/></td>
          </tr>

          <tr>
            <td class="table-title">주소</td>
            <td>{{ orderDetail.shipment.shippingAddress }}</td>
            <td><input type="text" class="input-field" v-model="state.form.shipments[idx].shippingAddress"/></td>
          </tr>

          <tr>
            <td class="table-title">택배사</td>
            <td>{{ orderDetail.shipment.courierCompany }}</td>
            <td>
              <select class="select-field" v-model="state.form.shipments[idx].courier">
                <option disabled value="">택배사</option>
                <option v-for="cc in courierCompanies" :key="cc" :value="cc">
                  {{ lib.getCourierCompanyName(cc) }}
                </option>
              </select>
            </td>
          </tr>

          <tr>
            <td class="table-title">배송 상태</td>
            <td>{{ lib.getShipmentStatusName(orderDetail.shipment.status) }}</td>
            <td>
              <select class="select-field" v-model="state.form.shipments[idx].status">
                <option disabled value="">주문 상태</option>
                <option v-for="status in shipmentStatuses" :key="status" :value="status">
                  {{ lib.getShipmentStatusName(status) }}
                </option>
              </select>
            </td>
          </tr>
        </template>
        </tbody>
      </table>

      <div class="button">
        <input type="button" class="btn continue" value="변경하기" @click="update"/>
        <input type="button" class="btn previous" value="돌아가기" @click="back"/>
      </div>

      <div class="message">
        <span>※ 배송 완료 상품은 변경이 불가능합니다.</span>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import lib from "@/scripts/lib";
import router from "@/scripts/router";

export default {
  name: 'ShipmentUpdate',
  components: {},
  setup() {
    const route = useRoute();
    const courierCompanies = ['CJ_LOGISTICS', 'LOTTE', 'KOREA_POST', 'LOGEN', 'HANJIN', 'CU', 'KYUNG_DONG', 'GS_POSTBOX', 'OTHER'];
    const orderStatuses = ['ORDER_RECEIVED', 'ORDER_CONFIRMED', 'ORDER_FINALIZED', 'SHIPMENT_PREPARING', 'CANCEL_REQUESTED', 'CANCEL_COMPLETED'];
    const shipmentStatuses = ['PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELED'];

    const state = reactive({
      shipment: {},
      form: {
        orderNumber: "", buyerEmail: "", paymentMethod: "", status: "",
        orderDetails: {
          product: {code: '', name: '', productImages: {}},
          shipment: {courierCompany: '', trackingNumber: '', status: ''}
        }

        // orderNumber: "", orderProduct: [], buyerEmail: "", paymentMethod: "", paymentAmount: 0, status: "",
        // shipments: [{recipientName: "", recipientPhone: "", shippingAddress: "", courier: "", trackingNumber: "", status: "", shippingProduct: []}]
      },
    })

    const update = async () => {
      axios.post('/api/shipment/update', JSON.stringify({
        ...state.form,
        orderProduct: JSON.stringify(state.form.orderProduct),
        shipments: state.form.shipments.map(shipment => ({
          ...shipment,
          shippingProduct: JSON.stringify(shipment.shippingProduct)
        }))
      }), {
        headers: {'Content-Type': 'application/json'}
      }).then(() => {
        window.alert('변경되었습니다.');
        location.reload();
      });
    }

    const back = () => {
      router.push({path: "/admin/order-list"});
    }

    const load = () => {
      axios.get(`/api/shipment/detail/${route.params.trackingNumber}`).then(({data}) => {
        state.shipment = data;
        state.form = JSON.parse(JSON.stringify(data));
      });
    }

    load();

    return {
      lib,
      state, courierCompanies, orderStatuses, shipmentStatuses,
      update, back,
    }
  }
}
</script>

<style scoped>
.shipment-detail {
  padding-inline: 30px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

table {
  border: 1px solid #e3e3e3;
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #e3e3e3;
  padding-left: 5px;
}

table tr {
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

.button {
  display: flex;
  justify-content: space-between;
}

.btn {
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 2.8125rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 50%;
  margin-top: 10px;
}

.product-detail td:first-child {
  width: 100px;
}

.product-detail td:last-child {
  width: 100px;
  text-align: center;
}

.continue {
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
  margin-right: 10px;
}

.previous {
  border-color: rgb(0, 0, 0);
}
</style>
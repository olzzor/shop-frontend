<template>
  <div class="order-update">
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
            <td>{{ formatter.getFormattedNumber(state.order.paymentAmount) }}원</td>
            <td>{{ formatter.getFormattedNumber(state.order.paymentAmount) }}원</td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">주문 상품</td>
            <td>
              <div v-for="od in state.order.orderDetails" :key="od">
                {{ od.product.name }}/ {{ od.productSize.size }}/ {{ od.quantity }}개/ {{ formatter.getFormattedNumber(od.unitPrice) }}원
              </div>
            </td>
            <td>
              <div v-for="od in state.order.orderDetails" :key="od">
                {{ od.product.name }}/ {{ od.productSize.size }}/ {{ od.quantity }}개/ {{ formatter.getFormattedNumber(od.unitPrice) }}원
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="table-title">주문 상태</td>
            <td>{{ formatter.getOrderStatusName(state.order.status) }}</td>
            <td>
              <select class="select-field" v-model="state.form.status">
                <option disabled value="">주문 상태</option>
                <option v-for="os in orderStatuses" :key="os.key" :value="os.key">{{ os.description }}</option>
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
              <td>{{ formatter.getCourierCompanyName(od.shipment.courierCompany) }}</td>
              <td>
                <select class="select-field" v-model="state.form.orderDetails[idx].shipment.courierCompany">
                  <option disabled value=""></option>
                  <option v-for="cc in courierCompanies" :key="cc.key" :value="cc.key">{{ cc.description }}</option>
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
              <td>{{ formatter.getShipmentStatusName(od.shipment.status) }}</td>
              <td>
                <select class="select-field" v-model="state.form.orderDetails[idx].shipment.status">
                  <option disabled value=""></option>
                  <option v-for="ss in shipmentStatuses" :key="ss.key" :value="ss.key">{{ ss.description }}</option>
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
import constants from "@/scripts/constants";
import formatter from "@/scripts/formatter";

export default {
  name: 'OrderUpdate',
  components: {},
  setup() {
    const courierCompanies = constants.COURIER_COMPANIES;
    const orderStatuses = constants.ORDER_STATUSES;
    const shipmentStatuses = constants.SHIPMENT_STATUSES;

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
      formatter,
      state, courierCompanies, orderStatuses, shipmentStatuses,
      updateOrder,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/order/order-update";
</style>
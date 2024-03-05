<template>
  <div class="address-edit">
    <div class="title">
      <span>주소지 추가 및 변경</span>
      <button type="button" class="btn-add-address" v-if="!state.isLoading" @click="state.showAddAddressModal = true">+ 추가</button>
    </div>

    <div class="content" v-if="state.addresses.length>0">
      <ul class="addresses">
        <li v-for="a in state.addresses" :key="a.id">
          <div class="address-header">
            <span>{{ a.name }}</span>
            <div class="default-address" v-if="a.default">기본 주소지</div>
          </div>

          <div class="address-details">
            {{ a.phoneNumber }}<br>
            {{ a.address1 }} {{ a.address2 }}
          </div>

          <div class="address-actions">
            <button type="button" class="button btn-edit" @click="showEditAddressModal(a.id)">수정</button>
            <button type="button" class="button btn-delete" @click="deleteAddress(a.id)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="content no-address-data" v-else>등록된 주소지가 없습니다.</div>

    <AddAddressModal v-if="state.showAddAddressModal" :show="state.showAddAddressModal"
                     @close="state.showAddAddressModal = false" @updated="load" />
    <EditAddressModal v-if="state.showEditAddressModal" :show="state.showEditAddressModal"
                      :addressId="state.selectedAddressId"
                      @close="state.showEditAddressModal = false" @updated="load" />
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import axios from "axios";
import AddAddressModal from "@/components/modules/account/AddressAddModal.vue";
import EditAddressModal from "@/components/modules/account/AddressEditModal.vue";

export default {
  name: "AddressEdit",
  components: {AddAddressModal, EditAddressModal},
  setup() {
    const state = reactive({
      isLoading: true,
      addresses: [],
      showAddAddressModal: false,
      showEditAddressModal: false,
      selectedAddressId: null,
    });

    const showEditAddressModal = (addressId) => {
      state.selectedAddressId = addressId;
      state.showEditAddressModal = true;
    };

    const deleteAddress = (addressId) => {
      if (window.confirm('주소를 삭제하시겠습니까?')) {
        axios.post(`/api/address/delete/${addressId}`).then(() => {
          window.alert('삭제되었습니다.');
          load();
        });
      }
    };

    const editAddress = () => {
      axios.post("/api/address/edit", state.form).then(() => {

        window.alert('수정되었습니다.');
        load();
      })
    };

    const load = () => {
      state.isLoading = true;

      axios.get("/api/address/get").then(({data}) => {
        state.addresses = data;
        console.log(state.addresses);

      }).catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.message || '오류가 발생했습니다. 다시 시도해주세요.';
          window.alert(errorMessage);
        } else {
          window.alert('오류가 발생했습니다. 다시 시도해주세요.');
        }

      }).finally(() => {
        state.isLoading = false;
      });
    };

    onMounted(load);

    return {
      state,
      load,
      showEditAddressModal,
      editAddress, deleteAddress,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/account/address-edit";
</style>
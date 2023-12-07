<template>
  <div class="address-edit">
    <div class="title">
      <span>주소지 추가 및 변경</span>
      <button class="btn-add-address" type="button" @click="state.showAddAddressModal = true">+ 추가</button>
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
            <button class="button btn-edit" @click="showEditAddressModal(a.id)">수정</button>
            <button class="button btn-delete" @click="deleteAddress(a.id)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>등록된 주소지가 없습니다.</div>

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
      axios.get("/api/address/get").then(({data}) => {
        state.addresses = data;
        console.log(state.addresses);
      });
    }

    onMounted(load);

    return {
      state,
      load,
      showEditAddressModal,
      deleteAddress, editAddress,
    }
  }
}
</script>

<style scoped>
.address-edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
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

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.addresses li {
  border: 1px solid #ccc; /* 선의 색상과 두께 조절 */
  border-radius: 5px; /* Optional: for rounded corners */
  padding: 10px 20px; /* 선과 내용 사이의 간격 조절 */
  margin-bottom: 10px; /* 아래 요소와의 간격 조절 */
}

.address-header {
  display: flex;
  justify-content: space-between; /* 버튼들을 좌우로 정렬 */
  width: 100%; /* 컨테이너의 너비를 최대로 설정 */
  margin-top: 10px; /* 버튼 컨테이너와 그 위의 요소와의 간격 설정 */
}

.address-header span {
  font-size: 1.2em; /* 글자 크기 변경 */
  font-weight: bold; /* 글자 굵기 변경 */
}

.address-details {
  margin-block: 5px; /* 버튼 컨테이너와 그 위의 요소와의 간격 설정 */
}

.address-actions {
  display: flex;
  justify-content: space-between; /* 버튼들을 좌우로 정렬 */
  width: 100%; /* 컨테이너의 너비를 최대로 설정 */
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  height: 3.2rem;
  justify-content: center;
  text-align: center;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  width: 100%;
  margin-block: 5px;
}

.btn-add-address {
  background-color: #000; /* 버튼의 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양 변경 */
  font-size: 0.8rem;
  text-align: center;
  width: 70px;
  height: 28px;
  line-height: 28px;
}

.btn-edit, .btn-delete {
  background-color: transparent;
  width: 80px; /* 버튼의 폭 설정 */
  height: 25px; /* 버튼의 높이 설정 */
  margin-top: 5px; /* 버튼 위 간격 조절 */
  padding: 0; /* 내부 패딩 제거 */
  display: inline-block; /* 버튼을 인라인 요소처럼 표시 */
}

.default-address {
  padding: 0.35em 0.65em;
  border: 1px solid black; /* 테두리 추가 */
  background-color: #e3e3e3;
  color: black;
  width: 6rem;
  /* 내용 중앙 정렬 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
}
</style>
<template>
  <div class="postcode-demo">
<!--    <button @click="showPopup()">주소검색</button>-->
    <div class="post-box">
      <template>
        <VueDaumPostcode @load="showPopup"/>
      </template>
    </div>
    <div class="form-box">
      <input type="button" @click="showPopup" value="주소찾기">
    </div>
  </div>
</template>

<script>
import {VueDaumPostcode} from "vue-daum-postcode";
export default {
  name: "TestDaumAPI",
  components: {VueDaumPostcode},
  methods: {
    showPopup() {
      new window.daum.Postcode({
        oncomplete: function (data) {
          console.log(data);
        },
      }).open();
    }
  }
}
</script>

<style scoped>
.postcode-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
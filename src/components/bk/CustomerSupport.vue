<template>
  <div class="contact">
    <div class="container">
      <ContactUs/> <!--문의하기-->
      <!--자주 묻는 질문-->
    </div>
  </div>
</template>

<script>
import ContactUs from "@/components/modules/contact/ContactUs.vue";

export default {
  name: 'CustomerSupport',
  components: {ContactUs},
  setup() {
  }
}
</script>

<style scoped>
.contact {
  padding: 5rem;
  padding-top: calc(5rem + 70px);
  padding-inline: 30px;
  background-color: #f7f7f7;
}

.container {
  display: flex;
  max-width: 960px;
  margin: auto;
}
</style>
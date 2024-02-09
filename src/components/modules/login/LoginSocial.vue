<!-- 소셜 로그인 리다이렉트 페이지 -->
<template>
  <div class="social-login">
    <div class="spinner-container">
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <p>Loading...</p>
  </div>
</template>

<script>
import useSocialLogin from "@/scripts/socialLogin";
import {useRoute} from "vue-router";

export default {
  name: "LoginSocial",
  setup() {
    const route = useRoute();
    const {doSocialLogin} = useSocialLogin();

    doSocialLogin(route.query.provider.toUpperCase());
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/login/login-social";
</style>

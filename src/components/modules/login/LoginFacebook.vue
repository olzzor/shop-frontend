<template>
  <div className="main">
    <b-card>
      <b-card-title>
        Facebook Login View
      </b-card-title>
      <b-card-body>
        <b-badge v-if="loginResult.status === 'SUCCESS'" variant="success">로그인 성공</b-badge>
        <b-badge v-else-if="loginResult.status === 'FAIL'" variant="danger">로그인 실패</b-badge>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import useSocialLogin from "@/scripts/mixin/socialLogin";

export default {
  name: "FacebookLogin",
  setup() {
    const { loginResult, doSocialLogin } = useSocialLogin();

    doSocialLogin('FACEBOOK');

    return {
      loginResult
    };
  }
}
</script>

<style scoped>

</style>

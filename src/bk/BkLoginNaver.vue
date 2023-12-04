<template>
  <a @click="loginWithNaver"><img src="/img/login/btn_login_naver.png" class="w-100"/></a>
</template>

<script>
export default {
  name: 'LoginNaver',

  methods: {
    loginWithNaver() {
      const authUrl = 'https://nid.naver.com/oauth2.0/authorize';
      const clientId = 'lRrQyVJfr2_5u5M3vh7R';
      const redirectUri = 'http://localhost.test:8080/oauth2/callback/naver'; // http://localhost.test:3000/login
      // const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const state = '123';
      const loginUrl = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

      window.open(loginUrl, '_blank', 'width=500,height=600');
    }
  },
}
</script>

<style scoped>
</style>

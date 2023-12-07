<template>
  <div class="signup-container">
    <div class="signup-content">
      <h1 class="signup-title">Signup with SpringSocial</h1>
      <div class="social-signup">
        <a class="btn btn-block social-btn google" :href="GOOGLE_AUTH_URL">Sign up with Google</a>
        <a class="btn btn-block social-btn facebook" :href="FACEBOOK_AUTH_URL">Sign up with Facebook</a>
        <a class="btn btn-block social-btn github" :href="GITHUB_AUTH_URL">Sign up with Github</a>
      </div>
      <div class="or-separator">
        <span class="or-text">OR</span>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-item">
          <input type="text" name="name" v-model="name" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-item">
          <input type="email" name="email" v-model="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-item">
          <input type="password" name="password" v-model="password" class="form-control" placeholder="Password" required/>
        </div>
        <div class="form-item">
          <button type="submit" class="btn btn-block btn-primary">Sign Up</button>
        </div>
      </form>
      <span class="login-link">Already have an account? <router-link to="/login">Login!</router-link></span>
    </div>
  </div>
</template>

<script>
import {GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL} from "../scripts";
import {reactive} from "vue";
import axios from "axios";
import router from "@/scripts/router";
import store from "@/scripts/store";

export default {
  name: 'Signup',
  data() {
    return {
      GOOGLE_AUTH_URL,
      FACEBOOK_AUTH_URL,
      GITHUB_AUTH_URL,
      name: '',
      email: '',
      password: ''
    };
  },
  setup() {
    const state = reactive({
      form: {
        name: '',
        email: '',
      }
    })
    const submit = () => {
      axios.post("/auth/signup", state.form).then((response) => {
        store.commit('setAccountId', response.data);
        router.push({path: "/"});
        window.alert("You're successfully registered. Please login to continue!");
      }).catch ((error) => {
        window.alert((error && error.message) || 'Oops! Something went wrong. Please try again!');
      });
    }

    return {state, submit};
  },
  beforeMount() {
    if (store.state.authenticated) {
      router.push('/');
    }
  }
};
</script>

<style scoped>
.signup-container {
  text-align: center;
}

.signup-content {
  background: #fff;
  box-shadow: 0 1px 11px rgba(0, 0, 0, 0.27);
  border-radius: 2px;
  width: 500px;
  display: inline-block;
  margin-top: 30px;
  vertical-align: middle;
  position: relative;
  padding: 35px;
}

.social-btn {
  margin-bottom: 15px;
  font-weight: 400;
  font-size: 16px;
}

.social-btn img {
  height: 32px;
  float: left;
  margin-top: 10px;
}

.social-btn.google {
  margin-top: 7px;
}

.social-btn.facebook img {
  height: 24px;
  margin-left: 3px;
}

.social-btn.github img {
  height: 24px;
  margin-left: 3px;
}

.login-link {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.signup-title {
  font-size: 1.5em;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.65);
}
</style>

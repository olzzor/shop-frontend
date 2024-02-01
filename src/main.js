import {createApp} from 'vue'
import App from './App.vue'
import store from "@/scripts/store"
import router from "@/scripts/router"
// import CKEditor from '@ckeditor/ckeditor5-vue'
import axios from "axios"

import 'bootstrap-icons/font/bootstrap-icons.css';

// axios.defaults.baseURL = 'http://localhost.test:8080';
axios.defaults.baseURL = 'http://bridgeshop.kro.kr:8080';
axios.defaults.withCredentials = true;

createApp(App)
    .use(store)
    .use(router)
    // .use(CKEditor)
    .mount('#app');

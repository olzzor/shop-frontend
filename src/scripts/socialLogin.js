import {useRoute} from 'vue-router';
import {syncLocalStorageWithDB} from "@/scripts/localStorage";
import axios from "axios";
import router from "@/scripts/router";
import store from "@/scripts/store";

export default function useSocialLogin() {
    const route = useRoute();  // useRoute 훅을 사용합니다.

    function doSocialLogin(socialType) {
        const apiPath = '/api/user/social-login';
        const bodyData = {
            code: route.query.code,
            authProvider: socialType
        };

        axios.post(apiPath, bodyData).then(({data}) => {
            store.commit('setAccountId', data.id);
            store.commit('setAccountRole', data.role);

            syncLocalStorageWithDB();
            window.alert('로그인하였습니다.');

            // 리디렉션 처리
            const redirectPath = sessionStorage.getItem('redirectPath');
            sessionStorage.removeItem('redirectPath');
            router.push({path: redirectPath});

            // const originPath = window.location.origin;

            // window.opener.postMessage({
            //     type: 'socialLoginSuccess',
            //     userId: data.id,
            //     userRole: data.role
            // }, originPath);

            // window.close();

        }).catch(() => {
            window.alert('로그인에 실패하였습니다. 다시 시도해주세요.');
            router.push({name: 'Login'});
        });
    }

    return {
        doSocialLogin
    }
}
import {useRoute} from 'vue-router';
import axios from "axios";
import router from "@/scripts/router";
import store from "@/scripts/store";
import {syncLocalStorageWithDB} from "@/scripts/localStorage";

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
            window.alert("로그인하였습니다.");

            // 리다이렉션 처리 (기본적으로 홈 페이지로 리다이렉트하되, 세션 스토리지에 저장된 경로가 있으면 해당 경로로 리다이렉트)
            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            sessionStorage.removeItem('redirectPath');
            router.push({path: redirectPath});

            // const originPath = window.location.origin;

            // window.opener.postMessage({
            //     type: 'socialLoginSuccess',
            //     userId: data.id,
            //     userRole: data.role
            // }, originPath);

            // window.close();

        }).catch(error => {
            window.alert("로그인에 실패하였습니다. 다시 시도해주세요.");
            console.log('error', error);
        });
    }

    return {
        doSocialLogin
    }
}
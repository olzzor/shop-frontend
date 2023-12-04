import {useRoute} from 'vue-router';
import axios from "axios";

export default function useSocialLogin() {
    const route = useRoute();  // useRoute 훅을 사용합니다.

    const loginResult = {
        status: ''
    }

    function doSocialLogin(socialType) {
        const apiPath = '/api/user/social-login';
        const bodyData = {
            code: route.query.code,
            authProvider: socialType
        };

        axios.post(apiPath, bodyData).then(({data}) => {
            loginResult.status = 'SUCCESS';

            const originPath = window.location.origin;

            window.opener.postMessage({
                type: 'socialLoginSuccess',
                userId: data.id,
                userRole: data.role
            }, originPath);

            window.close();

            // cookie.setCookie('user-key', response.data.id);
            // window.opener.location.replace('/');
        }).catch(error => {
            loginResult.status = 'FAIL';
            console.log('error', error);
        });
    }

    return {
        loginResult,
        doSocialLogin
    }
}
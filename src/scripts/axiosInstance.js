import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
});

export default instance;

let requestCounter = 0;

// 추후 로딩 스피너 구현시 사용할 것
export function getIsSubmitting() {
    return requestCounter > 0;
}

instance.interceptors.request.use(
    (config) => {
        requestCounter++;  // 요청이 시작될 때마다 카운터 증가
        return config;
    },
    (error) => {
        if (requestCounter > 0) requestCounter--;  // 에러 시 카운터 감소
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        if (requestCounter > 0) requestCounter--;  // 응답 받으면 카운터 감소
        return response;
    },
    (error) => {
        if (requestCounter > 0) requestCounter--;  // 에러 시 카운터 감소
        if (error.response) {
            switch (error.response.status) {
                case 400:
                case 401:
                case 404:
                case 409:
                    window.alert(error.response.data.message);
                    break;
                default:
                    window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
        return Promise.reject(error);
    }
);

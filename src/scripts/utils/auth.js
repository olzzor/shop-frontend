import axios from 'axios';

export function checkAdminRoleFromServer() {
    return axios.get("/api/user/check-admin-role").then(({data}) => {
        return data;
    }).catch((error) => {
        console.error('Error during admin role check', error);
        return false; // 오류 발생 시 false 반환
    });
}

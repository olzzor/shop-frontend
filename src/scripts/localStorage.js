import axios from "axios";

// 로컬 스토리지의 recentlyViewedProducts 를 DB에 삽입하는 함수
export const syncLocalStorageWithDB = () => {
    const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

    if (recentlyViewedProducts.length > 0) {
        axios.post("/api/recently-viewed-product/sync", recentlyViewedProducts).then(() => {
            // 성공적으로 DB에 저장되면 로컬 스토리지에서 제거
            localStorage.removeItem('recentlyViewedProducts');

        }).catch(error => {
            if (error.response) {
                switch (error.response.status) {
                    case 401: // UNAUTHORIZED
                        window.alert(error.response.data.message);
                        break;
                    case 404: // NOT_FOUND
                        window.alert(error.response.data.message);
                        break;
                    default:
                        window.alert("오류가 발생했습니다. 다시 시도해주세요.");
                }
            } else {
                window.alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
        });
    }
};
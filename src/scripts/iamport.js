export const PGS = [
    // {value: 'naverpay', label: '네이버페이', logo: ''},
    {value: 'kakaopay', label: '카카오페이', logo: '/img/icons/kakaopay.png'}, // pay_method 무시
    {value: 'tosspay', label: '토스페이', logo: '/img/icons/tosspay.png'}, // tosstest: 테스트모드, tosspay: 상용모드. pay_method: 'card' or 'trans'
    {value: 'payco', label: '페이코', logo: '/img/icons/payco.png'}, // pay_method 무시
    {value: 'uplus', label: '신용카드', logo: ''}, // 토스페이먼츠
];
export const METHODS_FOR_UPLUS = [
    {value: 'card', label: '신용카드'},
    {value: 'trans', label: '실시간 계좌이체'},
    {value: 'vbank', label: '가상계좌'},
    {value: 'phone', label: '휴대폰 소액결제'},
];
export const METHOD_FOR_CARD = [{value: 'card', label: '신용카드'}];

export default {
    getUserCodeByPg(pg) {
        switch (pg) {
            // case 'kakao': // PG마다 다른 식별코드를 가질 때 설정할 것
            //     return 'imp10391932';
            default:
                return 'imp13050435';
        }
    },

    getMethodsByPg(pg = 'uplus') {
        switch (pg) {
            case 'uplus':
                return METHODS_FOR_UPLUS;
            case 'naverpay':
            case 'kakaopay':
            case 'tosspay':
            case 'payco':
                return METHOD_FOR_CARD;
            default:
                return METHODS_FOR_UPLUS;
        }
    },
}
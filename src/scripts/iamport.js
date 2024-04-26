export const PAYMENT_METHODS = [
    // {value: 'kakaopay', method:'card', label: '카카오페이', logo: '/img/icons/kakaopay.png'}, // pay_method 무시
    // {value: 'tosspay', method:'card', label: '토스페이', logo: '/img/icons/tosspay.png'}, // tosstest: 테스트모드, tosspay: 상용모드. pay_method: 'card' or 'trans'
    // {value: 'payco', method:'card', label: '페이코', logo: '/img/icons/payco.png'}, // pay_method 무시
    // {value: 'uplus', label: '신용카드', logo: ''}, // 토스페이먼츠(구)

    {id: 1, pg: 'tosspayments', pay_method: 'card', label: '신용카드', logo: ''},
    // {id: 2, pg: 'tosspayments', pay_method: 'samsung', label: '삼성페이', logo: ''},
    {id: 3, pg: 'tosspayments', pay_method: 'kakaopay', label: '카카오페이', logo: '/img/icons/kakaopay.png'},
    // {id: 4, pg: 'tosspayments', pay_method: 'naverpay', label: '네이버페이', logo: ''},
    {id: 5, pg: 'tosspayments', pay_method: 'tosspay', label: '토스페이', logo: '/img/icons/tosspay.png'},
    {id: 6, pg: 'tosspayments', pay_method: 'payco', label: '페이코', logo: '/img/icons/payco.png'},
    {id: 7, pg: 'tosspayments', pay_method: 'vbank', label: '가상계좌', logo: ''},
    {id: 8, pg: 'tosspayments', pay_method: 'trans', label: '계좌이체', logo: ''},
];

// export const PAYMENT_METHODS = new Map([
//     [1, { pg: 'tosspayments', pay_method: 'card', label: '신용카드', logo: '' }],
//     [2, { pg: 'tosspayments', pay_method: 'samsung', label: '삼성페이', logo: '' }],
//     [3, { pg: 'tosspayments', pay_method: 'kakaopay', label: '카카오페이', logo: '/img/icons/kakaopay.png'}],
//     [4, { pg: 'tosspayments', pay_method: 'naverpay', label: '네이버페이', logo: ''}],
//     [5, { pg: 'tosspayments', pay_method: 'tosspay', label: '토스페이', logo: '/img/icons/tosspay.png'}],
//     [6, { pg: 'tosspayments', pay_method: 'payco', label: '페이코', logo: '/img/icons/payco.png'}],
//     [7, { pg: 'tosspayments', pay_method: 'vbank', label: '가상계좌', logo: ''}],
//     [8, { pg: 'tosspayments', pay_method: 'trans', label: '계좌이체', logo: ''}],
// ]);

export default {
    getUserCodeByPg(pg) {
        switch (pg) {
            case 'tosspayments':    // 토스페이먼츠(신모듈)
                return 'imp13050435';
            default:
                return 'imp13050435';
        }
    },
}
export default {
    CATEGORIES: [
        {code:'100', name: 'OUTER', slug: 'outer'},
        {code:'200', name: 'TOP', slug: 'top',
            subCategories: [
                {code:'201', name: 'KNITWEAR', slug: 'knitwear'},
                {code:'202', name: 'SHIRTS', slug: 'shirts'},
                {code:'203', name: 'POLO SHIRTS', slug: 'polo-shirts'},
                {code:'204', name: 'LONG SLEAVE', slug: 'long-sleave'},
                {code:'205', name: 'HALF SLEAVE', slug: 'half-sleave'},
                {code:'206', name: 'VEST', slug: 'vest'},
            ]
        },
        {code:'300', name: 'BOTTOM', slug: 'bottom',
            subCategories: [
                {code:'301', name: 'DENIM', slug: 'denim'},
                {code:'302', name: 'PANTS', slug: 'pants'},
                {code:'303', name: 'SHORTS', slug: 'shorts'},
            ]
        },
        {code:'400', name: 'ACCESSORIES', slug: 'accessories',
            subCategories: [
                {code:'401', name: 'CAP', slug: 'cap'},
                {code:'402', name: 'BAG', slug: 'bag'},
                {code:'403', name: 'TIE', slug: 'tie'},
                {code:'404', name: 'SHOES', slug: 'shoes'},
                {code:'405', name: 'MUFFLER', slug: 'muffler'},
                {code:'406', name: 'ETC', slug: 'acc-etc'},
            ]
        },
        {code:'500', name: 'R.R.L COLLECTION', slug: 'rrl-collection',
            subCategories: [
                {code:'501', name: 'POLO RALPH LAUREN', slug: 'polo-ralph-lauren'},
                {code:'502', name: 'R.R.L', slug: 'rrl'},
                {code:'503', name: 'ETC', slug: 'rrl-etc'},
            ]
        },
    ],

    AUTH_PROVIDERS: [
        {key: 'LOCAL', description: 'local'},
        {key: 'NAVER', description: 'naver'},
        {key: 'KAKAO', description: 'kakao'},
        {key: 'GOOGLE', description: 'google'},
        {key: 'FACEBOOK', description: 'facebook'},
    ],

    COURIER_COMPANIES: [
        {key: 'CJ_LOGISTICS', description: 'CJ 대한통운'},
        {key: 'LOTTE', description: '롯데 택배'},
        {key: 'KOREA_POST', description: '우체국 택배'},
        {key: 'LOGEN', description: '로젠 택배'},
        {key: 'HANJIN', description: '한진 택배'},
        {key: 'CU', description: 'CU 편의점 택배'},
        {key: 'KYUNG_DONG', description: '경동 택배'},
        {key: 'GS_POSTBOX', description: 'GS 편의점 택배'},
        {key: 'OTHER', description: '기타'},
    ],

    /** TYPE */
    DISCOUNT_TYPES: [
        {key: 'AMOUNT_DISCOUNT', description: '금액 할인'},
        {key: 'PERCENTAGE_DISCOUNT', description: '비율 할인'}
    ],

    CONTACT_TYPES: [
        {key: 'SHIPPING', description: '배송'},
        {key: 'ORDER_PAYMENT', description: '주문/결제'},
        {key: 'PRODUCT_INFO', description: '상품 정보'},
        {key: 'EXCHANGE_RETURN_REFUND', description: '교환/반품/환불'},
        {key: 'PRICE_PROMOTION', description: '가격/프로모션'},
        {key: 'PRIVACY', description: '개인 정보'},
        {key: 'PARTNERSHIP', description: '제휴/협력'},
        {key: 'OTHER', description: '기타'}
    ],

    COUPON_TYPES: [
        {key: 'PERCENTAGE_DISCOUNT', description: '비율 할인'},
        {key: 'AMOUNT_DISCOUNT', description: '금액 할인'},
        {key: 'SIGN_UP_DISCOUNT', description: '신규 할인'},
        {key: 'USER_DISCOUNT', description: '특정 고객 할인'},
        {key: 'FREE_SHIPPING', description: '무료 배송'},
        {key: 'SEASONAL_EVENT_COUPON', description: '시즌 이벤트'}
    ],

    NOTICE_TYPES: [
        {key: 'INFORMATION', description: '정보'},
        {key: 'COMMUNITY', description: '커뮤니티'},
        {key: 'PROMOTION', description: '프로모션'},
        {key: 'MAINTENANCE', description: '유지보수'},
        {key: 'ALERT', description: '긴급'},
    ],

    /** STATUS */
    PRODUCT_STATUSES: [
        {key: 'ON_SALE', description: '판매 중'},
        {key: 'TEMP_OUT_OF_STOCK', description: '일시 품절'},
        {key: 'OUT_OF_STOCK', description: '품절'},
    ],

    ORDER_STATUSES: [
        {key: 'PAYMENT_PENDING', description: '결제 대기'},
        {key: 'PAYMENT_COMPLETED', description: '결제 완료'},
        // {key: 'ORDER_RECEIVED', description: '주문 접수'},
        // {key: 'ORDER_CONFIRMED', description: '주문 확인'},
        // {key: 'ORDER_FINALIZED', description: '주문 확정'},
        // {key: 'SHIPMENT_PREPARING', description: '배송 준비'},
        {key: 'CANCEL_REQUESTED', description: '취소 요청'},
        {key: 'CANCEL_COMPLETED', description: '취소 완료'},
    ],

    SHIPMENT_STATUSES: [
        {key: 'PREPARING', description: '발송 준비 중'},
        {key: 'PROCESSING', description: '발송 처리 중'},
        {key: 'SHIPPED', description: '발송 완료'},
        {key: 'DELIVERING', description: '배달 중'},
        {key: 'DELIVERED', description: '배달 완료'},
        // {key: 'ACCEPTED', description: '주문 접수'},
        // {key: 'PREPARING', description: '배송 준비'},
        // {key: 'SHIPPING', description: '배송 중'},
        // {key: 'DELIVERED', description: '배송 완료'},
        // {key: 'CANCELED', description: '주문 취소'},
    ],

    CONTACT_STATUSES: [
        {key: 'UNANSWERED', description: '답변 대기'},
        {key: 'ANSWERED', description: '답변 완료'},
        {key: 'CLOSED', description: '만료'},
    ],

    COUPON_STATUSES: [
        {key: 'NEW', description: '발급 대기'},
        {key: 'ACTIVE', description: '사용 가능'},
        {key: 'USED', description: '사용 완료'},
        {key: 'EXPIRED', description: '유효 기간 만료'},
        {key: 'DEACTIVATED', description: '사용 중지'},
    ],

    NOTICE_STATUSES: [
        {key: 'ACTIVE', description: '활성'},
        {key: 'INACTIVE', description: '비활성'},
        {key: 'EXPIRED', description: '만료'},
        {key: 'DELETED', description: '삭제'},
    ],
    // NOTICE_STATUSES: {
    //     ACTIVE: '활성',
    //     INACTIVE: '비활성',
    //     EXPIRED: '만료',
    //     DELETED: '삭제',
    // }
}
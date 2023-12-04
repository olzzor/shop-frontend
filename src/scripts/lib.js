import dayjs from 'dayjs';
import {marked} from "marked";

export default {
    authProviders: ['LOCAL', 'NAVER', 'KAKAO', 'GOOGLE'],
    categoryCodes: ['tops', 'shirts', 'sweats', 'knits', 'pants', 'jeans', 'skirts', 'outer', 'headwear', 'footwear', 'accessories'],
    courierCompanies: ['CJ_LOGISTICS', 'LOTTE', 'KOREA_POST', 'LOGEN', 'HANJIN', 'CU', 'KYUNG_DONG', 'GS_POSTBOX', 'OTHER'],

    discountTypes: ['AMOUNT_DISCOUNT', 'PERCENTAGE_DISCOUNT'],
    contactTypes: ['SHIPPING', 'ORDER_PAYMENT', 'PRODUCT_INFO', 'EXCHANGE_RETURN_REFUND', 'PRICE_PROMOTION', 'PRIVACY', 'PARTNERSHIP', 'OTHER'],
    couponTypes: ['PERCENTAGE_DISCOUNT', 'AMOUNT_DISCOUNT', 'SIGN_UP_DISCOUNT', 'USER_DISCOUNT', 'FREE_SHIPPING', 'SEASONAL_EVENT_COUPON'],
    noticeTypes: ['INFORMATION', 'COMMUNITY', 'PROMOTION', 'MAINTENANCE', 'ALERT'],

    productStatuses: ['ON_SALE', 'TEMP_OUT_OF_STOCK', 'OUT_OF_STOCK'],
    orderStatuses: ['ORDER_RECEIVED', 'ORDER_CONFIRMED', 'ORDER_FINALIZED', 'SHIPMENT_PREPARING', 'CANCEL_REQUESTED', 'CANCEL_COMPLETED'],
    shipmentStatuses: ['ACCEPTED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELED'],
    contactStatuses: ['UNANSWERED', 'ANSWERED', 'CLOSED'],
    couponStatuses: ['NEW', 'ACTIVE', 'USED', 'EXPIRED', 'DEACTIVATED'],
    noticeStatuses: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED'],

    getFormattedNumber(price) {
        if (price == null) {
            return 0;
        } else {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },

    getFormattedDate(dateString, format) {
        return dayjs(dateString).format(format);
    },

    getCategoryName(key) {
        switch (key) {
            case 'all':
                return 'ALL';
            case 'tops':
                return 'TOPS';
            case 'shirts':
                return 'SHIRTS';
            case 'sweats':
                return 'SWEATS';
            case 'knits':
                return 'KNITS';
            case 'pants':
                return 'PANTS';
            case 'jeans':
                return 'JEANS';
            case 'skirts':
                return 'SKIRTS';
            case 'outer':
                return 'OUTER';
            case 'headwear':
                return 'HEADWEAR';
            case 'footwear':
                return 'FOOTWEAR';
            case 'accessories':
                return 'ACCESSORIES';
            default:
                return key;
        }
    },

    getCourierCompanyName(type) {
        switch (type) {
            case 'CJ_LOGISTICS':
                return 'CJ 대한통운';
            case 'LOTTE':
                return '롯데 택배';
            case 'KOREA_POST':
                return '우체국 택배';
            case 'LOGEN':
                return '로젠 택배';
            case 'HANJIN':
                return '한진 택배';
            case 'CU':
                return 'CU 편의점';
            case 'KYUNG_DONG':
                return '경동 택배';
            case 'GS_POSTBOX':
                return 'GS 포스트박스';
            case 'OTHER':
                return '기타';
            default:
                return type;
        }
    },

    getDiscountTypeName(type) {
        switch (type) {
            case 'AMOUNT_DISCOUNT':
                return '금액 할인';
            case 'PERCENTAGE_DISCOUNT':
                return '비율 할인';
            default:
                return type;
        }
    },

    getPeriodTypeName(key) {
        switch (key) {
            case 'day':
                return '일';
            case 'week':
                return '주';
            case 'month':
                return '월';
            case 'year':
                return '년';
            default:
                return key;
        }
    },

    getCouponTypeName(type) {
        switch (type) {
            case 'PERCENTAGE_DISCOUNT':
                return '비율 할인';
            case 'AMOUNT_DISCOUNT':
                return '금액 할인';
            case 'SIGN_UP_DISCOUNT':
                return '신규 할인';
            case 'USER_DISCOUNT':
                return '특정 고객 할인';
            case 'FREE_SHIPPING':
                return '무료 배송';
            case 'SEASONAL_EVENT_COUPON':
                return '시즌 이벤트';
            default:
                return type;
        }
    },

    getContactTypeName(type) {
        switch (type) {
            case 'SHIPPING':
                return '배송';
            case 'ORDER_PAYMENT':
                return '주문/결제';
            case 'PRODUCT_INFO':
                return '상품 정보';
            case 'EXCHANGE_RETURN_REFUND':
                return '교환/반품/환불';
            case 'PRICE_PROMOTION':
                return '가격/프로모션';
            case 'PRIVACY':
                return '개인 정보';
            case 'PARTNERSHIP':
                return '제휴/협력';
            case 'OTHER':
                return '기타';
            default:
                return type;
        }
    },

    getOrderStatusName(status) {
        switch (status) {
            case 'ORDER_RECEIVED':
                return '주문 접수';
            case 'ORDER_CONFIRMED':
                return '주문 확인';
            case 'ORDER_FINALIZED':
                return '주문 확정';
            case 'SHIPMENT_PREPARING':
                return '배송 준비';
            case 'CANCEL_REQUESTED':
                return '취소 요청';
            case 'CANCEL_COMPLETED':
                return '취소 완료';
            default:
                return status;
        }
    },

    getShipmentStatusName(status) {
        switch (status) {
            case 'ACCEPTED':
                return '배송 접수';
            case 'PREPARING':
                return '배송 준비';
            case 'SHIPPING':
                return '배송 중';
            case 'DELIVERED':
                return '배송 완료';
            case 'CANCELED':
                return '배송 취소';
            default:
                return status;
        }
    },

    getContactStatusName(status) {
        switch (status) {
            case 'UNANSWERED':
                return '답변 대기';
            case 'ANSWERED':
                return '답변 완료';
            case 'CLOSED':
                return '문의 완료';
            default:
                return status;
        }
    },

    getProductStatusName(status) {
        switch (status) {
            case 'ALL':
                return '전체';
            case 'ON_SALE':
                return '판매 중';
            case 'TEMP_OUT_OF_STOCK':
                return '일시 품절';
            case 'OUT_OF_STOCK':
                return '품절';
            default:
                return status;
        }
    },

    getCouponStatusName(status) {
        switch (status) {
            case 'NEW':
                return '발급 대기';
            case 'ACTIVE':
                return '사용 가능';
            case 'USED':
                return '사용 완료';
            case 'EXPIRED':
                return '유효 기간 만료';
            case 'DEACTIVATED':
                return '사용 중지';
            default:
                return status;
        }
    },

    getNoticeStatusName(status) {
        switch (status) {
            case 'ACTIVE':
                return '활성';
            case 'INACTIVE':
                return '비활성';
            case 'EXPIRED':
                return '만료';
            case 'DELETED':
                return '삭제';
            default:
                return status;
        }
    },

    convertLineBreaks(str) {
        return str ? str.replace(/\n/g, '<br>') : '';
    },
    convertSpaces(str) {
        return str ? str.replace(/\n/g, '&nbsp;') : '';
    },
    convertMarkdownToHtml(markdownText) {
        return markdownText ? marked(markdownText) : '';
    },
}
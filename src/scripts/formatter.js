import {marked} from "marked";
import dayjs from "dayjs";
import constants from "@/scripts/constants";

export default {
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

    getFlattenCategories() {
        const flattened = [];

        constants.CATEGORIES.forEach((cat) => {
            // 메인 카테고리 추가
            flattened.push({ code: cat.code, name: cat.name, slug: cat.slug });

            // 서브 카테고리가 있으면 추가
            if (cat.subCategories && cat.subCategories.length > 0) {
                cat.subCategories.forEach((subCat) => {
                    flattened.push({ code: subCat.code , name: subCat.name, slug: subCat.slug }); // └ 삭제
                });
            }
        });

        return flattened;
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

    /** 택배사 이름을 가져오는 함수 */
    getCourierCompanyName(company) {
        const courierCompany = constants.COURIER_COMPANIES.find(cc => cc.key === company);
        return courierCompany ? courierCompany.description : courierCompany;
    },

    /** 할인 구분 이름을 가져오는 함수 */
    getDiscountTypeName(type) {
        const discountType = constants.DISCOUNT_TYPES.find(dt => dt.key === type);
        return discountType ? discountType.description : discountType;
    },

    /** 문의 구분 이름을 가져오는 함수 */
    getContactTypeName(type) {
        const contactType = constants.CONTACT_TYPES.find(ct => ct.key === type);
        return contactType ? contactType.description : contactType;
    },

    /** 쿠폰 구분 이름을 가져오는 함수 */
    getCouponTypeName(type) {
        const couponType = constants.COUPON_TYPES.find(ct => ct.key === type);
        return couponType ? couponType.description : couponType;
    },

    /** 공지 구분 이름을 가져오는 함수 */
    getNoticeTypeName(type) {
        const noticeType = constants.NOTICE_TYPES.find(nt => nt.key === type);
        return noticeType ? noticeType.description : noticeType;
    },

    /** 상품 상태 이름을 가져오는 함수 */
    getProductStatusName(status) {
        const productStatus = constants.PRODUCT_STATUSES.find(ps => ps.key === status);
        return productStatus ? productStatus.description : productStatus;
    },

    /** 주문 상태 이름을 가져오는 함수 */
    getOrderStatusName(status) {
        const orderStatus = constants.ORDER_STATUSES.find(os => os.key === status);
        return orderStatus ? orderStatus.description : orderStatus;
    },

    /** 배송 상태 이름을 가져오는 함수 */
    getShipmentStatusName(status) {
        const shipmentStatus = constants.SHIPMENT_STATUSES.find(ss => ss.key === status);
        return shipmentStatus ? shipmentStatus.description : shipmentStatus;
    },

    /** 문의 상태 이름을 가져오는 함수 */
    getContactStatusName(status) {
        const contactStatus = constants.CONTACT_STATUSES.find(cs => cs.key === status);
        return contactStatus ? contactStatus.description : contactStatus;
    },

    /** 쿠폰 상태 이름을 가져오는 함수 */
    getCouponStatusName(status) {
        const couponStatus = constants.COUPON_STATUSES.find(cs => cs.key === status);
        return couponStatus ? couponStatus.description : couponStatus;
    },

    /** 공지 상태 이름을 가져오는 함수 */
    getNoticeStatusName(status) {
        const noticeStatus = constants.NOTICE_STATUSES.find(cs => cs.key === status);
        return noticeStatus ? noticeStatus.description : noticeStatus;
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
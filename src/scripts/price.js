export default {
    // 상품의 할인 금액
    getDiscountPrice(product) {
        let discountPrice = 0;

        // discountPer 가 있으면 할인을 적용
        if (product.discountPer) {
            discountPrice = (product.price * product.discountPer / 100);
        }

        return discountPrice;
    },

    // 상품의 할인 적용 후 금액
    getDiscountedPrice(product) {
        const originPrice = product.price;
        const discountPrice = this.getDiscountPrice(product);

        return originPrice - discountPrice;
    },

    // 상품의 쿠폰 할인 금액
    getCouponPrice(cartProduct) {
        if (!cartProduct.selectedCoupon) {
            return 0;
        }

        let couponPrice = 0;

        // 선택 쿠폰 객체 취득
        const coupon = cartProduct.availableCoupons.find(ac => ac.id === cartProduct.selectedCoupon);

        if (coupon) { // 추가
            if (coupon.discountType === "AMOUNT_DISCOUNT") {
                couponPrice = coupon.discountValue;

            } else if (coupon.discountType === "PERCENTAGE_DISCOUNT") {
                couponPrice = this.getDiscountedPrice(cartProduct.product) * (coupon.discountValue / 100);
            }
        }

        return couponPrice;
    },

    // 상품의 쿠폰 할인 적용 후 금액
    getDiscountedPriceCouponApplied(cartProduct) {
        const discountedPrice = this.getDiscountedPrice(cartProduct.product);
        const couponPrice = this.getCouponPrice(cartProduct);

        return discountedPrice - couponPrice;
    },

    // 상품의 최종 할인 금액
    getFinalDiscountPrice(cartProduct) {
        const discountPrice = this.getDiscountPrice(cartProduct.product);
        const couponPrice = this.getCouponPrice(cartProduct);

        return discountPrice + couponPrice;
    },

    // 상품의 최종 할인 적용 후 금액
    getFinalDiscountedPrice(cartProduct) {
        const originalPrice = cartProduct.product.price;
        const discountPrice = this.getDiscountPrice(cartProduct.product);
        const couponPrice = this.getCouponPrice(cartProduct);

        return originalPrice - discountPrice - couponPrice;
    },

    // 총 결제 금액
    calculateSubtotal(cartProduct) {
        const productTotal = this.getDiscountedPrice(cartProduct.product) * cartProduct.quantity;
        return productTotal - this.getCouponPrice(cartProduct);
    },
}
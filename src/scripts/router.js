import {createRouter, createWebHistory} from "vue-router/dist/vue-router";
import {checkAdminRoleFromServer} from "@/scripts/utils/auth";
import testDaumAPI from "@/components/bk/TestDaumAPI.vue";

const defaultRoutes = [
    {path: '/', name: 'Home', component: () => import('@/components/modules/home/Home.vue')},
    {path: '/products-category/:cat', name: 'Products', component: () => import('@/components/modules/home/Home.vue')},
    {path: '/product/:id', name: 'ProductDetail', component: () => import('@/components/modules/product/ProductDetail.vue')},
    {path: '/cart', name: 'Cart', component: () => import('@/components/modules/cart/Cart.vue')},
    {path: '/order', name: 'Order', component: () => import('@/components/modules/order/Order.vue')},
    {path: '/order/redirect/iamport', name: 'OrderRedirectIamport', component: () => import('@/components/modules/order/OrderRedirectIamport.vue')},
    {path: '/wishlist', name: 'Wishlist', component: () => import('@/components/modules/wishlist/Wishlist.vue')},
    {path: '/recently-viewed-products', name: 'ProductsRecentlyViewed', component: () => import('@/components/modules/product/ProductsRecentlyViewed.vue')},
    {path: '/sign-up', name: 'SignUp', component: () => import('@/components/modules/account/SignUp.vue')},

    {path: '/notice/:id', name: 'NoticeDetail', component: () => import('@/components/modules/notice/NoticeDetail.vue')},
    {path: '/notices-category/:cat', name: 'Notices', component: () => import('@/components/modules/notice/Notices.vue')},

    {path: '/login', name: 'Login', component: () => import('@/components/modules/login/Login.vue')},
    {path: '/login/find-password', name: 'LoginPasswordFind', component: () => import('@/components/modules/login/LoginPasswordFind.vue')},
    {path: '/social-login', name: 'LoginSocial', component: () => import('@/components/modules/login/LoginSocial.vue')},

    // {path: '/member', name: 'Member', component: () => import('@/pages/BkMember.vue')},
    // {path: '/customer/my-account', name: 'MyAccount', component: () => import('@/components/account/BkMyAccount.vue')},

    {path: '/member/contact-history', name: 'ContactHistory', component: () => import('@/components/modules/contact/ContactHistory.vue')},
    {path: '/member/order-history', name: 'OrderHistory', component: () => import('@/components/modules/order/OrderHistory.vue')},
    {path: '/member/coupon-list', name: 'MyCouponList', component: () => import('@/components/modules/coupon/CouponList.vue')},
    {path: '/member/edit-profile', name: 'ProfileEdit', component: () => import('@/components/modules/account/ProfileEdit.vue')},
    {path: '/member/edit-address', name: 'AddressEdit', component: () => import('@/components/modules/account/AddressEdit.vue')},
    {path: '/member/change-password', name: 'ChangePassword', component: () => import('@/components/modules/account/PasswordChange.vue')},
    {path: '/member/reset-password/:token', name: 'ResetPassword', component: () => import('@/components/modules/account/PasswordReset.vue')},

    {path: '/customer/contact-detail/:id', name: 'ContactDetail', component: () => import('@/components/modules/contact/ContactDetail.vue')},
    {path: '/customer/order-detail/:id', name: 'OrderDetailForCustomer', component: () => import('@/components/modules/order/OrderDetail.vue')},

    // {path: '/customer/contact-us', name: 'ContactUs', component: () => import('@/components/modules/support/ContactUs.vue')},
    // {path: '/customer/support', name: 'CustomerSupport', component: () => import('@/components/modules/support/CustomerSupport.vue')},
    {path: '/support', name: 'Support', component: () => import('@/components/modules/support/Support.vue')},
    {path: '/support/FAQ', name: 'FrequentlyAskedQuestions', component: () => import('@/components/modules/support/FrequentlyAskedQuestions.vue')},
    {path: '/support/return-exchange', name: 'ReturnExchange', component: () => import('@/components/modules/support/ReturnExchange.vue')},

    {path: '/modal/search-product', name: 'SearchProductModal', component: () => import('@/components/modules/admin/coupon/SearchProductModal.vue')},
    {path: '/modal/search-user', name: 'SearchUserModal', component: () => import('@/components/modules/admin/coupon/SearchUserModal.vue')},
    {path: '/modal/notice', name: 'NoticeModal', component: () => import('@/components/modules/notice/NoticeModal.vue')},

    {path: '/review-write/:orderId/:orderDetailId', name: 'WriteReview', component: () => import('@/components/modules/review/ReviewWrite.vue')},
    {path: '/review-edit/:orderId/:reviewId', name: 'EditReview', component: () => import('@/components/modules/review/ReviewEdit.vue')},
    {path: '/reviews', name: 'Reviews', component: () => import('@/components/modules/review/Reviews.vue')},

    {path: '/test', component: testDaumAPI},

]

const adminRoutes = [
    {
        path: '/', name: 'Admin', component: () => import('@/components/modules/admin/Admin.vue'), meta: {requiresAuth: true, role: 'admin'},
        children: [
            {path: '/notice-regist', name: 'AdminNoticeRegist', component: () => import('@/components/modules/admin/notice/NoticeRegist.vue')},
            {path: '/notice-list', name: 'AdminNoticeList', component: () => import('@/components/modules/admin/notice/NoticeList.vue')},
            {path: '/notice-update/:id', name: 'AdminNoticeUpdate', component: () => import('@/components/modules/admin/notice/NoticeUpdate.vue')},
            {path: '/notice-content-update/:id', name: 'AdminNoticeContentUpdate', component: () => import('@/components/modules/admin/notice/NoticeContentUpdate.vue')},
            {path: '/order-list', name: 'AdminOrderList', component: () => import('@/components/modules/admin/order/OrderList.vue')},
            {path: '/order-update/:id', name: 'AdminOrderUpdate', component: () => import('@/components/modules/admin/order/OrderUpdate.vue')},
            {path: '/shipment-list', name: 'AdminShipmentList', component: () => import('@/components/modules/admin/shipment/ShipmentList.vue')},
            {path: '/user-list', name: 'AdminUserList', component: () => import('@/components/modules/admin/user/UserList.vue')},
            {path: '/review-list', name: 'AdminReviewList', component: () => import('@/components/modules/admin/review/ReviewList.vue')},
            {path: '/review-update/:id', name: 'AdminReviewUpdate', component: () => import('@/components/modules/admin/review/ReviewUpdate.vue')},
            {path: '/contact-list', name: 'AdminContactList', component: () => import('@/components/modules/admin/contact/ContactList.vue')},
            {path: '/contact-update/:id', name: 'AdminContactUpdate', component: () => import('@/components/modules/admin/contact/ContactUpdate.vue')},
            {path: '/product-regist', name: 'AdminProductRegist', component: () => import('@/components/modules/admin/product/ProductRegist.vue')},
            {path: '/product-list', name: 'AdminProductList', component: () => import('@/components/modules/admin/product/ProductList.vue')},
            {path: '/product-update/:id', name: 'AdminProductUpdate', component: () => import('@/components/modules/admin/product/ProductUpdate.vue')},
            {path: '/product-detail-content-update/:id', name: 'AdminProductDetailContentUpdate', component: () => import('@/components/modules/admin/product/ProductDetailContentUpdate.vue')},
            {path: '/recommended-product-list', name: 'AdminRecommendedProductList', component: () => import('@/components/modules/admin/recommended-product/RecommendedProductList.vue')},
            {path: '/coupon-regist', name: 'AdminCouponRegist', component: () => import('@/components/modules/admin/coupon/CouponRegist.vue')},
            {path: '/coupon-list', name: 'AdminCouponList', component: () => import('@/components/modules/admin/coupon/CouponList.vue')},
            {path: '/coupon-update/:id', name: 'AdminCouponUpdate', component: () => import('@/components/modules/admin/coupon/CouponUpdate.vue')},
            {path: '/stats-sales', name: 'AdminStatsSales', component: () => import('@/components/modules/admin/stats/StatsSales.vue')},
            {path: '/stats-sales-category', name: 'AdminStatsSalesCategory', component: () => import('@/components/modules/admin/stats/StatsSalesCategory.vue')},
        ],
    },
];

const USER_HOST = process.env.VUE_APP_USER_HOST;
const ADMIN_HOST_NAME = process.env.VUE_APP_ADMIN_HOST_NAME;

let routesToUse;

if (window.location.hostname === ADMIN_HOST_NAME) {
    routesToUse = adminRoutes;
} else {
    routesToUse = defaultRoutes;
}

const router = createRouter({
    history: createWebHistory(),
    routes: routesToUse,
    scrollBehavior() {
        // 라우트 전환 후 페이지의 스크롤 위치를 최상단으로 설정
        return {top: 0};
    }
});

/** 전역 가드 */
router.beforeEach(async (to, from, next) => {
    if (window.location.hostname === ADMIN_HOST_NAME) {
        // 서버에 인증 상태 확인 요청
        const isAdmin = await checkAdminRoleFromServer();
        // 인증 성공시, 어드민 페이지로 이동
        // 인증 실패시, 일반 사용자 페이지로 리다이렉션
        isAdmin ? next() : window.location.href = `http://${USER_HOST}`;
    } else { // 권한 확인이 필요 없는 경우는 진행
        next();
    }
});

export default router;
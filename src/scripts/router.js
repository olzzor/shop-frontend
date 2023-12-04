import {createRouter, createWebHistory} from "vue-router/dist/vue-router";
import {checkAdminRoleFromServer} from "@/scripts/util/auth";
import testDaumAPI from "@/pages/TestDaumAPI.vue";

const defaultRoutes = [
    {path: '/', name: 'Home', component: () => import('@/pages/Home.vue')},
    {path: '/products-category/:cat', name: 'Products', component: () => import('@/pages/Home.vue')},
    {path: '/product-detail/:id', name: 'ProductDetail', component: () => import('@/components/ProductDetail.vue')},
    {path: '/cart', name: 'Cart', component: () => import('@/pages/Cart.vue')},
    {path: '/order', name: 'Order', component: () => import('@/pages/Order.vue')},
    {path: '/favorite', name: 'Favorite', component: () => import('@/pages/Favorite.vue')},
    {path: '/recently-viewed-products', name: 'RecentlyViewedProducts', component: () => import('@/pages/RecentlyViewedProducts.vue')},
    {path: '/sign-up', name: 'SignUp', component: () => import('@/pages/SignUp.vue')},

    {path: '/notice/:id', name: 'NoticeDetail', component: () => import('@/components/NoticeDetail.vue')},
    {path: '/notices-category/:cat', name: 'Notices', component: () => import('@/components/account/Notices.vue')},

    {path: '/login', name: 'Login', component: () => import('@/pages/Login.vue')},
    {path: '/login/google', name: 'GoogleLogin', component: () => import('@/components/login/GoogleLogin.vue')},
    {path: '/login/kakao', name: 'KakaoLogin', component: () => import('@/components/login/KakaoLogin.vue')},
    {path: '/login/naver', name: 'NaverLogin', component: () => import('@/components/login/NaverLogin.vue')},
    {path: '/login/facebook', name: 'FacebookLogin', component: () => import('@/components/login/FacebookLogin.vue')},
    {path: '/login/find-password', name: 'FindPassword', component: () => import('@/pages/FindPassword.vue')},

    // {path: '/member', name: 'Member', component: () => import('@/pages/BkMember.vue')},
    // {path: '/customer/my-account', name: 'MyAccount', component: () => import('@/components/account/BkMyAccount.vue')},

    {path: '/member/contact-history', name: 'ContactHistory', component: () => import('@/components/account/ContactHistory.vue')},
    {path: '/member/order-history', name: 'OrderHistory', component: () => import('@/components/account/OrderHistory.vue')},
    {path: '/member/coupon-list', name: 'MyCouponList', component: () => import('@/components/account/CouponList.vue')},
    {path: '/member/edit-profile', name: 'EditProfile', component: () => import('@/components/account/EditProfile.vue')},
    {path: '/member/edit-address', name: 'EditAddress', component: () => import('@/components/account/EditAddress.vue')},
    {path: '/member/change-password', name: 'ChangePassword', component: () => import('@/components/account/ChangePassword.vue')},

    {path: '/customer/contact-detail/:id', name: 'ContactDetail', component: () => import('@/components/account/ContactDetail.vue')},
    {path: '/support', name: 'Support', component: () => import('@/components/account/Support.vue')},
    {path: '/customer/order-detail/:id', name: 'OrderDetailForCustomer', component: () => import('@/components/account/OrderDetail.vue')},

    {path: '/customer/contact-us', name: 'ContactUs', component: () => import('@/components/contact/ContactUs.vue')},
    {path: '/customer/support', name: 'CustomerSupport', component: () => import('@/pages/CustomerSupport.vue')},
    {path: '/customer/FAQ', name: 'FrequentlyAskedQuestions', component: () => import('@/pages/FrequentlyAskedQuestions.vue')},

    {path: '/modal/search-product', name: 'SearchProductModal', component: () => import('@/components/modal/SearchProductModal.vue')},
    {path: '/modal/search-user', name: 'SearchUserModal', component: () => import('@/components/modal/SearchUserModal.vue')},
    {path: '/modal/notice', name: 'NoticeModal', component: () => import('@/components/modal/NoticeModal.vue')},

    {path: '/review-write/:orderId', name: 'WriteReview', component: () => import('@/components/WriteReview.vue')},
    {path: '/review-edit/:reviewId', name: 'EditReview', component: () => import('@/components/EditReview.vue')},
    {path: '/reviews', name: 'OrderReviews', component: () => import('@/components/OrderReviews.vue')},

    {path: '/test', component: testDaumAPI},

]

const adminRoutes = [
    {
        path: '/', name: 'Admin', component: () => import('@/pages/Admin.vue'), meta: {requiresAuth: true, role: 'admin'},
        children: [
            {path: '/notice-regist', name: 'NoticeRegist', component: () => import('@/components/admin/NoticeRegist.vue')},
            {path: '/notice-list', name: 'NoticeList', component: () => import('@/components/admin/NoticeList.vue')},
            {path: '/notice-update/:id', name: 'NoticeUpdate', component: () => import('@/components/admin/NoticeUpdate.vue')},
            {path: '/notice-content-update/:id', name: 'NoticeContentUpdate', component: () => import('@/components/admin/NoticeContentUpdate.vue')},
            {path: '/order-list', name: 'OrderList', component: () => import('@/components/admin/OrderList.vue')},
            {path: '/order-update/:id', name: 'OrderUpdate', component: () => import('@/components/admin/OrderUpdate.vue')},
            {path: '/shipment-list', name: 'ShipmentList', component: () => import('@/components/admin/ShipmentList.vue')},
            {path: '/user-list', name: 'UserList', component: () => import('@/components/admin/UserList.vue')},
            {path: '/review-list', name: 'ReviewList', component: () => import('@/components/admin/ReviewList.vue')},
            {path: '/review-update/:id', name: 'ReviewUpdate', component: () => import('@/components/admin/ReviewUpdate.vue')},
            {path: '/contact-list', name: 'ContactList', component: () => import('@/components/admin/ContactList.vue')},
            {path: '/contact-update/:id', name: 'ContactUpdate', component: () => import('@/components/admin/ContactUpdate.vue')},
            {path: '/product-regist', name: 'ProductRegist', component: () => import('@/components/admin/ProductRegist.vue')},
            {path: '/product-list', name: 'ProductList', component: () => import('@/components/admin/ProductList.vue')},
            {path: '/product-update/:id', name: 'ProductUpdate', component: () => import('@/components/admin/ProductUpdate.vue')},
            {path: '/coupon-regist', name: 'CouponRegist', component: () => import('@/components/admin/CouponRegist.vue')},
            {path: '/coupon-list', name: 'CouponList', component: () => import('@/components/admin/CouponList.vue')},
            {path: '/coupon-update/:id', name: 'CouponUpdate', component: () => import('@/components/admin/CouponUpdate.vue')},
            {path: '/stats-sales', name: 'StatsSales', component: () => import('@/components/admin/StatsSales.vue')},
            {path: '/stats-sales-category', name: 'StatsSalesCategory', component: () => import('@/components/admin/StatsSalesCategory.vue')},
        ],
    },
];

const USER_HOST = 'localhost.test:3000';
const ADMIN_HOST_NAME = 'admin.localhost.test';

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
    if (window.location.hostname === ADMIN_HOST_NAME) { // 호스트네임이 admin.localhost.test인 경우에 권한 확인 로직 실행
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
import {createStore} from 'vuex';

const store = createStore({

    /** State: 애플리케이션의 상태(데이터)를 저장하는 객체 */
    state() {
        return {
            token: null,
            user: {id: 0, role:'', authProvider:''},
            searchResults: [],
            currentCategory: {code: 0, name:'', slug: ''},
            showLinks: {notices: false, orders: false, products: false, customers: false, promotions: false, stats: false},
            icons: {notices: 'bi bi-chevron-bar-down', orders: 'bi bi-chevron-bar-down', products: 'bi bi-chevron-bar-down', customers: 'bi bi-chevron-bar-down', promotions: 'bi bi-chevron-bar-down', stats: 'bi bi-chevron-bar-down'},
            cartProducts: [],
        }
    },

    /** Getters: state의 파생 상태를 가져오는 함수 */
    getters:{
        token(state) {return state.token;},

        userId(state) {return state.user.id;},
        userRole(state) {return state.user.role;},
        userAuthProvider(state) {return state.user.authProvider;},

        categoryCode(state) {return state.currentCategory.code;},
        categoryName(state) {return state.currentCategory.name;},
        categorySlug(state) {return state.currentCategory.slug;},

        showNoticeLink(state) {return state.showLinks.notices;},
        showOrderLink(state) {return state.showLinks.orders;},
        showProductLink(state) {return state.showLinks.products;},
        showCustomerLink(state) {return state.showLinks.customers;},
        showPromotionLink(state) {return state.showLinks.promotions;},
        showStatsLink(state) {return state.showLinks.stats;},

        classNoticeIcon(state) {return state.icons.notices;},
        classOrderIcon(state) {return state.icons.orders;},
        classProductIcon(state) {return state.icons.products;},
        classCustomerIcon(state) {return state.icons.customers;},
        classPromotionIcon(state) {return state.icons.promotions;},
        classStatsIcon(state) {return state.icons.stats;},

        cartProducts(state) {return state.cartProducts;},
    },

    /** Mutations: state 를 변경하는 함수 (동기적으로 동작) */
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUserInfo(state, userInfo) {
            state.user.id = userInfo.id;
            state.user.role = userInfo.role;
            state.user.authProvider = userInfo.authProvider;
        },
        setUserId(state, id) {
            state.user.id = id;
        },
        setUserRole(state, role) {
            state.user.role = role;
        },
        setUserAuthProvider(state, authProvider) {
            state.user.authProvider = authProvider;
        },
        setCurrentCategory(state, category) {
            state.currentCategory = category;
        },
        // setSearchResults(state, searchResults) {
        //     state.searchResults = searchResults;
        // },
        setCartProducts(state, cartProducts) { // OrderPriceSummary.vue 에서 사용
            state.cartProducts = cartProducts;
        },
        toggleLinks(state, type) { // Admin.vue 에서 사용
            if (type === 'all') {
                const newValue = !Object.values(state.showLinks).every(val => val);
                for (let key in state.showLinks) {
                    state.showLinks[key] = newValue;
                    state.icons[key] = newValue ? 'bi bi-chevron-bar-up' : 'bi bi-chevron-bar-down';
                }
            } else {
                state.showLinks[type] = !state.showLinks[type];
                state.icons[type] = state.showLinks[type] ? 'bi bi-chevron-bar-up' : 'bi bi-chevron-bar-down';
            }
        },
    },

    /** Actions: 비동기 작업을 처리하는 함수 (값을 변경하는 메소드는 mutations에 작성하고 나머지 메소드는 actions에 작성) */
    actions:{
        updateUserInfo({ commit }, userInfo) {
            commit('setUserInfo', userInfo);
        },
        updateCurrentCategory({ commit }, category) {
            commit('setCurrentCategory', category);
        },
    },

    /** Modules: 애플리케이션의 여러 부분을 모듈화하여 관리 */
    modules: {},
});

// test
store.watch((state) => state.user.id, (newId, oldId) => {
    console.log('User ID changed:', oldId, '=>', newId);
});
store.watch((state) => state.user.role, (newRole, oldRole) => {
    console.log('User ROLE changed:', oldRole, '=>', newRole);
});
store.watch((state) => state.user.authProvider, (newAuthProvider, oldAuthProvider) => {
    console.log('User AUTH PROVIDER changed:', oldAuthProvider, '=>', newAuthProvider);
});

export default store;

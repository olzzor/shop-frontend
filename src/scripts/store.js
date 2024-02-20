import {createStore} from 'vuex';

const store = createStore({

    // State: 앱의 상태(데이터)를 저장하는 객체
    state() {
        return {
            token: null,
            account: {id: 0, role:''},
            searchResults: [],
            showLinks: {notices: false, orders: false, products: false, customers: false, stats: false},
            icons: {notices: 'bi bi-chevron-bar-down', orders: 'bi bi-chevron-bar-down', products: 'bi bi-chevron-bar-down', customers: 'bi bi-chevron-bar-down', stats: 'bi bi-chevron-bar-down'},
            cartProducts: [],
        }
    },

    // Mutations: state 를 변경하는 함수(동기적으로 동작)
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setAccountId(state, id) {
            state.account.id = id;
        },
        setAccountRole(state, role) {
            state.account.role = role;
        },
        setSearchResults(state, searchResults) {
            state.searchResults = searchResults;
        },
        // Admin.vue 에서 사용
        toggleLinks(state, type) {
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
        // OrderPriceSummary.vue 에서 사용
        setCartProducts(state, cartProducts) {
            state.cartProducts = cartProducts;
        },
    },
});

// test
store.watch((state) => state.account.id, (newId, oldId) => {
    console.log('Account ID changed:', oldId, '=>', newId);
});
store.watch((state) => state.account.role, (newRole, oldRole) => {
    console.log('Account ROLE changed:', oldRole, '=>', newRole);
});

export default store;
const store = Vuex.createStore({
    state: {
        USD_rate_float: 0,
        USD_rate: "",
        HKD_rate_float: 0,
        HKD_rate: "",
        BTC: 1,
        USD: 0,
        HKD: 0,
        selected: "HKD"
    },
    mutations: {
        updateRate (state, payload) {
            state.USD_rate_float = payload.USD_rate_float;
            state.USD_rate = payload.USD_rate;
            state.HKD_rate_float = payload.HKD_rate_float;
            state.HKD_rate = payload.HKD_rate;
            state.BTC = 1;
            state.USD = payload.USD_rate_float;
            state.HKD = payload.HKD_rate_float;
        },
        updateCurrencies (state, payload) {
            state.BTC = payload.BTC;
            state.USD = payload.USD;
            state.HKD = payload.HKD;
        },
        selectCurrency (state, payload) {
            state.selected = payload;
        }
    },
    actions: {
        async updateRate ({ commit }) {
            const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice/HKD.json");
            const data = await response.json();
            const payload = {
                USD_rate_float: data.bpi.USD.rate_float,
                USD_rate: data.bpi.USD.rate,
                HKD_rate_float: data.bpi.HKD.rate_float,
                HKD_rate: data.bpi.HKD.rate
            };
            commit('updateRate', payload);    
        },
        onBTCChange ({ state, commit }, newBTC) {
            const payload = {
                BTC: newBTC,
                USD: newBTC * state.USD_rate_float,
                HKD: newBTC * state.HKD_rate_float
            };
            commit('updateCurrencies', payload);
        },
        onHKDChange ({ state, commit }, newHKD) {
            const payload = {
                BTC: newHKD / state.HKD_rate_float,
                USD: newHKD / state.HKD_rate_float * state.USD_rate_float,
                HKD: newHKD
            };
            commit('updateCurrencies', payload);
        },
        onUSDChange ({ state, commit }, newUSD) {
            const payload = {
                BTC: newUSD / state.USD_rate_float,
                USD: newUSD,
                HKD: newUSD / state.USD_rate_float * state.HKD_rate_float
            };
            commit('updateCurrencies', payload);
        },
        selectHKD ({ commit }) {
            commit('selectCurrency', "HKD")
        },
        selectUSD ({ commit }) {
            commit('selectCurrency', "USD")
        }
    }
});



Vue.createApp({
    created() {
        this.$store.dispatch('updateRate');
    },
    methods: {
        onBTCChange (e) {
            this.$store.dispatch('onBTCChange', e.target.value)
        },
        onHKDChange (e) {
            this.$store.dispatch('onHKDChange', e.target.value)
        },
        onUSDChange (e) {
            this.$store.dispatch('onUSDChange', e.target.value)
        },
        selectHKD () {
            this.$store.dispatch('selectHKD')
        },
        selectUSD () {
            this.$store.dispatch('selectUSD')
        }
    }
}).use(store).mount('#forms');


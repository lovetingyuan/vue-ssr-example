import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default function createStore () {
  return new Vuex.Store({
    state() {
      return {
        message: ''
      }
    },
    mutations: {
      setMessage(state, payload) {
        state.message = payload
      }
    },
    actions: {
      fetchMessage({commit}) {
        // mock api request
        return new Promise((resolve) => {
          setTimeout(() => {
            commit('setMessage', 'Hello, <a href="https://ssr.vuejs.org/">Vue SSR</a>.')
            resolve()
          }, 2000)
        })
      }
    },
    modules: {}
  });
}

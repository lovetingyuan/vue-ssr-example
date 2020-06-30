import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";
import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
import 'normalize.css'
import './common.css'

Vue.config.productionTip = false

Vue.use(Meta, {
  refreshOnceOnNavigation: true
})

function createApp() {
  const router = createRouter()
  const store = createStore()
  if (!process.env.VUE_APP_SERVER && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    router, store, app
  }
}

if (!process.env.VUE_APP_SERVER) {
  const { app, router } = createApp()
  router.onReady(() => {
    app.$mount('#app')
  })
}

export default context => {
  const { store, router, app } = createApp()
  sync(store, router)
  context.meta = app.$meta()
  context.rendered = () => {
    context.state = store.state
  }
  // set router's location
  router.push(context.url.replace(process.env.BASE_URL, ''))
  return new Promise((resolve, reject) => {
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ status: 404 })
      }
      resolve(app)
    }, reject)
    router.onError(reject)
  })
}

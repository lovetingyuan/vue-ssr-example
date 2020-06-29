<template>
  <div class="about">
    <h1>{{ displayMsg || 'loading...' }}</h1>
  </div>
</template>

<script>
const aboutModulePath = 'about'
const aboutModule = {
  namespaced: true,
  state() {
    return {
      aboutMsg: ''
    }
  },
  mutations: {
    setAboutMsg(state, payload) {
      state.aboutMsg = payload
    }
  },
  actions: {
    fetchAboutMsg({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setAboutMsg', 'This is an about page.')
          resolve()
        }, 1000);
      })
    }
  }
}

export default {
  name: 'About',
  metaInfo: {
    title: 'About Us',
    meta: [
      { name: 'description', content: 'This is about page.' }
    ]
  },
  serverPrefetch() {
    return this.fetchaboutmsg()
  },
  computed: {
    displayMsg() {
      if (this.$store.state[aboutModulePath]) {
        return this.$store.state[aboutModulePath].aboutMsg
      }
      return ''
    }
  },
  destroyed () {
    this.$store.unregisterModule(aboutModulePath)
  },
  beforeCreate() {
    // Set preserveState when the store already has preserved state from server side.
    this.$store.registerModule(aboutModulePath, aboutModule, { preserveState: !!this.$store.state[aboutModulePath] })
  },
  mounted() {
    if (!this.displayMsg) {
      this.fetchaboutmsg()
    }
  },
  methods: {
    fetchaboutmsg() {
      return this.$store.dispatch(aboutModulePath + '/fetchAboutMsg')
    }
  }
}
</script>

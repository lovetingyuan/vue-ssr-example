<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld :msg="msg" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  metaInfo: {
    title: 'Home Page Title',
    meta: [
      { name: 'description', content: 'This is home page.' }
    ]
  },
  serverPrefetch () {
    // return the Promise from the action
    // so that the component waits before rendering
    return this.fetchMessage()
  },
  computed: {
    msg() {
      return this.$store.state.message
    }
  },
  mounted () {
    // If we didn't already do it on the server
    // we fetch the item (will first show the loading text)
    if (!this.msg) {
      this.fetchMessage()
    }
  },
  methods: {
    fetchMessage () {
      // return the Promise from the action
      return this.$store.dispatch('fetchMessage')
    }
  }
};
</script>

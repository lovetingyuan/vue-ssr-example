<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld />
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
  }
};
</script>

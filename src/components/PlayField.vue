<template>
  <div class="div">
    <header class="header">
      <router-link
        class="link"
        to="/gameRules"
        title="Нажмите, чтобы прочитать правила"
        >Стенка на стенку</router-link
      >
    </header>

    <main>
      <MainFields class="flex-container"></MainFields>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainFields from "./MainFields.vue";

export default defineComponent({
  name: "PlayField",
  components: {
    MainFields,
  },
  data() {
    return {};
  },
  methods: {
    linkClick: function () {
      console.log("link");
    },
  },
});
</script>

<style>
.div {
  min-width: 905px;
  min-height: 540px;
}
.flex-container {
  display: flex;
}

.link {
  font-size: 40px;
  animation-name: linkAnimation;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
.link:hover {
  animation-play-state: paused;
}
.header {
  background-image: url(../assets/headerBackground.png);
}

main {
  height: 90vh;
  text-align: center;
  background-image: url(../assets/table1024x685.jpg);
}
@media screen and (min-width: 1020px) {
  main {
    background-image: url(../assets/table1300.jpg);
  }
}
@keyframes linkAnimation {
  from {
    color: blue;
  }
  50% {
    color: green;
  }
  to {
    color: red;
  }
}
</style>

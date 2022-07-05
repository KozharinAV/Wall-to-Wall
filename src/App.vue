<template>
  <div class="window">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
  data() {
    return {};
  },
  methods: {},
});
</script>

<style>
.window {
  min-height: 550px;
  min-width: 840px;
  max-width: 1300px;
}
</style>

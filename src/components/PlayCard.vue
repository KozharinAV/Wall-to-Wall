<template>
  <button class="card" :disabled="disabled">
    <img class="card" :src="cardImage" alt="Picture" />
    {{ message }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PlayCard",
  props: {
    disabled: Boolean,
    cardImage: String,
    message: String,
  },
});
</script>

<style scoped>
.card {
  border: 0;
  margin: 0px;
  padding: 0px;
  font-size: 22px;
  color: rgb(8, 8, 114);
  height: 130px;
  width: 90px;
  border-radius: 10px;
}
</style>

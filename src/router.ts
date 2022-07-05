import { createRouter, createWebHistory } from "vue-router";
import GameRules from "./components/Rules.vue";
import PlayField from "./components/PlayField.vue";
const routes = [
  { path: "/gameRules", component: GameRules },
  { path: "/", component: PlayField },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

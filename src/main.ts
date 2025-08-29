import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./assets/styles.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

library.add(faPlus, faPen, faTrash, faFilter, faChevronLeft, faChevronRight, faMoon, faSun);

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");

import { createRouter, createWebHistory } from "vue-router";

const Dashboard = () => import("../views/Dashboard.vue");
const Books = () => import("../views/Books.vue");
const BookForm = () => import("../views/BookForm.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/books", name: "books", component: Books },
    { path: "/books/new", name: "book-new", component: BookForm },
    { path: "/books/:id", name: "book-edit", component: BookForm, props: true },
  ],
});

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/add",
      name: "add-bene",
      component: require("@/views/AddBene").default,
    },
    {
      path: "/",
      name: "list-bene",
      component: require("@/views/ListBene").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});

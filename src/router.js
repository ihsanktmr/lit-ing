import { Router } from "@vaadin/router";
import "./components/employee-list.js";
import "./components/employee-form.js";

const outlet = document.querySelector("#app");

const router = new Router(outlet);

router.setRoutes([
  { path: "/", component: "employee-list" },
  { path: "/add", component: "employee-form" },
  { path: "/edit", component: "employee-form" }, // Note: No :id, we use query param instead
]);

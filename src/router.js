import { Router } from "@vaadin/router";
import "./components/employee-list.js";
import "./components/employee-form.js";

const outlet = document.querySelector("#app");

export const router = new Router(outlet);

router.setRoutes([
  {
    path: "/",
    component: "employee-list",
    action: () => {
      console.log("Navigating to employee list");
    },
  },
  {
    path: "/add",
    component: "employee-form",
    action: () => {
      console.log("Navigating to add form");
    },
  },
  {
    path: "/edit",
    component: "employee-form",
    action: (context) => {
      const params = new URLSearchParams(context.route.query);
      const id = params.get("id");
      if (id) {
        context.route.params = { id };
        console.log("Router action: Setting employee ID:", id);
        // Force a re-render of the form component
        const form = document.querySelector("employee-form");
        if (form) {
          form.employeeId = id;
          form.loadEmployee();
        }
      }
      console.log("Navigating to edit form");
    },
  },
]);

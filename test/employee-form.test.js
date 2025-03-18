import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/employee-form.js";
import { store } from "../src/store.js";

describe("Employee Form Component", () => {
  it("adds a new employee", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.shadowRoot.querySelector('input[name="firstName"]').value = "John";
    el.shadowRoot.querySelector('input[name="lastName"]').value = "Doe";
    el.shadowRoot.querySelector("form").dispatchEvent(new Event("submit"));

    expect(store.employees.length).to.equal(1);
    expect(store.employees[0].firstName).to.equal("John");
  });
});

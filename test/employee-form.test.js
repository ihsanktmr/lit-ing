import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/employee-form.js";
import { store } from "../src/store.js";

describe("Employee Form Component", () => {
  beforeEach(() => {
    // Reset store before each test
    store.employees = [];
  });

  it("adds a new employee with valid data", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Fill in the form
    el.shadowRoot.querySelector('input[name="firstName"]').value = "John";
    el.shadowRoot.querySelector('input[name="lastName"]').value = "Doe";
    el.shadowRoot.querySelector('input[name="email"]').value =
      "john.doe@example.com";
    el.shadowRoot.querySelector('input[name="phone"]').value = "+1234567890";
    el.shadowRoot.querySelector('input[name="dob"]').value = "1990-01-01";
    el.shadowRoot.querySelector('input[name="employmentDate"]').value =
      "2020-01-01";

    // Submit the form
    el.shadowRoot.querySelector("form").dispatchEvent(new Event("submit"));

    expect(store.employees.length).to.equal(1);
    expect(store.employees[0].firstName).to.equal("John");
    expect(store.employees[0].lastName).to.equal("Doe");
    expect(store.employees[0].email).to.equal("john.doe@example.com");
  });

  it("validates required fields", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Submit empty form
    el.shadowRoot.querySelector("form").dispatchEvent(new Event("submit"));

    // Check for error messages
    const firstNameError = el.shadowRoot.querySelector(
      'input[name="firstName"]'
    ).nextElementSibling.textContent;
    const lastNameError = el.shadowRoot.querySelector('input[name="lastName"]')
      .nextElementSibling.textContent;

    expect(firstNameError).to.include("required");
    expect(lastNameError).to.include("required");
    expect(store.employees.length).to.equal(0);
  });

  it("validates email format", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Fill in the form with invalid email
    el.shadowRoot.querySelector('input[name="firstName"]').value = "John";
    el.shadowRoot.querySelector('input[name="lastName"]').value = "Doe";
    el.shadowRoot.querySelector('input[name="email"]').value = "invalid-email";

    // Submit the form
    el.shadowRoot.querySelector("form").dispatchEvent(new Event("submit"));

    // Check for email error message
    const emailError = el.shadowRoot.querySelector('input[name="email"]')
      .nextElementSibling.textContent;
    expect(emailError).to.include("valid email");
    expect(store.employees.length).to.equal(0);
  });

  it("validates phone number format", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Fill in the form with invalid phone
    el.shadowRoot.querySelector('input[name="firstName"]').value = "John";
    el.shadowRoot.querySelector('input[name="lastName"]').value = "Doe";
    el.shadowRoot.querySelector('input[name="email"]').value =
      "john.doe@example.com";
    el.shadowRoot.querySelector('input[name="phone"]').value = "123"; // Invalid phone

    // Submit the form
    el.shadowRoot.querySelector("form").dispatchEvent(new Event("submit"));

    // Check for phone error message
    const phoneError = el.shadowRoot.querySelector('input[name="phone"]')
      .nextElementSibling.textContent;
    expect(phoneError).to.include("valid phone");
    expect(store.employees.length).to.equal(0);
  });
});

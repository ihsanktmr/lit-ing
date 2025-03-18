import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/employee-form.js";
import { store } from "../src/store.js";

describe("Employee Form Component", () => {
  let originalHistoryBack;

  beforeEach(() => {
    // Reset the store before each test
    store.employees = [];

    // Save original history.back
    originalHistoryBack = window.history.back;

    // Mock history.back
    window.history.back = () => {
      console.log("Mock history.back called");
    };
  });

  afterEach(() => {
    // Restore original history.back
    window.history.back = originalHistoryBack;
  });

  it("adds a new employee with valid data", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Wait for the component to render
    await el.updateComplete;

    // Fill in the form
    const form = el.shadowRoot.querySelector("form");
    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');
    const dob = form.querySelector('input[name="dob"]');
    const employmentDate = form.querySelector('input[name="employmentDate"]');
    const phone = form.querySelector('input[name="phone"]');
    const email = form.querySelector('input[name="email"]');
    const department = form.querySelector('select[name="department"]');
    const position = form.querySelector('select[name="position"]');

    firstName.value = "John";
    lastName.value = "Doe";
    dob.value = "1990-05-15";
    employmentDate.value = "2020-01-10";
    phone.value = "+90 555 123 4567";
    email.value = "john.doe@company.com";
    department.value = "Tech";
    position.value = "Senior";

    // Dispatch input events to trigger the change handlers
    firstName.dispatchEvent(new Event("input"));
    lastName.dispatchEvent(new Event("input"));
    dob.dispatchEvent(new Event("input"));
    employmentDate.dispatchEvent(new Event("input"));
    phone.dispatchEvent(new Event("input"));
    email.dispatchEvent(new Event("input"));
    department.dispatchEvent(new Event("change"));
    position.dispatchEvent(new Event("change"));

    // Mock the confirmation dialog
    window.confirm = () => true;

    // Submit the form
    form.dispatchEvent(new Event("submit"));

    // Wait for the store to update
    await el.updateComplete;

    expect(store.employees.length).to.equal(1);
    expect(store.employees[0].firstName).to.equal("John");
    expect(store.employees[0].lastName).to.equal("Doe");
  });

  it("validates required fields", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Wait for the component to render
    await el.updateComplete;

    // Submit the form without filling in required fields
    const form = el.shadowRoot.querySelector("form");
    form.dispatchEvent(new Event("submit"));

    // Wait for validation
    await el.updateComplete;

    // Check for validation messages
    const errors = el.shadowRoot.querySelectorAll(".error");
    const errorMessages = Array.from(errors).map((error) => error.textContent);

    expect(errorMessages.some((msg) => msg.includes("required"))).to.be.true;
  });

  it("validates email format", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Wait for the component to render
    await el.updateComplete;

    // Fill in all required fields
    const form = el.shadowRoot.querySelector("form");
    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');
    const email = form.querySelector('input[name="email"]');
    const phone = form.querySelector('input[name="phone"]');

    firstName.value = "John";
    lastName.value = "Doe";
    phone.value = "+90 555 123 4567";
    email.value = "invalid-email";

    // Dispatch input events
    firstName.dispatchEvent(new Event("input"));
    lastName.dispatchEvent(new Event("input"));
    phone.dispatchEvent(new Event("input"));
    email.dispatchEvent(new Event("input"));

    // Submit the form
    form.dispatchEvent(new Event("submit"));

    // Wait for validation
    await el.updateComplete;

    // Check for validation message
    const errors = Array.from(el.shadowRoot.querySelectorAll(".error"));
    const emailError = errors.find((error) =>
      error.textContent.includes("email")
    );
    expect(emailError.textContent).to.include("valid email");
  });

  it("validates phone number format", async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Wait for the component to render
    await el.updateComplete;

    // Fill in all required fields
    const form = el.shadowRoot.querySelector("form");
    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');
    const email = form.querySelector('input[name="email"]');
    const phone = form.querySelector('input[name="phone"]');

    firstName.value = "John";
    lastName.value = "Doe";
    email.value = "john.doe@company.com";
    phone.value = "123";

    // Dispatch input events
    firstName.dispatchEvent(new Event("input"));
    lastName.dispatchEvent(new Event("input"));
    email.dispatchEvent(new Event("input"));
    phone.dispatchEvent(new Event("input"));

    // Submit the form
    form.dispatchEvent(new Event("submit"));

    // Wait for validation
    await el.updateComplete;

    // Check for validation message
    const errors = Array.from(el.shadowRoot.querySelectorAll(".error"));
    const phoneError = errors.find((error) =>
      error.textContent.includes("phone")
    );
    expect(phoneError.textContent).to.include("valid phone");
  });

  it("navigates back when cancel button is clicked", async () => {
    let historyBackCalled = false;
    window.history.back = () => {
      historyBackCalled = true;
    };

    const el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    const cancelButton = el.shadowRoot.querySelector('button[type="button"]');
    cancelButton.click();

    expect(historyBackCalled).to.be.true;
  });
});

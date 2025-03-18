import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/employee-list.js";
import { store } from "../src/store.js";

describe("Employee List Component", () => {
  beforeEach(() => {
    // Reset the store with test data
    store.employees = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        dob: "1990-05-15",
        employmentDate: "2020-01-10",
        phone: "+90 555 123 4567",
        email: "john.doe@company.com",
        department: "Tech",
        position: "Senior",
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        dob: "1992-08-23",
        employmentDate: "2021-03-15",
        phone: "+90 555 234 5678",
        email: "jane.smith@company.com",
        department: "Analytics",
        position: "Medior",
      },
    ];
  });

  it("renders employee records correctly", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    // Wait for the component to render
    await el.updateComplete;

    // Get all table cells for the first employee
    const firstEmployeeRow = el.shadowRoot.querySelector("tr:nth-child(2)");
    const cells = firstEmployeeRow.querySelectorAll("td");

    // Check if the cells contain the correct data
    expect(cells[0].textContent.trim()).to.equal("John");
    expect(cells[1].textContent.trim()).to.equal("Doe");
    expect(cells[4].textContent.trim()).to.equal("+90 555 123 4567");
    expect(cells[5].textContent.trim()).to.equal("john.doe@company.com");
    expect(cells[6].textContent.trim()).to.equal("Tech");
    expect(cells[7].textContent.trim()).to.equal("Senior");
  });

  it("deletes an employee when delete button is clicked", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    // Wait for the component to render
    await el.updateComplete;

    // Mock the confirmation dialog
    window.confirm = () => true;

    // Find and click the delete button for the first employee
    const deleteButton = el.shadowRoot.querySelector(
      "tr:nth-child(2) button:last-child"
    );
    deleteButton.click();

    // Wait for the store to update
    await el.updateComplete;

    // Check if the employee was deleted
    expect(store.employees.length).to.equal(1);
    expect(store.employees[0].id).to.equal("2");
  });

  it("displays correct department and position options", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    // Wait for the component to render
    await el.updateComplete;

    // Get all table cells for both employees
    const firstEmployeeRow = el.shadowRoot.querySelector("tr:nth-child(2)");
    const secondEmployeeRow = el.shadowRoot.querySelector("tr:nth-child(3)");

    // Check department cells
    expect(
      firstEmployeeRow.querySelector("td:nth-child(7)").textContent.trim()
    ).to.equal("Tech");
    expect(
      secondEmployeeRow.querySelector("td:nth-child(7)").textContent.trim()
    ).to.equal("Analytics");

    // Check position cells
    expect(
      firstEmployeeRow.querySelector("td:nth-child(8)").textContent.trim()
    ).to.equal("Senior");
    expect(
      secondEmployeeRow.querySelector("td:nth-child(8)").textContent.trim()
    ).to.equal("Medior");
  });
});

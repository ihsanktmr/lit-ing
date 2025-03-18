import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/employee-list.js";
import { store } from "../src/store.js";

describe("Employee List Component", () => {
  beforeEach(() => {
    // Reset store with test data
    store.employees = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Johnson",
        department: "Tech",
        position: "Senior",
        email: "alice@example.com",
        phone: "+1234567890",
        dob: "1990-01-01",
        employmentDate: "2020-01-01",
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        department: "Analytics",
        position: "Junior",
        email: "bob@example.com",
        phone: "+0987654321",
        dob: "1995-01-01",
        employmentDate: "2021-01-01",
      },
    ];
  });

  it("renders employee records correctly", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const rows = el.shadowRoot.querySelectorAll("tr");

    // Check number of rows (header + 2 employees)
    expect(rows.length).to.equal(3);

    // Check header row
    const headerRow = rows[0];
    expect(headerRow.textContent).to.include("Name");
    expect(headerRow.textContent).to.include("Department");
    expect(headerRow.textContent).to.include("Position");

    // Check first employee row
    const firstEmployeeRow = rows[1];
    expect(firstEmployeeRow.textContent).to.include("Alice Johnson");
    expect(firstEmployeeRow.textContent).to.include("Tech");
    expect(firstEmployeeRow.textContent).to.include("Senior");
  });

  it("deletes an employee when delete button is clicked", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const deleteButtons = el.shadowRoot.querySelectorAll("button");

    // Delete first employee
    deleteButtons[0].click();

    expect(store.employees.length).to.equal(1);
    expect(store.employees[0].firstName).to.equal("Bob");
  });

  it("navigates to edit form when edit button is clicked", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const editButtons = el.shadowRoot.querySelectorAll(
      'button[data-action="edit"]'
    );

    // Click edit button for first employee
    editButtons[0].click();

    // Check if URL contains edit path with correct ID
    expect(window.location.href).to.include("/edit?id=1");
  });

  it("displays correct department and position options", async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    // Check if department options are present
    const departmentCells = el.shadowRoot.querySelectorAll("td:nth-child(2)");
    expect(departmentCells[0].textContent).to.equal("Tech");
    expect(departmentCells[1].textContent).to.equal("Analytics");

    // Check if position options are present
    const positionCells = el.shadowRoot.querySelectorAll("td:nth-child(3)");
    expect(positionCells[0].textContent).to.equal("Senior");
    expect(positionCells[1].textContent).to.equal("Junior");
  });
});

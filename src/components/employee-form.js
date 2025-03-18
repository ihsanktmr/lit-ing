import { LitElement, html, css } from "lit";

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    errors: { type: Object },
    language: { type: String },
    employeeId: { type: String },
  };

  constructor() {
    super();
    this.employee = {
      firstName: "",
      lastName: "",
      dob: "",
      employmentDate: "",
      phone: "",
      email: "",
      department: "Analytics",
      position: "Junior",
    };
    this.errors = {};
    this.language = document.documentElement.lang || "en";
    this.employeeId = null; // New property to track editing mode
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateLanguage();
    document.documentElement.addEventListener(
      "lang-change",
      this.updateLanguage.bind(this)
    );

    // Check if this is an edit mode
    const urlParams = new URLSearchParams(window.location.search);
    this.employeeId = urlParams.get("id");

    if (this.employeeId) {
      this.loadEmployee();
    }
  }

  loadEmployee() {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const foundEmployee = employees.find((emp) => emp.id === this.employeeId);
    if (foundEmployee) {
      this.employee = { ...foundEmployee }; // Pre-fill form
    }
  }

  saveEmployee() {
    if (!this.validateForm()) return;

    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (this.employeeId) {
      // Edit Mode: Update existing employee
      const index = employees.findIndex((emp) => emp.id === this.employeeId);
      if (index !== -1) {
        employees[index] = { ...this.employee, id: this.employeeId };
      }
    } else {
      // Add Mode: Create new employee
      this.employee.id = Date.now().toString(); // Generate unique ID
      employees.push(this.employee);
    }

    localStorage.setItem("employees", JSON.stringify(employees));

    window.location.href = "/";
  }

  render() {
    const t = this.translations[this.language];

    return html`
      <h2>${this.employeeId ? t.editEmployee : t.addEmployee}</h2>
      <form @submit="${(e) => e.preventDefault()}">
        <label>${t.firstName}</label>
        <input
          type="text"
          name="firstName"
          .value="${this.employee.firstName}"
          @input="${this.handleChange}"
        />
        <div class="error">${this.errors.firstName || ""}</div>

        <label>${t.lastName}</label>
        <input
          type="text"
          name="lastName"
          .value="${this.employee.lastName}"
          @input="${this.handleChange}"
        />
        <div class="error">${this.errors.lastName || ""}</div>

        <label>${t.dob}</label>
        <input
          type="date"
          name="dob"
          .value="${this.employee.dob}"
          @input="${this.handleChange}"
        />

        <label>${t.employmentDate}</label>
        <input
          type="date"
          name="employmentDate"
          .value="${this.employee.employmentDate}"
          @input="${this.handleChange}"
        />

        <label>${t.phone}</label>
        <input
          type="text"
          name="phone"
          .value="${this.employee.phone}"
          @input="${this.handleChange}"
        />
        <div class="error">${this.errors.phone || ""}</div>

        <label>${t.email}</label>
        <input
          type="email"
          name="email"
          .value="${this.employee.email}"
          @input="${this.handleChange}"
        />
        <div class="error">${this.errors.email || ""}</div>

        <label>${t.department}</label>
        <select name="department" @change="${this.handleChange}">
          <option
            value="Analytics"
            ?selected="${this.employee.department === "Analytics"}"
          >
            Analytics
          </option>
          <option
            value="Tech"
            ?selected="${this.employee.department === "Tech"}"
          >
            Tech
          </option>
        </select>

        <label>${t.position}</label>
        <select name="position" @change="${this.handleChange}">
          <option
            value="Junior"
            ?selected="${this.employee.position === "Junior"}"
          >
            Junior
          </option>
          <option
            value="Medior"
            ?selected="${this.employee.position === "Medior"}"
          >
            Medior
          </option>
          <option
            value="Senior"
            ?selected="${this.employee.position === "Senior"}"
          >
            Senior
          </option>
        </select>

        <button @click="${this.saveEmployee}">${t.save}</button>
        <button @click="${() => (window.location.href = "/")}" type="button">
          ${t.cancel}
        </button>
      </form>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);

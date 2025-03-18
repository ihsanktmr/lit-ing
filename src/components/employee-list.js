import { LitElement, html, css } from "lit";

class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: auto;
      font-family: Arial, sans-serif;
    }
    .controls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    input {
      padding: 5px;
      font-size: 14px;
    }
    button {
      padding: 5px 10px;
      cursor: pointer;
      background: #0078d4;
      color: white;
      border: none;
      border-radius: 5px;
    }
    .view-toggle {
      background: gray;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background: #f4f4f4;
    }
    .list-view {
      list-style: none;
      padding: 0;
    }
    .list-view li {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 5px;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .pagination button {
      margin: 2px;
      background: gray;
    }
  `;

  static properties = {
    employees: { type: Array },
    searchQuery: { type: String },
    viewMode: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    language: { type: String },
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.searchQuery = "";
    this.viewMode = "table";
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.language = document.documentElement.lang || "en";
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateLanguage();
    document.documentElement.addEventListener(
      "lang-change",
      this.updateLanguage.bind(this)
    );
  }

  disconnectedCallback() {
    document.documentElement.removeEventListener(
      "lang-change",
      this.updateLanguage.bind(this)
    );
    super.disconnectedCallback();
  }

  updateLanguage() {
    this.language = document.documentElement.lang || "en";
    this.requestUpdate();
  }

  translations = {
    en: {
      search: "Search employees...",
      toggle: "Toggle View",
      firstName: "First Name",
      lastName: "Last Name",
      department: "Department",
      position: "Position",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this employee?",
    },
    tr: {
      search: "Çalışanları ara...",
      toggle: "Görünümü Değiştir",
      firstName: "Adı",
      lastName: "Soyadı",
      department: "Departman",
      position: "Pozisyon",
      actions: "İşlemler",
      edit: "Düzenle",
      delete: "Sil",
      confirmDelete: "Bu çalışanı silmek istediğinize emin misiniz?",
    },
  };

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  toggleView() {
    this.viewMode = this.viewMode === "table" ? "list" : "table";
  }

  deleteEmployee(employeeId) {
    const t = this.translations[store.language];
    if (!confirm(t.deleteConfirm)) return;

    store.deleteEmployee(employeeId);
    this.requestUpdate();
  }

  handleSubmit() {
    if (this.employee.id) {
      store.updateEmployee(this.employee);
    } else {
      this.employee.id = Date.now().toString();
      store.addEmployee(this.employee);
    }

    window.location.href = "/";
  }

  saveEmployee() {
    if (!this.validateForm()) return;

    if (this.employeeId) {
      if (!confirm("Are you sure you want to update this employee?")) {
        return;
      }
    }

    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (this.employeeId) {
      // Edit Mode: Update existing employee
      const index = employees.findIndex((emp) => emp.id === this.employeeId);
      if (index !== -1) {
        employees[index] = { ...this.employee, id: this.employeeId };
      }
    } else {
      // Add Mode: Create new employee
      this.employee.id = Date.now().toString();
      employees.push(this.employee);
    }

    localStorage.setItem("employees", JSON.stringify(employees));

    window.location.href = "/";
  }

  getFilteredEmployees() {
    return this.employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(this.searchQuery) ||
        emp.lastName.toLowerCase().includes(this.searchQuery)
    );
  }

  changePage(page) {
    this.currentPage = page;
  }

  render() {
    const t = this.translations[this.language];
    const filteredEmployees = this.getFilteredEmployees();
    const totalPages = Math.ceil(filteredEmployees.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(start, end);

    return html`
      <div class="controls">
        <input
          type="text"
          @input="${this.handleSearch}"
          placeholder="${t.search}"
        />

        <button @click="${() => (window.location.href = "/add")}">
          + Add Employee
        </button>

        <button
          @click="${() => (window.location.href = `/edit?id=${employee.id}`)}"
        >
          ✏️ Edit
        </button>

        <button @click="${() => this.deleteEmployee(employee.id)}">
          🗑️ Delete
        </button>

        <button class="view-toggle" @click="${this.toggleView}">
          ${t.toggle} (${this.viewMode})
        </button>
      </div>

      ${this.viewMode === "table"
        ? html`
            <table>
              <tr>
                <th>${t.firstName}</th>
                <th>${t.lastName}</th>
                <th>${t.department}</th>
                <th>${t.position}</th>
                <th>${t.actions}</th>
              </tr>
              ${paginatedEmployees.map(
                (emp, index) => html`
                  <tr>
                    <td>${emp.firstName}</td>
                    <td>${emp.lastName}</td>
                    <td>${emp.department}</td>
                    <td>${emp.position}</td>
                    <td>
                      <button @click="${() => this.editEmployee(index)}">
                        ${t.edit}
                      </button>
                      <button @click="${() => this.deleteEmployee(index)}">
                        ${t.delete}
                      </button>
                    </td>
                  </tr>
                `
              )}
            </table>
          `
        : html`
            <ul class="list-view">
              ${paginatedEmployees.map(
                (emp, index) => html`
                  <li>
                    <strong>${emp.firstName} ${emp.lastName}</strong><br />
                    ${t.department}: ${emp.department}<br />
                    ${t.position}: ${emp.position}<br />
                    <button @click="${() => this.editEmployee(index)}">
                      ${t.edit}
                    </button>
                    <button @click="${() => this.deleteEmployee(index)}">
                      ${t.delete}
                    </button>
                  </li>
                `
              )}
            </ul>
          `}

      <div class="pagination">
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => html`
            <button
              @click="${() => this.changePage(page)}"
              ?disabled="${this.currentPage === page}"
            >
              ${page}
            </button>
          `
        )}
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);

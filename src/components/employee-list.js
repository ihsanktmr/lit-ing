import { LitElement, html, css } from "lit";
import { store } from "../store.js";
import { router } from "../router.js";

class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
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
      margin-top: 20px;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
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
    .search-container {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .search-input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
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
    this.employees = store.employees;
    this.searchQuery = "";
    this.viewMode = "table";
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.language = store.language;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateLanguage();
    this.employees = store.employees; // Ensure we have the latest data
    this.requestUpdate();

    // Listen for store updates
    window.addEventListener("store-updated", () => {
      this.employees = store.employees;
      this.requestUpdate();
    });

    window.addEventListener("language-changed", (e) => {
      this.language = e.detail.language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("language-changed");
    window.removeEventListener("store-updated");
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
      dob: "Date of Birth",
      employmentDate: "Employment Date",
      phone: "Phone",
      email: "Email",
      department: "Department",
      position: "Position",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this employee?",
      addEmployee: "Add Employee",
      noResults: "No employees found",
    },
    tr: {
      search: "Çalışanları ara...",
      toggle: "Görünümü Değiştir",
      firstName: "Adı",
      lastName: "Soyadı",
      dob: "Doğum Tarihi",
      employmentDate: "İşe Başlama Tarihi",
      phone: "Telefon",
      email: "E-posta",
      department: "Departman",
      position: "Pozisyon",
      actions: "İşlemler",
      edit: "Düzenle",
      delete: "Sil",
      confirmDelete: "Bu çalışanı silmek istediğinize emin misiniz?",
      addEmployee: "Çalışan Ekle",
      noResults: "Çalışan bulunamadı",
    },
  };

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
  }

  toggleView() {
    this.viewMode = this.viewMode === "table" ? "list" : "table";
  }

  deleteEmployee(employeeId) {
    const t = this.translations[this.language];
    if (!confirm(t.confirmDelete)) return;

    store.deleteEmployee(employeeId);
    this.employees = store.employees;
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
        emp.lastName.toLowerCase().includes(this.searchQuery) ||
        emp.email.toLowerCase().includes(this.searchQuery) ||
        emp.phone.includes(this.searchQuery)
    );
  }

  changePage(page) {
    this.currentPage = page;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
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
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            @input="${this.handleSearch}"
            placeholder="${t.search}"
          />
          <button class="view-toggle" @click="${this.toggleView}">
            ${t.toggle} (${this.viewMode})
          </button>
        </div>
        <button @click="${() => router.go("/add")}">+ ${t.addEmployee}</button>
      </div>

      ${filteredEmployees.length === 0
        ? html`<p>${t.noResults}</p>`
        : this.viewMode === "table"
        ? html`
            <table>
              <tr>
                <th>${t.firstName}</th>
                <th>${t.lastName}</th>
                <th>${t.dob}</th>
                <th>${t.employmentDate}</th>
                <th>${t.phone}</th>
                <th>${t.email}</th>
                <th>${t.department}</th>
                <th>${t.position}</th>
                <th>${t.actions}</th>
              </tr>
              ${paginatedEmployees.map(
                (emp) => html`
                  <tr>
                    <td>${emp.firstName}</td>
                    <td>${emp.lastName}</td>
                    <td>${this.formatDate(emp.dob)}</td>
                    <td>${this.formatDate(emp.employmentDate)}</td>
                    <td>${emp.phone}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>${emp.position}</td>
                    <td>
                      <button
                        @click="${() => {
                          console.log(
                            "Edit button clicked for employee:",
                            emp.id
                          );
                          window.location.href = `/edit?id=${emp.id}`;
                        }}"
                      >
                        ${t.edit}
                      </button>
                      <button @click="${() => this.deleteEmployee(emp.id)}">
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
                (emp) => html`
                  <li>
                    <strong>${emp.firstName} ${emp.lastName}</strong><br />
                    ${t.dob}: ${this.formatDate(emp.dob)}<br />
                    ${t.employmentDate}:
                    ${this.formatDate(emp.employmentDate)}<br />
                    ${t.phone}: ${emp.phone}<br />
                    ${t.email}: ${emp.email}<br />
                    ${t.department}: ${emp.department}<br />
                    ${t.position}: ${emp.position}<br />
                    <button
                      @click="${() => {
                        console.log(
                          "Edit button clicked for employee:",
                          emp.id
                        );
                        window.location.href = `/edit?id=${emp.id}`;
                      }}"
                    >
                      ${t.edit}
                    </button>
                    <button @click="${() => this.deleteEmployee(emp.id)}">
                      ${t.delete}
                    </button>
                  </li>
                `
              )}
            </ul>
          `}
      ${totalPages > 1
        ? html`
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
          `
        : ""}
    `;
  }
}

customElements.define("employee-list", EmployeeList);

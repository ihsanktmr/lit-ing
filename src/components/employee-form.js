import { LitElement, html, css } from "lit";
import { store } from "../store.js";

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    errors: { type: Object },
    language: { type: String },
    employeeId: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input,
    select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .error {
      color: red;
      font-size: 12px;
      margin-top: 2px;
    }
    button {
      padding: 10px;
      background: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    button[type="button"] {
      background: #666;
    }
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `;

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
    this.language = store.language;
    this.employeeId = null;
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

    // Listen for language changes
    window.addEventListener("language-changed", (e) => {
      this.language = e.detail.language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up event listener
    window.removeEventListener("language-changed");
  }

  loadEmployee() {
    const foundEmployee = store.employees.find(
      (emp) => emp.id === this.employeeId
    );
    if (foundEmployee) {
      this.employee = { ...foundEmployee };
    }
  }

  validateForm() {
    this.errors = {};
    let isValid = true;

    // First Name validation
    if (!this.employee.firstName.trim()) {
      this.errors.firstName =
        this.translations[this.language].firstNameRequired;
      isValid = false;
    }

    // Last Name validation
    if (!this.employee.lastName.trim()) {
      this.errors.lastName = this.translations[this.language].lastNameRequired;
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.employee.email)) {
      this.errors.email = this.translations[this.language].invalidEmail;
      isValid = false;
    }

    // Phone validation (basic format)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(this.employee.phone)) {
      this.errors.phone = this.translations[this.language].invalidPhone;
      isValid = false;
    }

    // Check for duplicate email
    const existingEmployee = store.employees.find(
      (emp) => emp.email === this.employee.email && emp.id !== this.employeeId
    );
    if (existingEmployee) {
      this.errors.email = this.translations[this.language].emailExists;
      isValid = false;
    }

    return isValid;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };
    // Clear error when user starts typing
    if (this.errors[name]) {
      this.errors = { ...this.errors, [name]: null };
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) return;

    if (this.employeeId) {
      store.updateEmployee(this.employee);
    } else {
      store.addEmployee(this.employee);
    }

    window.location.href = "/";
  }

  translations = {
    en: {
      addEmployee: "Add New Employee",
      editEmployee: "Edit Employee",
      firstName: "First Name",
      lastName: "Last Name",
      dob: "Date of Birth",
      employmentDate: "Employment Date",
      phone: "Phone Number",
      email: "Email Address",
      department: "Department",
      position: "Position",
      save: "Save",
      cancel: "Cancel",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
      emailExists: "This email is already registered",
    },
    tr: {
      addEmployee: "Yeni Çalışan Ekle",
      editEmployee: "Çalışan Düzenle",
      firstName: "Adı",
      lastName: "Soyadı",
      dob: "Doğum Tarihi",
      employmentDate: "İşe Başlama Tarihi",
      phone: "Telefon Numarası",
      email: "E-posta Adresi",
      department: "Departman",
      position: "Pozisyon",
      save: "Kaydet",
      cancel: "İptal",
      firstNameRequired: "Ad alanı zorunludur",
      lastNameRequired: "Soyad alanı zorunludur",
      invalidEmail: "Geçerli bir e-posta adresi giriniz",
      invalidPhone: "Geçerli bir telefon numarası giriniz",
      emailExists: "Bu e-posta adresi zaten kayıtlı",
    },
  };

  render() {
    const t = this.translations[this.language];

    return html`
      <h2>${this.employeeId ? t.editEmployee : t.addEmployee}</h2>
      <form @submit="${this.handleSubmit}">
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

        <div class="button-group">
          <button type="submit">${t.save}</button>
          <button type="button" @click="${() => (window.location.href = "/")}">
            ${t.cancel}
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);

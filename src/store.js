import { reactive } from "@lit/reactive-element";

console.log("Initializing store...");

// Global state
export const store = reactive({
  employees: JSON.parse(localStorage.getItem("employees")) || [],
  language: localStorage.getItem("language") || "en",

  addEmployee(employee) {
    this.employees = [...this.employees, employee];
    this.save();
  },

  updateEmployee(updatedEmployee) {
    this.employees = this.employees.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    this.save();
  },

  deleteEmployee(employeeId) {
    this.employees = this.employees.filter((emp) => emp.id !== employeeId);
    this.save();
  },

  save() {
    localStorage.setItem("employees", JSON.stringify(this.employees));
  },

  setLanguage(lang) {
    console.log("Setting language to:", lang);
    this.language = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
  },

  loadLanguage() {
    const savedLang = localStorage.getItem("language") || "en";
    console.log("Loading language:", savedLang);
    this.language = savedLang;
    document.documentElement.lang = savedLang;
  },
});

// Initialize language setting on page load
store.loadLanguage();

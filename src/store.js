console.log("Initializing store...");

// Mock data for testing
const mockEmployees = [
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
  {
    id: "3",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    dob: "1995-12-01",
    employmentDate: "2022-06-20",
    phone: "+90 555 345 6789",
    email: "ahmet.yilmaz@company.com",
    department: "Tech",
    position: "Junior",
  },
];

// Global state
export const store = {
  employees: [],
  language: localStorage.getItem("language") || "en",

  init() {
    // Load employees from localStorage or use mock data
    const savedEmployees = localStorage.getItem("employees");
    if (savedEmployees) {
      this.employees = JSON.parse(savedEmployees);
    } else {
      this.employees = [...mockEmployees];
      this.save();
    }
    console.log("Store initialized with employees:", this.employees);
  },

  addEmployee(employee) {
    this.employees = [...this.employees, employee];
    this.save();
    this.notifyStoreUpdate();
  },

  updateEmployee(updatedEmployee) {
    this.employees = this.employees.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    this.save();
    this.notifyStoreUpdate();
  },

  deleteEmployee(employeeId) {
    this.employees = this.employees.filter((emp) => emp.id !== employeeId);
    this.save();
    this.notifyStoreUpdate();
  },

  save() {
    localStorage.setItem("employees", JSON.stringify(this.employees));
    console.log("Saved employees to localStorage:", this.employees);
  },

  setLanguage(lang) {
    console.log("Setting language to:", lang);
    this.language = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
    // Dispatch a custom event when language changes
    window.dispatchEvent(
      new CustomEvent("language-changed", { detail: { language: lang } })
    );
  },

  loadLanguage() {
    const savedLang = localStorage.getItem("language") || "en";
    console.log("Loading language:", savedLang);
    this.language = savedLang;
    document.documentElement.lang = savedLang;
  },

  // Add reset function
  reset() {
    localStorage.removeItem("employees");
    localStorage.removeItem("language");
    this.employees = [...mockEmployees];
    this.language = "en";
    this.save();
    this.loadLanguage();
    // Force a page reload to ensure all components are updated
    window.location.reload();
  },

  notifyStoreUpdate() {
    window.dispatchEvent(new CustomEvent("store-updated"));
  },
};

// Initialize store immediately
store.init();

// Initialize language setting on page load
store.loadLanguage();

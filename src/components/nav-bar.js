import { LitElement, html, css } from "lit";
import { store } from "../store.js";

class NavBar extends LitElement {
  static styles = css`
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0077cc;
      padding: 1rem;
      color: white;
      font-size: 1.2rem;
    }

    a {
      color: white;
      text-decoration: none;
      margin: 0 1rem;
    }

    .menu {
      display: flex;
      align-items: center;
    }

    .menu a:hover {
      text-decoration: underline;
    }

    select, button {
      margin-left: 1rem;
      padding: 0.2rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
    }

    button {
      background: #ff4444;
      color: white;
    }

    /* Mobile Styles */
    @media (max-width: 600px) {
      nav {
        flex-direction: column;
        text-align: center;
      }

      .menu {
        flex-direction: column;
      }

      a {
        margin: 0.5rem 0;
      }

      select, button {
        margin-top: 0.5rem;
      }
    }
  `;

  static properties = {
    language: { type: String },
  };

  constructor() {
    super();
    this.language = store.language;
  }

  changeLanguage(event) {
    const newLang = event.target.value;
    console.log("Changing language to:", newLang);
    store.setLanguage(newLang);
    this.language = newLang;
  }

  resetData() {
    if (confirm("Are you sure you want to reset all data to initial state?")) {
      store.reset();
    }
  }

  render() {
    return html`
      <nav>
        <div><strong>HR Management</strong></div>
        <div class="menu">
          <a href="/"
            >${this.language === "tr" ? "🏠 Çalışanlar" : "🏠 Employees"}</a
          >
          <a href="/add"
            >${this.language === "tr"
              ? "➕ Çalışan Ekle"
              : "➕ Add Employee"}</a
          >
          <select @change="${this.changeLanguage}" .value="${this.language}">
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
          <button @click="${this.resetData}">Reset Data</button>
        </div>
      </nav>
    `;
  }
}

customElements.define("nav-bar", NavBar);

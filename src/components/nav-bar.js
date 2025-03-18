import { LitElement, html, css } from "lit";

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

    select {
      margin-left: 1rem;
      padding: 0.2rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
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

      select {
        margin-top: 0.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.language = "en"; // Default language
    this.initializeStore();
  }

  async initializeStore() {
    try {
      const { store } = await import("../store.js");
      this.language = store.language;
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading store:", error);
    }
  }

  async changeLanguage(event) {
    try {
      const { store } = await import("../store.js");
      store.setLanguage(event.target.value);
      this.language = store.language;
      this.requestUpdate();
    } catch (error) {
      console.error("Error changing language:", error);
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
          <select @change="${this.changeLanguage}">
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </nav>
    `;
  }
}

customElements.define("nav-bar", NavBar);

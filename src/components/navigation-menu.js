import { LitElement, html, css } from "lit";

class NavigationMenu extends LitElement {
  static styles = css`
    nav {
      background: #0078d4;
      padding: 10px;
      display: flex;
      gap: 15px;
    }
    a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      padding: 5px 10px;
    }
    a:hover {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
    }
    .language-switch {
      margin-left: auto;
      cursor: pointer;
    }
  `;

  static properties = {
    language: { type: String },
  };

  constructor() {
    super();
    this.language = document.documentElement.lang || "en";
  }

  switchLanguage() {
    this.language = this.language === "en" ? "tr" : "en";
    document.documentElement.lang = this.language;
    document.documentElement.dispatchEvent(new Event("lang-change"));
    this.requestUpdate();
  }

  render() {
    const labels = {
      en: { home: "Employee List", add: "Add Employee", lang: "🇬🇧 English" },
      tr: { home: "Çalışan Listesi", add: "Çalışan Ekle", lang: "🇹🇷 Türkçe" },
    };

    return html`
      <nav>
        <a href="/">${labels[this.language].home}</a>
        <a href="/add">${labels[this.language].add}</a>
        <span class="language-switch" @click="${this.switchLanguage}">
          ${labels[this.language].lang}
        </span>
      </nav>
    `;
  }
}

customElements.define("navigation-menu", NavigationMenu);

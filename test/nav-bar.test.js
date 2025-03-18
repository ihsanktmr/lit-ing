import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/nav-bar.js";
import { store } from "../src/store.js";

describe("NavBar Component", () => {
  beforeEach(() => {
    // Reset store language before each test
    store.language = "en";
  });

  it("switches language to Turkish", async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    el.shadowRoot.querySelector("select").value = "tr";
    el.shadowRoot.querySelector("select").dispatchEvent(new Event("change"));

    expect(store.language).to.equal("tr");
  });

  it("switches language to English", async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    el.shadowRoot.querySelector("select").value = "en";
    el.shadowRoot.querySelector("select").dispatchEvent(new Event("change"));

    expect(store.language).to.equal("en");
  });

  it("displays correct language options", async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    const select = el.shadowRoot.querySelector("select");

    expect(select.options.length).to.equal(2);
    expect(select.options[0].value).to.equal("en");
    expect(select.options[1].value).to.equal("tr");
  });

  it("initializes with store language", async () => {
    store.language = "tr";
    const el = await fixture(html`<nav-bar></nav-bar>`);
    const select = el.shadowRoot.querySelector("select");

    expect(select.value).to.equal("tr");
  });
});

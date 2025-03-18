import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/nav-bar.js";
import { store } from "../src/store.js";

describe("NavBar Component", () => {
  it("switches language", async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    el.shadowRoot.querySelector("select").value = "tr";
    el.shadowRoot.querySelector("select").dispatchEvent(new Event("change"));

    expect(store.language).to.equal("tr");
  });
});
